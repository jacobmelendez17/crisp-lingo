'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { users, userProgress } from '@/db/schema';

type Field = 'name' | 'username' | 'email' | 'image';

export async function updateAccountField(field: Field, value: string) {
	const { userId } = await auth();
	if (!userId) throw new Error('Not signed in');

	const trimmed = value.trim();

	if (field === 'name') {
        await db
            .insert(users)
            .values({ userId, displayName: trimmed, updatedAt: new Date() })
            .onConflictDoUpdate({
            target: users.userId,
            set: { displayName: trimmed, updatedAt: new Date() }
            });
    }

    if (field === 'username') {
        await db
            .insert(users)
            .values({ userId, username: trimmed, updatedAt: new Date() })
            .onConflictDoUpdate({
            target: users.userId,
            set: { username: trimmed, updatedAt: new Date() }
            });
    }

    if (field === 'email') {
        await db
            .insert(users)
            .values({ userId, email: trimmed, updatedAt: new Date() })
            .onConflictDoUpdate({
            target: users.userId,
            set: { email: trimmed, updatedAt: new Date() }
            });
    }


	if (field === 'image') {
		// NOTE: this assumes you're storing an image URL/path in your DB
		await db
			.update(userProgress)
			.set({ userImageSrc: trimmed, updatedAt: new Date() })
			.where(eq(userProgress.userId, userId));
	}

	revalidatePath('/account/settings');
}
