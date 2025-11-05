'use client';

import Link from 'next/link';
import Image from 'next/image';
import { APP_TABS } from '@/lib/nav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useEffect, useRef, useState } from 'react';

export const Header = () => {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) setOpen(false);
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		document.addEventListener('mousedown', onDocClick);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			document.removeEventListener('keydown', onEsc);
		};
	}, []);

	return (
		<header className="h-26 w-full border-b-2 bg-[#8ca795] px-6 lg:px-8">
			<div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
				<div className="flex items-center gap-x-3 pb-7 pt-8">
					<Image
						src="/otter.svg"
						alt="Crisp Lingo Otter"
						width={40}
						height={40}
						className="ml-[-150px]"
					/>
					<h1 className="text-5xl font-extrabold tracking-wide text-neutral-600">
						<Link href="/dashboard">Crisp Lingo</Link>
					</h1>
				</div>

				<nav className="flex items-center pb-7 pt-8">
					<ul className="flex gap-6">
						{APP_TABS.map((t) => {
							const active = t.match.some((m) => pathname?.startsWith(m));

							return (
								<li key={t.href}>
									<Link
										href={t.href}
										className={cn(
											'relative inline-flex rounded-xl px-4 py-2 text-xl font-semibold transition-all',
											active
												? 'scale-105 bg-white text-neutral-900 shadow-sm'
												: 'text-neutral-700 hover:scale-105 hover:bg-white/70'
										)}
									>
										{t.label}
										<span
											className={cn(
												'absolute -bottom-[6px] left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[var(--leaf)] transition-all duration-200',
												active && 'w-10'
											)}
										/>
									</Link>
								</li>
							);
						})}
					</ul>
					<div className="relative ml-4" ref={menuRef}>
						<button
							aria-haspopup="menu"
							aria-expanded={open}
							onClick={() => setOpen((v) => !v)}
							className="rounded-full border-2 border-white outline-none ring-offset-2 transition-transform hover:scale-105 focus:ring-2 focus:ring-white/60"
						>
							<Image
								src="/profile-avatar.png" // swap for your dynamic avatar if you have one
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
									<p className="truncate text-neutral-600">you@example.com</p>
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
											Help & Support
										</Link>
									</li>
								</ul>
								<div className="h-px bg-black/10" />
								<button
									role="menuitem"
									onClick={() => {
										setOpen(false);
										// TODO: call your signOut() here if using Clerk/NextAuth
									}}
									className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
								>
									Sign out
								</button>
							</div>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
};
