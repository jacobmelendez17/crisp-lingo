'use client';

import Link from 'next/link';
import Image from 'next/image';
import { APP_TABS } from '@/lib/nav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header = () => {
	const pathname = usePathname();

	return (
		<header className="h-26 w-full border-b-2 bg-[#8ca795] px-6 lg:px-8">
			<div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
				{/* Left side: logo + title */}
				<div className="flex items-center gap-x-3 pb-7 pt-8">
					<Image
						src="/mascot.svg"
						alt="Crisp Lingo Otter"
						width={40}
						height={40}
						className="ml-[-8px]" // move logo slightly left
					/>
					<h1 className="text-5xl font-extrabold tracking-wide text-neutral-600">
						<Link href="/dashboard">Crisp Lingo</Link>
					</h1>
				</div>

				{/* Right side: nav */}
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
				</nav>
			</div>
		</header>
	);
};
