import { currentUser } from '@clerk/nextjs/server';
import { AccountSettingsClient } from './account-settings-client';

export default async function AccountSettingsPage() {
	const user = await currentUser();

	const fullName = user
		? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'Name not set'
		: 'Not signed in';

	const email =
		user?.primaryEmailAddress?.emailAddress ??
		user?.emailAddresses?.[0]?.emailAddress ??
		'No email on file';

	const username = user?.username ?? 'Username not set';
	const profileImage = user?.imageUrl ?? null;

	return (
		<AccountSettingsClient
			fullName={fullName}
			email={email}
			username={username}
			profileImage={profileImage}
		/>
	);
}
