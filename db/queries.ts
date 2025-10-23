import { cache } from "react";
import { eq, asc, inArray, between, and, sql, count } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./drizzle";
import {
    userProgress,
    userVocabSrs,
    vocab
} from "@/db/schema";

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
    });
    return data;
});

//refers to batch of lessons depending on user settings
export const getBatch = cache(async (limit = 5) => {
    const rows = await db
        .select()
        .from(vocab)
        .orderBy(asc(vocab.id))
        .limit(limit)

    return rows;
});

export const getVocabByIds = cache(async (ids: number[]) => {
	if (!ids?.length) return [];

	const rows = await db
		.select()
		.from(vocab)
		.where(inArray(vocab.id, ids))
		.orderBy(asc(vocab.id));

	return rows;
});

function computeNextStart(learnedCount: number, size: number) {
    return Math.floor(learnedCount / size) * size + 1;
}

export const getLevelWindow = cache(async (levelId: number, start: number, end: number) => {
    const rows = await db
        .select()
        .from(vocab)
        .where(and(eq(vocab.levelId, levelId), between(vocab.position, start, end)))
        .orderBy(asc(vocab.position));
    return rows;
});

export const getNextBatchForLevel = cache(async (userId: string, levelId: number, size = 5) => {
    const [{ learned = 0 } = { learned: 0}] = await db
        .select({ learned: count().as("learned") })
        .from(userVocabSrs)
        .innerJoin(vocab, eq(userVocabSrs.vocabId, vocab.id))
        .where(and(eq(userVocabSrs.userId, userId), eq(vocab.levelId, levelId), sql`${userVocabSrs.srsLevel} > 0` ));

        const start = computeNextStart(learned, size);
        const end = start + size - 1;

        const rows = await getLevelWindow(levelId, start, end);
        return rows;
});

export const getNextBatch = cache(async (size = 5) => {
    const { userId } = await auth();
    if (!userId) return getBatch(size);

    const progress = await getUserProgress();
    const levelId = progress?.activeLevel;
    if (!levelId) return getBatch(size);

    const rows = await getNextBatchForLevel(userId, levelId, size);
    if (!rows?.length) return getBatch(size);

    return rows;
});