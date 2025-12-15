import Image from 'next/image';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

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
	const profileImage = user?.imageUrl;

	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-3xl font-bold text-neutral-900">Personal Information</h1>
			</header>

			<div className="grid gap-4">
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Name</h2>
							<p className="text-sm text-neutral-600">{fullName}</p>
						</div>

						<Button variant="outline" size="sm">
							Change name
						</Button>
					</div>
				</section>

				{/* EMAIL */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Email</h2>
							<p className="break-all text-sm text-neutral-600">{email}</p>
						</div>

						<Button variant="outline" size="sm">
							Change email
						</Button>
					</div>
				</section>

				{/* USERNAME */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Username</h2>
							<p className="text-sm text-neutral-600">{username}</p>
						</div>

						<Button variant="outline" size="sm">
							Change username
						</Button>
					</div>
				</section>

				{/* PASSWORD */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Password</h2>
							<p className="text-sm text-neutral-600">
								For your security, your current password isn&apos;t shown.
							</p>
						</div>

						<Button variant="outline" size="sm">
							Change password
						</Button>
					</div>
				</section>

				{/* PROFILE PICTURE */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-200">
								{profileImage ? (
									<Image src={profileImage} alt="Profile picture" fill className="object-cover" />
								) : (
									<span className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
										No image
									</span>
								)}
							</div>

							<div>
								<h2 className="mb-1 text-lg font-semibold text-neutral-800">Profile Picture</h2>
								<p className="text-sm text-neutral-600">
									This image appears across your Crisp Lingo account.
								</p>
							</div>
						</div>

						<Button variant="outline" size="sm">
							Change picture
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
}
