'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Bell, User, Brain } from 'lucide-react';

const links = [
	{
		id: 'general',
		href: '/settings',
		label: 'General',
		icon: Settings
	},
	{
		id: 'notifications',
		href: '/settings/notifications',
		label: 'Notifications',
		icon: Bell
	},
	{
		id: 'account',
		href: '/settings/account',
		label: 'Account',
		icon: User
	},
	{
		id: 'srs',
		href: '/settings/srs',
		label: 'SRS & Reviews',
		icon: Brain
	}
];

export function SettingsSidebar() {
	const pathname = usePathname();

	return (
		<div className="rounded-2xl border border-black/5 bg-[#f7f3ea] p-4 shadow-sm">
			<nav className="space-y-1">
				{links.map((link) => {
					const Icon = link.icon;
					const active =
						pathname === link.href ||
						(pathname?.startsWith(link.href) && link.href !== '/settings');

					return (
						<div key={link.id} className="group relative">
							<span
								className={cn(
									'pointer-events-none absolute inset-y-0 right-[-10px] w-3 rounded-r-xl',
									'translate-x-0 bg-[#9bc57a] opacity-0 transition-all duration-150',
									'group-hover:translate-x-[2px] group-hover:opacity-100',
									active && 'translate-x-[2px] opacity-100'
								)}
							/>

							<Link
								href={link.href}
								className={cn(
									'relative z-10 flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm font-medium',
									'transition-all duration-150',
									'bg-[#9bc57a] text-neutral-900',
									'group-hover:translate-x-[4px] group-hover:shadow-sm',
									active && 'translate-x-[4px] border-black/20 shadow-md'
								)}
							>
								<Icon className="h-4 w-4" />
								<span>{link.label}</span>
							</Link>
						</div>
					);
				})}
			</nav>
		</div>
	);
}
