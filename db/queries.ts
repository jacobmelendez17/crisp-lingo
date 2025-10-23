import { cache } from "react";
import {
  eq,
  asc,
  inArray,
  and,
  or,
  isNull,
  count,
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

/* ----------------------------- USER PROGRESS ----------------------------- */

export const getUserProgress = async () => {
  const userId = await getActiveUserId();
  if (!userId) return null;

  return db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
};

/* --------------------------- GENERIC BATCH FETCH -------------------------- */

export const getBatch = cache(async (limit = 5) => {
  // Generic fallback batch (used for guests or when no progress yet)
  const rows = await db
    .select()
    .from(vocab)
    .orderBy(asc(vocab.id))
    .limit(limit);

  return rows;
});

/* -------------------------- FETCH VOCAB BY IDS --------------------------- */

export const getVocabByIds = async (ids: number[]) => {
  if (!ids?.length) return [];

  const rows = await db
    .select()
    .from(vocab)
    .where(inArray(vocab.id, ids))
    .orderBy(asc(vocab.id));

  return rows;
};

/* ---------------------- NEXT UNLEARNED VOCAB FOR LEVEL -------------------- */
/**
 * Returns the next unlearned vocab items for the user's active level,
 * ordered by position. Learned = srsLevel > 0 (excluded).
 */
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
        // include only words the user hasn’t learned yet
        or(isNull(userVocabSrs.srsLevel), eq(userVocabSrs.srsLevel, 0))
      )
    )
    .orderBy(asc(vocab.position))
    .limit(size);

  return rows;
}

/* ------------------------------ MAIN GETTER ------------------------------ */
export const getNextBatch = async (size = 5) => {
  const userId = await getActiveUserId();
  if (!userId) {
    return db.select().from(vocab).orderBy(asc(vocab.id)).limit(size);
  }

  const progress = await getOrCreateUserProgress(); // <-- ensures row exists
  const levelId = progress?.activeLevel;
  if (!levelId) {
    return db.select().from(vocab).orderBy(asc(vocab.id)).limit(size);
  }

  // (optional) log for debugging
  console.log("active user:", userId, "activeLevel:", levelId);

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