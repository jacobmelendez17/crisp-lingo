// app/(app)/actions/srs.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import db from '@/db/drizzle';
import { userVocabSrs } from '@/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

const MAX_LEVEL = 11;   // adjust to your scheme
const MIN_LEVEL = 0;   // allow dropping to 0 (new). Change to 1 if you want floor=1.

export async function setSrsToOne({ vocabIds }: { vocabIds: number[] }) {
  const { userId } = await auth();
  if (!userId || !vocabIds?.length) return;

  // Upsert to srsLevel = 1. Also fill timestamps.
  await db
    .insert(userVocabSrs)
    .values(
      vocabIds.map((id) => ({
        userId,
        vocabId: id,
        srsLevel: 1, // force stage 1 even on first insert
        firstLearnedAt: new Date(),
        lastReviewedAt: new Date(),
        nextReviewAt: sql`NOW() + INTERVAL '4 hours'` // optional interval
      }))
    )
    .onConflictDoUpdate({
      target: [userVocabSrs.userId, userVocabSrs.vocabId],
      set: {
        srsLevel: 1,
        firstLearnedAt: sql`COALESCE(${userVocabSrs.firstLearnedAt}, NOW())`,
        lastReviewedAt: sql`NOW()`,
        nextReviewAt: sql`NOW() + INTERVAL '4 hours'` // optional
      }
    });
}



export async function applyReviewSrs({
  upIds,
  downIds,
}: {
  upIds: number[];
  downIds: number[];
}) {
  const { userId } = await auth();
  if (!userId) return;

  // Ensure rows exist (in case user reviews an item not yet in user_vocab_srs)
  const seedIds = [...new Set([...(upIds || []), ...(downIds || [])])];
  if (seedIds.length) {
    await db
      .insert(userVocabSrs)
      .values(seedIds.map((id) => ({
        userId,
        vocabId: id,
        srsLevel: 0,
        firstLearnedAt: null,
        lastReviewedAt: null,
        nextReviewAt: null,
      })))
      .onConflictDoNothing();
  }

  if (upIds?.length) {
    await db
      .update(userVocabSrs)
      .set({
        srsLevel: sql`LEAST(${userVocabSrs.srsLevel} + 1, ${MAX_LEVEL})`,
        lastReviewedAt: sql`NOW()`,
        // nextReviewAt: sql`NOW() + INTERVAL '1 day'` // example; base on new level if you want
      })
      .where(and(eq(userVocabSrs.userId, userId), inArray(userVocabSrs.vocabId, upIds)));
  }

  if (downIds?.length) {
    await db
      .update(userVocabSrs)
      .set({
        srsLevel: sql`GREATEST(${userVocabSrs.srsLevel} - 1, ${MIN_LEVEL})`,
        lastReviewedAt: sql`NOW()`,
        // nextReviewAt: sql`NOW() + INTERVAL '4 hours'` // example; base on new level if you want
      })
      .where(and(eq(userVocabSrs.userId, userId), inArray(userVocabSrs.vocabId, downIds)));
  }
}
