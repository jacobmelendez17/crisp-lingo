'use server';

import db from '@/db/drizzle';
import { userVocabSrs } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { sql, inArray, and, eq } from 'drizzle-orm';

type FinalizePayload = { vocabIds: number[] };

export async function incrementSrsOnCompletion({ vocabIds }: FinalizePayload) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: 'no-user' };

  const ids = [...new Set(vocabIds)].filter((n) => Number.isFinite(n));
  if (ids.length === 0) return { ok: false, error: 'no-ids' };

  const now = new Date();

  // Single upsert (no transaction needed with neon-http)
  const res = await db
    .insert(userVocabSrs)
    .values(
      ids.map((vid) => ({
        userId,
        vocabId: vid,
        srsLevel: 1,
        firstLearnedAt: now,
        lastReviewedAt: now,
        nextReviewAt: now,
      }))
    )
    .onConflictDoUpdate({
      target: [userVocabSrs.userId, userVocabSrs.vocabId],
      set: {
        // increment srsLevel on repeat completion
        srsLevel: sql`LEAST(11, ${userVocabSrs.srsLevel} + 1)`,
        lastReviewedAt: now,
        firstLearnedAt: sql`COALESCE(${userVocabSrs.firstLearnedAt}, ${now})`,
        nextReviewAt: now,
      },
    })
    .returning({ userId: userVocabSrs.userId, vocabId: userVocabSrs.vocabId, srsLevel: userVocabSrs.srsLevel });

  // Optional: verify that the updated rows now have srsLevel > 0
  // (handy while debugging)
  // const check = await db.select({ vid: userVocabSrs.vocabId, lvl: userVocabSrs.srsLevel })
  //   .from(userVocabSrs)
  //   .where(and(eq(userVocabSrs.userId, userId), inArray(userVocabSrs.vocabId, ids)));

  return { ok: true, updated: res };
}
