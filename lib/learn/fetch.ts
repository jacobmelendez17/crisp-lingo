// src/lib/learn/fetch.ts
import { asc, and, eq, inArray, sql } from 'drizzle-orm';
import db from '@/db/drizzle';
import { levels, vocab, userVocabSrs, grammar, userGrammarSrs } from '@/db/schema';

export type LevelSummary = { id: number; title: string };

export async function fetchLevels(): Promise<LevelSummary[]> {
  return db.select({ id: levels.id, title: levels.title }).from(levels).orderBy(asc(levels.id));
}

export async function sliceLevels(all: LevelSummary[], start: number, end: number) {
  // input is 1-based inclusive range; slice needs 0-based
  return all.slice(start - 1, end);
}

/** Vocab */
export type VocabRow = {
  id: number;
  word: string;
  translation: string;
  imageUrl: string | null;
  levelId: number;
  srsLevel: number;
  nextReviewAt: Date | null;
};

export async function fetchVocabForLevels(levelIds: number[], userId?: string | null): Promise<VocabRow[]> {
  if (!levelIds.length) return [];

  if (userId) {
    return db
      .select({
        id: vocab.id,
        word: vocab.word,
        translation: vocab.translation,
        imageUrl: vocab.imageUrl,
        levelId: vocab.levelId,
        srsLevel: sql<number>`COALESCE(${userVocabSrs.srsLevel}, 0)`,
        nextReviewAt: userVocabSrs.nextReviewAt,
      })
      .from(vocab)
      .leftJoin(userVocabSrs, and(eq(userVocabSrs.vocabId, vocab.id), eq(userVocabSrs.userId, userId)))
      .where(inArray(vocab.levelId, levelIds))
      .orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));
  }

  return db
    .select({
      id: vocab.id,
      word: vocab.word,
      translation: vocab.translation,
      imageUrl: vocab.imageUrl,
      levelId: vocab.levelId,
      srsLevel: sql<number>`0`,
      nextReviewAt: sql<Date>`NULL`,
    })
    .from(vocab)
    .where(inArray(vocab.levelId, levelIds))
    .orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));
}

/** Grammar */
export type GrammarRow = {
  id: number;
  title: string;
  structure: string;
  imageUrl: string | null;
  levelId: number;
  srsLevel: number;
  nextReviewAt: Date | null;
};

export async function fetchGrammarForLevels(levelIds: number[], userId?: string | null): Promise<GrammarRow[]> {
  if (!levelIds.length) return [];

  if (userId) {
    return db
      .select({
        id: grammar.id,
        title: grammar.title,
        structure: grammar.structure,
        imageUrl: grammar.imageUrl,
        levelId: grammar.levelId,
        srsLevel: sql<number>`COALESCE(${userGrammarSrs.srsLevel}, 0)`,
        nextReviewAt: userGrammarSrs.nextReviewAt,
      })
      .from(grammar)
      .leftJoin(
        userGrammarSrs,
        and(eq(userGrammarSrs.grammarId, grammar.id), eq(userGrammarSrs.userId, userId))
      )
      .where(inArray(grammar.levelId, levelIds))
      .orderBy(asc(grammar.levelId), asc(grammar.position), asc(grammar.id));
  }

  return db
    .select({
      id: grammar.id,
      title: grammar.title,
      structure: grammar.structure,
      imageUrl: grammar.imageUrl,
      levelId: grammar.levelId,
      srsLevel: sql<number>`0`,
      nextReviewAt: sql<Date>`NULL`,
    })
    .from(grammar)
    .where(inArray(grammar.levelId, levelIds))
    .orderBy(asc(grammar.levelId), asc(grammar.position), asc(grammar.id));
}
