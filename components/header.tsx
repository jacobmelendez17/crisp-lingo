'use client';

import Link from 'next/link';
import Image from 'next/image';
import { APP_TABS } from '@/lib/nav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

export const Header = () => {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [query, setQuery] = useState('');

	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) setOpen(false);
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpen(false);
				setSearchOpen(false);
			}
		};
		document.addEventListener('mousedown', onDocClick);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			document.removeEventListener('keydown', onEsc);
		};
	}, []);

	useEffect(() => {
		if (searchOpen) {
			requestAnimationFrame(() => inputRef.current?.focus());
		}
	})

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Searching for:', query);
	};

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

					<form
						onSubmit={handleSearch}
						className="relative ml-6 flex items-center"
						role="search"
						>
						<div
							className={cn(
							'overflow-hidden transition-all duration-200 ease-out',
							searchOpen ? 'w-48 opacity-100 lg:w-48' : 'w-0 opacity-0'
							)}
							aria-hidden={!searchOpen}
						>
							<Input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search..."
								className={cn(
									'rounded-xl border-2 border-white/70 bg-white/90 px-4 py-2 text-lg text-neutral-800 placeholder:text-neutral-500',
									'focus:border-white focus:ring-2 focus:ring-white/50'
								)}
								tabIndex={searchOpen ? 0 : -1}
							/>
						</div>

						<button
							type="button"
							onClick={() => {
							if (searchOpen) {
								setSearchOpen(false);
								setQuery('');
							} else {
								setSearchOpen(true);
							}
							}}
							className={cn(
							'ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl',
							'bg-white/70 text-neutral-800 shadow-sm transition hover:bg-white'
							)}
							aria-label={searchOpen ? 'Close search' : 'Open search'}
						>
							{searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
						</button>
					</form>


					<ProfileDropdown
						className="ml-4"
						email="you@example.com"
						avatarSrc="/profile-avatar.png"
					/>
				</nav>
			</div>
		</header>
	);
};
