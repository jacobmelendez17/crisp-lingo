'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Bell, User, Brain } from 'lucide-react';

const links = [
	{
		href: '/settings',
		label: 'General',
		icon: Settings
	},
	{
		href: '/settings',
		label: 'Notifications',
		icon: Bell
	},
	{
		href: '/settings',
		label: 'Account',
		icon: User
	},
	{
		href: '/settings',
		label: 'API',
		icon: Brain
	}
];

export function SettingsSidebar() {
	const pathname = usePathname();

	return (
		<div className="rounded-2xl border border-black/5 bg-[#f7f3ea] p-4 shadow-sm">
			<h2 className="mb-4 text-xl font-semibold text-neutral-800">Settings</h2>
			<nav className="space-y-1">
				{links.map((link) => {
					const Icon = link.icon;
					const active =
						pathname === link.href ||
						(pathname?.startsWith(link.href) && link.href !== '/settings');

					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all',
								'hover:bg-white/80 hover:text-neutral-900',
								active ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
							)}
						>
							<Icon className="h-4 w-4" />
							<span>{link.label}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
