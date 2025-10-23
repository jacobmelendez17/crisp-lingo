// db/ensure-progress.ts
'use server';

import db from '@/db/drizzle';
import { userProgress, levels } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, asc } from 'drizzle-orm';

export async function ensureUserProgress() {
  const { userId } = await auth();
  if (!userId) return null;

  const exists = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  if (exists) return exists;

  const firstLevel = await db
    .select({ id: levels.id })
    .from(levels)
    .orderBy(asc(levels.id))
    .limit(1);

  if (!firstLevel.length) return null;

  const [created] = await db
    .insert(userProgress)
    .values({
      userId,
      userName: 'User',
      userImageSrc: '/mascot.svg',
      activeLevel: firstLevel[0].id,
      nextLevelUnlocked: false,
    })
    .returning();
  return created;
}
