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
  lt,
  sql,
  gte,
  isNotNull
} from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { getActiveUserId } from "@/db/getActiveUserId";
import { getOrCreateUserProgress } from "@/db/ensureUserProgress";

import db from "./drizzle";
import {
  userProgress,
  userVocabSrs,
  userGrammarSrs,
  vocab,
  levels,
  vocabExamples,
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
      example: vocab.example,
      exampleTranslation: vocab.exampleTranslation,
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

export const getReviewForecast = cache(async (days = 7) => {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const end = new Date(now.getTime());
  end.setDate(end.getDate() + days);

  // --- Vocab: bucket by day ---
  const vocabDayTrunc = sql`date_trunc('day', ${userVocabSrs.nextReviewAt})`;
  const vocabRows = await db
    .select({
      date: sql<string>`to_char(${vocabDayTrunc}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userVocabSrs)
    .where(
      and(
        eq(userVocabSrs.userId, userId),
        isNotNull(userVocabSrs.nextReviewAt),
        gte(userVocabSrs.nextReviewAt, now),
        lt(userVocabSrs.nextReviewAt, end)
      )
    )
    .groupBy(vocabDayTrunc);

  // --- Grammar: bucket by day ---
  const grammarDayTrunc = sql`date_trunc('day', ${userGrammarSrs.nextReviewAt})`;
  const grammarRows = await db
    .select({
      date: sql<string>`to_char(${grammarDayTrunc}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userGrammarSrs)
    .where(
      and(
        eq(userGrammarSrs.userId, userId),
        isNotNull(userGrammarSrs.nextReviewAt),
        gte(userGrammarSrs.nextReviewAt, now),
        lt(userGrammarSrs.nextReviewAt, end)
      )
    )
    .groupBy(grammarDayTrunc);

  // --- Merge vocab + grammar into a single map keyed by date string ---
  const counts = new Map<string, number>();

  const mergeRows = (rows: { date: string; count: number }[]) => {
    for (const row of rows) {
      const key = row.date; // 'YYYY-MM-DD'
      counts.set(key, (counts.get(key) ?? 0) + Number(row.count));
    }
  };

  mergeRows(vocabRows as any);
  mergeRows(grammarRows as any);

  const daily: { date: string; reviews: number }[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime());
    d.setDate(now.getDate() + i);
    const key = d.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    daily.push({
      date: key,
      reviews: counts.get(key) ?? 0,
    });
  }

  return daily;
});

export const getHourlyReviewForecast = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const end = new Date(now.getTime() + 24 * 60 * 60 * 1000); // next 24 hours

  // --- Vocab: bucket by hour of day (0–23) ---
  const vocabHourExpr = sql<number>`cast(date_part('hour', ${userVocabSrs.nextReviewAt}) as int)`;
  const vocabRows = await db
    .select({
      hour: vocabHourExpr,
      count: sql<number>`count(*)`,
    })
    .from(userVocabSrs)
    .where(
      and(
        eq(userVocabSrs.userId, userId),
        isNotNull(userVocabSrs.nextReviewAt),
        gte(userVocabSrs.nextReviewAt, now),
        lt(userVocabSrs.nextReviewAt, end)
      )
    )
    .groupBy(vocabHourExpr);

  // --- Grammar: bucket by hour of day (0–23) ---
  const grammarHourExpr = sql<number>`cast(date_part('hour', ${userGrammarSrs.nextReviewAt}) as int)`;
  const grammarRows = await db
    .select({
      hour: grammarHourExpr,
      count: sql<number>`count(*)`,
    })
    .from(userGrammarSrs)
    .where(
      and(
        eq(userGrammarSrs.userId, userId),
        isNotNull(userGrammarSrs.nextReviewAt),
        gte(userGrammarSrs.nextReviewAt, now),
        lt(userGrammarSrs.nextReviewAt, end)
      )
    )
    .groupBy(grammarHourExpr);

  // --- Merge into 24 buckets ---
  const buckets: { hour: number; reviews: number }[] = Array.from(
    { length: 24 },
    (_, hour) => ({ hour, reviews: 0 })
  );

  const mergeRows = (rows: { hour: number; count: number }[]) => {
    for (const row of rows) {
      const h = Number(row.hour);
      if (h >= 0 && h < 24) {
        buckets[h].reviews += Number(row.count);
      }
    }
  };

  mergeRows(vocabRows as any);
  mergeRows(grammarRows as any);

  return buckets;
});

export const getActivity = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const end = new Date(); // now
  const start = new Date(end.getTime());
  start.setDate(start.getDate() - 6); // last 7 days including today

  // --- vocab: count by day (firstLearnedAt) ---
  const vocabDayTrunc = sql`date_trunc('day', ${userVocabSrs.firstLearnedAt})`;
  const vocabRows = await db
    .select({
      date: sql<string>`to_char(${vocabDayTrunc}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userVocabSrs)
    .where(
      and(
        eq(userVocabSrs.userId, userId),
        isNotNull(userVocabSrs.firstLearnedAt),
        gte(userVocabSrs.firstLearnedAt, start),
        lte(userVocabSrs.firstLearnedAt, end)
      )
    )
    .groupBy(vocabDayTrunc);

  // --- grammar: count by day (firstLearnedAt) ---
  const grammarDayTrunc = sql`date_trunc('day', ${userGrammarSrs.firstLearnedAt})`;
  const grammarRows = await db
    .select({
      date: sql<string>`to_char(${grammarDayTrunc}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userGrammarSrs)
    .where(
      and(
        eq(userGrammarSrs.userId, userId),
        isNotNull(userGrammarSrs.firstLearnedAt),
        gte(userGrammarSrs.firstLearnedAt, start),
        lte(userGrammarSrs.firstLearnedAt, end)
      )
    )
    .groupBy(grammarDayTrunc);

  const vocabMap = new Map<string, number>();
  for (const row of vocabRows as any) {
    vocabMap.set(row.date, Number(row.count));
  }

  const grammarMap = new Map<string, number>();
  for (const row of grammarRows as any) {
    grammarMap.set(row.date, Number(row.count));
  }

  const days: { date: string; vocab: number; grammar: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start.getTime());
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    days.push({
      date: key,
      vocab: vocabMap.get(key) ?? 0,
      grammar: grammarMap.get(key) ?? 0,
    });
  }

  return days;
});

export const getVocabByWord = cache(async (word: string) => {
  const row = await db.query.vocab.findFirst({
    where: eq(vocab.word, word),
  });
  return row ?? null;
});

export const getVocabExamples = cache(async (vocabId: number) => {
  const rows = await db
    .select({
      id: vocabExamples.id,
      sentence: vocabExamples.sentence,
      translation: vocabExamples.translation,
      audioUrl: vocabExamples.audioUrl,
      position: vocabExamples.position,
    })
    .from(vocabExamples)
    .where(eq(vocabExamples.vocabId, vocabId))
    .orderBy(asc(vocabExamples));

    return rows;
})

export const getYearlyActivity = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const end = new Date(); // today
  end.setHours(23, 59, 59, 999);

  const start = new Date(end.getTime());
  start.setFullYear(start.getFullYear() - 1); // 1 year ago

  // ---- Lessons learned (firstLearnedAt) ----
  const vocabDayTruncLearn = sql`date_trunc('day', ${userVocabSrs.firstLearnedAt})`;
  const vocabLearnRows = await db
    .select({
      date: sql<string>`to_char(${vocabDayTruncLearn}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userVocabSrs)
    .where(
      and(
        eq(userVocabSrs.userId, userId),
        isNotNull(userVocabSrs.firstLearnedAt),
        gte(userVocabSrs.firstLearnedAt, start),
        lte(userVocabSrs.firstLearnedAt, end)
      )
    )
    .groupBy(vocabDayTruncLearn);

  const grammarDayTruncLearn = sql`date_trunc('day', ${userGrammarSrs.firstLearnedAt})`;
  const grammarLearnRows = await db
    .select({
      date: sql<string>`to_char(${grammarDayTruncLearn}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userGrammarSrs)
    .where(
      and(
        eq(userGrammarSrs.userId, userId),
        isNotNull(userGrammarSrs.firstLearnedAt),
        gte(userGrammarSrs.firstLearnedAt, start),
        lte(userGrammarSrs.firstLearnedAt, end)
      )
    )
    .groupBy(grammarDayTruncLearn);

  // ---- Reviews done (lastReviewedAt) ----
  const vocabDayTruncReview = sql`date_trunc('day', ${userVocabSrs.lastReviewedAt})`;
  const vocabReviewRows = await db
    .select({
      date: sql<string>`to_char(${vocabDayTruncReview}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userVocabSrs)
    .where(
      and(
        eq(userVocabSrs.userId, userId),
        isNotNull(userVocabSrs.lastReviewedAt),
        gte(userVocabSrs.lastReviewedAt, start),
        lte(userVocabSrs.lastReviewedAt, end)
      )
    )
    .groupBy(vocabDayTruncReview);

  const grammarDayTruncReview = sql`date_trunc('day', ${userGrammarSrs.lastReviewedAt})`;
  const grammarReviewRows = await db
    .select({
      date: sql<string>`to_char(${grammarDayTruncReview}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(userGrammarSrs)
    .where(
      and(
        eq(userGrammarSrs.userId, userId),
        isNotNull(userGrammarSrs.lastReviewedAt),
        gte(userGrammarSrs.lastReviewedAt, start),
        lte(userGrammarSrs.lastReviewedAt, end)
      )
    )
    .groupBy(grammarDayTruncReview);

  // ---- Merge into a single map: total activity per day ----
  const map = new Map<string, { lessons: number; reviews: number }>();

  const addRows = (
    rows: { date: string; count: number }[],
    kind: "lessons" | "reviews"
  ) => {
    for (const row of rows) {
      const key = row.date;
      const existing = map.get(key) ?? { lessons: 0, reviews: 0 };
      existing[kind] += Number(row.count);
      map.set(key, existing);
    }
  };

  addRows(vocabLearnRows as any, "lessons");
  addRows(grammarLearnRows as any, "lessons");
  addRows(vocabReviewRows as any, "reviews");
  addRows(grammarReviewRows as any, "reviews");

  // ---- Build full list of days for the past year ----
  const days: { date: string; lessons: number; reviews: number; total: number }[] = [];
  const cursor = new Date(start.getTime());

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10); // YYYY-MM-DD
    const v = map.get(key) ?? { lessons: 0, reviews: 0 };
    days.push({
      date: key,
      lessons: v.lessons,
      reviews: v.reviews,
      total: v.lessons + v.reviews,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
});