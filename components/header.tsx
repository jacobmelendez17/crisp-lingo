'use client';

import Link from 'next/link';
import Image from 'next/image';
import { APP_TABS } from '@/lib/nav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header = () => {
	const pathname = usePathname();

	return (
		<header className="h-26 w-full border-b-2 bg-[#8ca795] px-4">
			<div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
				<div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
					<Image src="/mascot.svg" alt="Crisp Lingo Otter" width={36} height={36} />
					<h1 className="tracking wide text-4xl font-extrabold text-neutral-600">Crisp Lingo</h1>
				</div>
				<nav className="mx-auto w-full overflow-x-auto px-2 lg:max-w-screen-lg">
					<ul className="flex gap-2 pb-1">
						{APP_TABS.map((t) => {
							const active = t.match.some((m) => pathname?.startsWith(m));
							return (
								<li key={t.href}>
									<Link
										href={t.href}
										className={cn(
											'relative inline-flex rounded-xl px-4 py-2 transition',
											active
												? 'bg-white text-neutral-900 shadow-sm'
												: 'text-neutral-700 hover:bg-white/70'
										)}
									>
										{t.label}
										<span
											className={cn(
												'absolute -bottom-[6px] left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[var(--leaf)] transition-all',
												active && 'w-8'
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
