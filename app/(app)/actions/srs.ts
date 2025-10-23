'use server';

import db from '@/db/drizzle';
import { userVocabSrs } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// only add if items are correct on first try
type FinalizePayload = {
    vocabIds: number[];
}

export async function incrementSrsOnCompletion({ vocabIds }: FinalizePayload) {
    const { userId } = await auth();
    if (!userId || vocabIds.length === 0) return { ok: false };

    const now= new Date();

    await db
        .insert(userVocabSrs)
        .values(
            vocabIds.map((vid) => ({
                userId,
                vocabId: vid,
                srsLevel: 1,
                firstLearnedAt: now,
                lastReviewedAt: now,
                nextReviewAt: now, // TODO: change this based on srs point. It shouldn't be now
            }))
        )
        .onConflictDoUpdate({
            target: [userVocabSrs.userId, userVocabSrs.vocabId],
            set: {
                srsLevel: sql`LEAST(11, ${userVocabSrs.srsLevel} + 1)`,
                lastReviewedAt: now,
                firstLearnedAt: sql`COALESCE(${userVocabSrs.firstLearnedAt}, ${now})`,
                nextReviewAt: now, // TODO: change based on level. This shouldn't be now
            }
        });

    return { ok: true };
}