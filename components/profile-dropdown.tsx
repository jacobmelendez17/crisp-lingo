'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

type Props = {
	email?: string;
	avatarSrc?: string;
	className?: string;
};

export function ProfileDropdown({
	email = 'you@example.com',
	avatarSrc = '/profile-avatar.png',
	className
}: Props) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const router = useRouter();
	const { signOut } = useClerk();

	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) setOpen(false);
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpen(false);
				buttonRef.current?.focus();
			}
		};
		document.addEventListener('mousedown', onDocClick);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			document.removeEventListener('keydown', onEsc);
		};
	}, []);

	return (
		<div className={cn('relative', className)} ref={menuRef}>
			<button
				ref={buttonRef}
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className="rounded-full border-2 border-white outline-none ring-offset-2 transition-transform hover:scale-105 focus:ring-2 focus:ring-white/60"
			>
				<Image
					src={avatarSrc}
					alt="Open profile menu"
					width={40}
					height={40}
					className="rounded-full"
				/>
			</button>

			{open && (
				<div
					role="menu"
					aria-label="Profile"
					className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-lg backdrop-blur-sm"
				>
					<div className="px-4 py-3 text-sm">
						<p className="font-semibold text-neutral-900">Signed in as</p>
						<p className="truncate text-neutral-600">{email}</p>
					</div>
					<div className="h-px bg-black/10" />
					<ul className="py-1 text-[15px]">
						<li>
							<Link
								href="/account"
								role="menuitem"
								className="block px-4 py-2 hover:bg-neutral-100"
								onClick={() => setOpen(false)}
							>
								Profile
							</Link>
						</li>
						<li>
							<Link
								href="/settings"
								role="menuitem"
								className="block px-4 py-2 hover:bg-neutral-100"
								onClick={() => setOpen(false)}
							>
								Settings
							</Link>
						</li>
						<li>
							<Link
								href="/billing"
								role="menuitem"
								className="block px-4 py-2 hover:bg-neutral-100"
								onClick={() => setOpen(false)}
							>
								Billing
							</Link>
						</li>
						<li>
							<Link
								href="/help"
								role="menuitem"
								className="block px-4 py-2 hover:bg-neutral-100"
								onClick={() => setOpen(false)}
							>
								Help &amp; Support
							</Link>
						</li>
					</ul>
					<div className="h-px bg-black/10" />
					<button
						role="menuitem"
						onClick={async () => {
							setOpen(false);
							await signOut();
							router.push('/'); // or wherever you want post-signout
						}}
						className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
					>
						Sign out
					</button>
				</div>
			)}
		</div>
	);
}
