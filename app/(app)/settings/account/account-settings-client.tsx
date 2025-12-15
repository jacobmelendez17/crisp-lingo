'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateAccountField } from './actions';

type Props = {
	fullName: string;
	email: string;
	username: string;
	profileImage?: string | null;
};

type EditingKey = 'name' | 'email' | 'username' | 'password' | 'image' | null;

function TextInput({
	value,
	onChange,
	placeholder
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
}) {
	return (
		<input
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className="h-9 w-full max-w-md rounded-lg border border-black/15 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-black"
		/>
	);
}

export function AccountSettingsClient({ fullName, email, username, profileImage }: Props) {
	const [editing, setEditing] = useState<EditingKey>(null);
	const [isPending, startTransition] = useTransition();

	// draft values while editing
	const [draftName, setDraftName] = useState(fullName);
	const [draftUsername, setDraftUsername] = useState(username);
	const [draftImage, setDraftImage] = useState(profileImage ?? '');

	const cancel = () => {
		setDraftName(fullName);
		setDraftUsername(username);
		setDraftImage(profileImage ?? '');
		setEditing(null);
	};

	const save = (field: 'name' | 'username' | 'image', value: string) => {
		startTransition(async () => {
			await updateAccountField(field, value);
			setEditing(null);
		});
	};

	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-3xl font-bold text-neutral-900">Personal Information</h1>
			</header>

			<div className="grid gap-4">
				{/* NAME */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Name</h2>

							{editing === 'name' ? (
								<TextInput value={draftName} onChange={setDraftName} placeholder="Your name" />
							) : (
								<p className="text-sm text-neutral-600">{fullName}</p>
							)}
						</div>

						{editing === 'name' ? (
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={isPending}
									onClick={() => save('name', draftName)}
								>
									Save
								</Button>
								<Button variant="outline" size="sm" disabled={isPending} onClick={cancel}>
									Cancel
								</Button>
							</div>
						) : (
							<Button variant="outline" size="sm" onClick={() => setEditing('name')}>
								Change name
							</Button>
						)}
					</div>
				</section>

				{/* EMAIL (recommended: manage via Clerk UI / verification flow) */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Email</h2>
							<p className="break-all text-sm text-neutral-600">{email}</p>
						</div>

						{/* Keep this as a link to a dedicated page using <UserProfile /> */}
						<Button variant="outline" size="sm" asChild>
							<a href="/account/security">Change email</a>
						</Button>
					</div>
				</section>

				{/* USERNAME */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Username</h2>

							{editing === 'username' ? (
								<TextInput
									value={draftUsername}
									onChange={setDraftUsername}
									placeholder="username"
								/>
							) : (
								<p className="text-sm text-neutral-600">{username}</p>
							)}
						</div>

						{editing === 'username' ? (
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={isPending}
									onClick={() => save('username', draftUsername)}
								>
									Save
								</Button>
								<Button variant="outline" size="sm" disabled={isPending} onClick={cancel}>
									Cancel
								</Button>
							</div>
						) : (
							<Button variant="outline" size="sm" onClick={() => setEditing('username')}>
								Change username
							</Button>
						)}
					</div>
				</section>

				{/* PASSWORD (recommended: manage via Clerk UI) */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="mb-1 text-xl font-semibold text-neutral-800">Password</h2>
							<p className="text-sm text-neutral-600">
								For your security, your current password isn&apos;t shown.
							</p>
						</div>

						<Button variant="outline" size="sm" asChild>
							<a href="/account/security">Change password</a>
						</Button>
					</div>
				</section>

				{/* PROFILE PICTURE (simple: edit a URL/path; if you want upload, we’ll do that next) */}
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

								{editing === 'image' ? (
									<TextInput
										value={draftImage}
										onChange={setDraftImage}
										placeholder="Image URL or /path"
									/>
								) : (
									<p className="text-sm text-neutral-600">
										This image appears across your Crisp Lingo account.
									</p>
								)}
							</div>
						</div>

						{editing === 'image' ? (
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={isPending}
									onClick={() => save('image', draftImage)}
								>
									Save
								</Button>
								<Button variant="outline" size="sm" disabled={isPending} onClick={cancel}>
									Cancel
								</Button>
							</div>
						) : (
							<Button variant="outline" size="sm" onClick={() => setEditing('image')}>
								Change picture
							</Button>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
