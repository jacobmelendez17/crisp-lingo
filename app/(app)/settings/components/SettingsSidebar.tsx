'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Bell, User, Brain } from 'lucide-react';

const links = [
	{ id: 'general', href: '/settings', label: 'General', icon: Settings },
	{ id: 'account', href: '/settings/account', label: 'Account', icon: User },
	{ id: 'appearance', href: '/settings/appearance', label: 'Appearance', icon: User },
	{ id: 'notifications', href: '/settings/notifications', label: 'Notifications', icon: Bell },
	{ id: 'api', href: '/settings/api', label: 'SRS & Reviews', icon: Brain }
];

export function SettingsSidebar() {
	const pathname = usePathname();

	return (
		<nav className="space-y-0">
			{links.map((link) => {
				const Icon = link.icon;
				const active =
					pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/settings');

				return (
					<div key={link.id} className="group relative">
						<Link
							href={link.href}
							className={cn(
								'relative z-10 flex h-20 w-64 items-center',
								'border border-black/5 bg-[#fff9f5] px-6 text-xl font-semibold',
								'text-neutral-900 shadow-sm',

								'transform transition-all duration-300',
								'hover:translate-x-4',
								active && 'translate-x-4 bg-white shadow-md'
							)}
						>
							<Icon className="h-6 w-6" />
							<span>{link.label}</span>
						</Link>
					</div>
				);
			})}
		</nav>
	);
}
