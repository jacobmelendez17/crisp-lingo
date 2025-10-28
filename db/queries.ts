import { cache } from "react";
import {
  eq,
  asc,
  inArray,
  and,
  or,
  isNull,
  count,
  lte,
  sql,
} from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { getActiveUserId } from "@/db/getActiveUserId";
import { getOrCreateUserProgress } from "@/db/ensureUserProgress";

import db from "./drizzle";
import {
  userProgress,
  userVocabSrs,
  vocab,
  levels,
} from "@/db/schema";


export const getUserProgress = async () => {
  const userId = await getActiveUserId();
  if (!userId) return null;

  return db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
};


export const getBatch = cache(async (limit = 5) => {
  const rows = await db
    .select()
    .from(vocab)
    .orderBy(asc(vocab.id))
    .limit(limit);

  return rows;
});


export const getVocabByIds = async (ids: number[]) => {
  if (!ids?.length) return [];

  const rows = await db
    .select()
    .from(vocab)
    .where(inArray(vocab.id, ids))
    .orderBy(asc(vocab.id));

  return rows;
};

export async function getNextUnlearnedBatchForLevel(
  userId: string,
  levelId: number,
  size = 5
) {
  const rows = await db
    .select({
      id: vocab.id,
      word: vocab.word,
      translation: vocab.translation,
      pronunciation: vocab.pronunciation,
      meaning: vocab.meaning,
      example: vocab.example,
      partOfSpeech: vocab.partOfSpeech,
      synonyms: vocab.synonyms,
      imageUrl: vocab.imageUrl,
      audioUrl: vocab.audioUrl,
      position: vocab.position,
      levelId: vocab.levelId,
    })
    .from(vocab)
    .leftJoin(
      userVocabSrs,
      and(eq(userVocabSrs.vocabId, vocab.id), eq(userVocabSrs.userId, userId))
    )
    .where(
      and(
        eq(vocab.levelId, Number(levelId)),
        or(isNull(userVocabSrs.srsLevel), eq(userVocabSrs.srsLevel, 0))
      )
    )
    .orderBy(asc(vocab.position))
    .limit(size);

  return rows;
}

export const getNextBatch = async (size = 5) => {
  const userId = await getActiveUserId();
  if (!userId) {
    //TODO: A default clerk user is created. Hook an endpoint after deployment that connects to live user
    return db.select().from(vocab).orderBy(asc(vocab.id)).limit(size);
  }

  const progress = await getOrCreateUserProgress(); // <-- ensures row exists
  const levelId = progress?.activeLevel;
  if (!levelId) {
    return db.select().from(vocab).orderBy(asc(vocab.id)).limit(size);
  }

  const learned = await db
    .select({ count: sql<number>`count(*)` })
    .from(userVocabSrs)
    .where(and(eq(userVocabSrs.userId, userId), sql`${userVocabSrs.srsLevel} > 0`));

  console.log("learned count for user:", learned[0]?.count ?? 0);

  const rows = await db
    .select({
      id: vocab.id,
      word: vocab.word,
      translation: vocab.translation,
      pronunciation: vocab.pronunciation,
      meaning: vocab.meaning,
      example: vocab.example,
      partOfSpeech: vocab.partOfSpeech,
      synonyms: vocab.synonyms,
      imageUrl: vocab.imageUrl,
      audioUrl: vocab.audioUrl,
      position: vocab.position,
      levelId: vocab.levelId,
    })
    .from(vocab)
    .leftJoin(
      userVocabSrs,
      and(eq(userVocabSrs.vocabId, vocab.id), eq(userVocabSrs.userId, userId))
    )
    .where(
      and(
        eq(vocab.levelId, Number(levelId)),
        or(isNull(userVocabSrs.srsLevel), eq(userVocabSrs.srsLevel, 0))
      )
    )
    .orderBy(asc(vocab.position))
    .limit(size);

  if (!rows?.length) {
    console.log("No unlearned items left in level → fallback batch");
    return db.select().from(vocab).orderBy(asc(vocab.id)).limit(size);
  }

  return rows;
};

export const getDueReviews = cache(async (limit?: number) => {
  const { userId } = await auth();
  if (!userId) return [];
  const now = new Date();

  let base = db
    .select({
      id: vocab.id,
      word: vocab.word,
      translation: vocab.translation,
      imageUrl: vocab.imageUrl,
      srsLevel: userVocabSrs.srsLevel,
      nextReviewAt: userVocabSrs.nextReviewAt,
    })
    .from(userVocabSrs)
    .innerJoin(vocab, eq(userVocabSrs.vocabId, vocab.id))
    .where(and(eq(userVocabSrs.userId, userId), lte(userVocabSrs.nextReviewAt, now)))
    .orderBy(asc(userVocabSrs.nextReviewAt));

    if (typeof limit === 'number') {
      return base.limit(limit);
    }

    return base;
});

export const countDueReviews = cache(async () => {
  const { userId } = await auth();
  if (!userId) return 0;
  const now = new Date();

  const res = await db.execute(
    sql`select count(*)::int as c from "user_vocab_srs" 
    where "user_id" = ${userId} and "next_review_at" <= ${now}`
  );
  return (res.rows?.[0]?.c as number) ?? 0;
});