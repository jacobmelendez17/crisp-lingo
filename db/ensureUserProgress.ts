// NO default export here
import db from "@/db/drizzle";
import { userProgress, levels } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getActiveUserId } from "@/db/getActiveUserId";

export async function getOrCreateUserProgress() {
  const userId = await getActiveUserId();
  if (!userId) return null;

  const existing = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  if (existing) return existing;

  const firstLevel = await db.query.levels.findFirst({ orderBy: asc(levels.id) });
  if (!firstLevel) return null;

  const [created] = await db
    .insert(userProgress)
    .values({
      userId,
      userName: "User",
      userImageSrc: "/mascot.svg",
      activeLevel: firstLevel.id,
      nextLevelUnlocked: false,
      learnedWords: 0,
      learnedGrammar: 0,
    })
    .returning();

  return created ?? null;
}
