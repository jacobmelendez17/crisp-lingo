'use server';

import { auth } from '@clerk/nextjs/server';
import db from '@/db/drizzle';
import { userVocabSrs } from '@/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

const MAX_LEVEL = 8;
const MIN_LEVEL = 1;

// Set SRS_DEBUG=true in .env.local to enable fast “debug” mode
const IS_DEBUG = process.env.SRS_DEBUG === 'true';
console.log("SRS debug mode: ", IS_DEBUG);

// Level 1 interval (special-cased)
const L1_INTERVAL_SQL = IS_DEBUG
  ? sql`INTERVAL '30 seconds'`      // debug: super fast
  : sql`INTERVAL '4 hours'`;        // prod: real SRS

// Intervals for promotion: based on the *new* level after +1
const INTERVAL_CASE_UP = IS_DEBUG
  ? sql`
      CASE LEAST(${userVocabSrs.srsLevel} + 1, ${MAX_LEVEL})
        WHEN 1 THEN INTERVAL '30 seconds'
        WHEN 2 THEN INTERVAL '30 seconds'
        WHEN 3 THEN INTERVAL '30 seconds'
        WHEN 4 THEN INTERVAL '30 seconds'
        WHEN 5 THEN INTERVAL '30 seconds'
        WHEN 6 THEN INTERVAL '30 seconds'
        WHEN 7 THEN INTERVAL '30 seconds'
        WHEN 8 THEN INTERVAL '30 seconds'
      END
    `
  : sql`
      CASE LEAST(${userVocabSrs.srsLevel} + 1, ${MAX_LEVEL})
        WHEN 1 THEN ${L1_INTERVAL_SQL}   -- 4h
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
const INTERVAL_CASE_DOWN = IS_DEBUG
  ? sql`
      CASE GREATEST(${userVocabSrs.srsLevel} - 1, ${MIN_LEVEL})
        WHEN 1 THEN INTERVAL '30 seconds'
        WHEN 2 THEN INTERVAL '1 minute'
        WHEN 3 THEN INTERVAL '2 minutes'
        WHEN 4 THEN INTERVAL '5 minutes'
        WHEN 5 THEN INTERVAL '10 minutes'
        WHEN 6 THEN INTERVAL '20 minutes'
        WHEN 7 THEN INTERVAL '30 minutes'
        WHEN 8 THEN INTERVAL '60 minutes'
      END
    `
  : sql`
      CASE GREATEST(${userVocabSrs.srsLevel} - 1, ${MIN_LEVEL})
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
