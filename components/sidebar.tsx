import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarItem } from './sidebar-item';
import { ClerkLoading, ClerkLoaded, UserButton } from '@clerk/nextjs';
import { Loader } from 'lucide-react';

type Props = {
	className?: string;
};

export const Sidebar = ({ className }: Props) => {
	return (
		<div
			className={cn(
				'left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]',
				className
			)}
		>
			<Link href="/learn">
				<div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
					<Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
					<h1 className="tracking wide text-2xl font-extrabold text-green-600">Crisp Lingo</h1>
				</div>
			</Link>
			<div className="flex flex-1 flex-col gap-y-2">
				<SidebarItem label="Learn" href="/learn" iconSrc="/learn.svg" />
				<SidebarItem label="Leaderboard" href="/leaderboard" iconSrc="/learnboard.svg" />
				<SidebarItem label="Quests" href="/quests" iconSrc="/quests.svg" />
				<SidebarItem label="Shop" href="/shop" iconSrc="/shop.svg" />
			</div>
			<div className="p-4">
				<ClerkLoading>
					<Loader className="text-muted-foreground h-5 w-5 animate-spin" />
				</ClerkLoading>
				<ClerkLoaded>
					<UserButton afterSignOutUrl="/" />
				</ClerkLoaded>
			</div>
		</div>
	);
};
