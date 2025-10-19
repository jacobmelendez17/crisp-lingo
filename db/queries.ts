import { cache } from "react";
import { eq, asc, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./drizzle";
import {
    userProgress,
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