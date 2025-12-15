import { currentUser } from '@clerk/nextjs/server';
import db from '@/db/drizzle';
import { users as usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AccountSettingsClient } from './account-settings-client';

export default async function AccountSettingsPage() {
	const user = await currentUser();

	const clerkFullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';

	const clerkEmail =
		user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? '';

	const clerkUsername = user?.username ?? '';
	const clerkImage = user?.imageUrl ?? null;

	const dbUser = user?.id
		? await db.query.users.findFirst({
				where: eq(usersTable.userId, user.id)
			})
		: null;

	const displayName = dbUser?.displayName || clerkFullName || clerkUsername || 'Name not set';
	const username = dbUser?.username || clerkUsername || 'Username not set';
	const email = dbUser?.email || clerkEmail || 'No email on file';

	return (
		<AccountSettingsClient
			fullName={displayName}
			email={email}
			username={username}
			profileImage={clerkImage}
		/>
	);
}
