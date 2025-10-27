'use server';

import { auth } from '@clerk/nextjs/server';
import db from '@/db/drizzle';
import { userVocabSrs } from '@/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

const MAX_LEVEL = 8;
const MIN_LEVEL = 1;

const IS_DEBUG = process.env.SRS_DEBUG === 'true';
const L1_INTERVAL_SQL = IS_DEBUG ? sql`INTERVAL '1 minute'` : sql`INTERVAL '4 hours'`;

// Intervals for promotion: based on the *new* level after +1
const INTERVAL_CASE_UP = sql`
  CASE LEAST(${userVocabSrs.srsLevel} + 1, ${MAX_LEVEL})
    WHEN 1 THEN ${L1_INTERVAL_SQL}
    WHEN 2 THEN INTERVAL '8 hours'
    WHEN 3 THEN INTERVAL '1 day'
    WHEN 4 THEN INTERVAL '2 days'
    WHEN 5 THEN INTERVAL '1 week'
    WHEN 6 THEN INTERVAL '2 weeks'
    WHEN 7 THEN INTERVAL '1 month'
    WHEN 8 THEN INTERVAL '4 months'
  END
`;

// Intervals for demotion: based on the *new* level after -1
const INTERVAL_CASE_DOWN = sql`
  CASE GREATEST(${userVocabSrs.srsLevel} - 1, ${MIN_LEVEL})  -- ✅ GREATEST (floor at 1)
    WHEN 1 THEN ${L1_INTERVAL_SQL}
    WHEN 2 THEN INTERVAL '8 hours'
    WHEN 3 THEN INTERVAL '1 day'
    WHEN 4 THEN INTERVAL '2 days'
    WHEN 5 THEN INTERVAL '1 week'
    WHEN 6 THEN INTERVAL '2 weeks'
    WHEN 7 THEN INTERVAL '1 month'
    WHEN 8 THEN INTERVAL '4 months'
  END
`;

/**
 * After a lesson quiz passes for a set of vocabIds, set them to SRS level 1
 * and schedule next review using the L1 interval (1 min in dev, 4h in prod).
 * Preserves firstLearnedAt on conflict.
 */
export async function setSrsToOne({ vocabIds }: { vocabIds: number[] }) {
  const { userId } = await auth();
  if (!userId || !vocabIds?.length) return;

  await db
    .insert(userVocabSrs)
    .values(
      vocabIds.map((id) => ({
        userId,
        vocabId: id,
        srsLevel: 1,
        firstLearnedAt: new Date(),
        lastReviewedAt: new Date(),
        nextReviewAt: sql`NOW() + ${L1_INTERVAL_SQL}`, // ✅ matches test/prod
      }))
    )
    .onConflictDoUpdate({
      target: [userVocabSrs.userId, userVocabSrs.vocabId],
      set: {
        srsLevel: 1,
        firstLearnedAt: sql`COALESCE(${userVocabSrs.firstLearnedAt}, NOW())`,
        lastReviewedAt: sql`NOW()`,
        nextReviewAt: sql`NOW() + ${L1_INTERVAL_SQL}`, // ✅ matches test/prod
      },
    });
}

/**
 * Apply review results:
 *  - upIds: promote, set nextReviewAt using INTERVAL_CASE_UP
 *  - downIds: demote (floor 1), set nextReviewAt using INTERVAL_CASE_DOWN
 * Ensures rows exist first.
 */
export async function applyReviewSrs({
  upIds = [],
  downIds = [],
}: {
  upIds?: number[];
  downIds?: number[];
}) {
  const { userId } = await auth();
  if (!userId) return;

  // Ensure rows exist so updates don't no-op
  const seedIds = [...new Set([...(upIds || []), ...(downIds || [])])];
  if (seedIds.length) {
    await db
      .insert(userVocabSrs)
      .values(
        seedIds.map((id) => ({
          userId,
          vocabId: id,
          srsLevel: 0,
          firstLearnedAt: null,
          lastReviewedAt: null,
          nextReviewAt: null,
        }))
      )
      .onConflictDoNothing();
  }

  if (upIds?.length) {
    await db
      .update(userVocabSrs)
      .set({
        srsLevel: sql`LEAST(${userVocabSrs.srsLevel} + 1, ${MAX_LEVEL})`,
        lastReviewedAt: sql`NOW()`,
        nextReviewAt: sql`NOW() + ${INTERVAL_CASE_UP}`,
      })
      .where(and(eq(userVocabSrs.userId, userId), inArray(userVocabSrs.vocabId, upIds)));
  }

  if (downIds?.length) {
    await db
      .update(userVocabSrs)
      .set({
        srsLevel: sql`GREATEST(${userVocabSrs.srsLevel} - 1, ${MIN_LEVEL})`,
        lastReviewedAt: sql`NOW()`,
        nextReviewAt: sql`NOW() + ${INTERVAL_CASE_DOWN}`,
      })
      .where(and(eq(userVocabSrs.userId, userId), inArray(userVocabSrs.vocabId, downIds)));
  }
}
