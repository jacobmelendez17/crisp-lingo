'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ViewToggle({
	active,
	hrefCards,
	hrefList
}: {
	active: 'cards' | 'list';
	hrefCards: string;
	hrefList: string;
}) {
	return (
		<div className="relative inline-flex h-10 w-[180px] items-center rounded-[28px] border border-black/10 bg-white">
			{/* Sliding pill */}
			<span
				className="absolute inset-y-1 left-1 w-1/2 rounded-[24px] bg-[#b8d9b3] transition-transform duration-300 ease-out"
				style={{ transform: active === 'cards' ? 'translateX(0%)' : 'translateX(100%)' }}
				aria-hidden
			/>

			<Link href={hrefCards} className="relative z-10 w-1/2">
				<Button
					size="sm"
					variant="outline"
					className={`w-full rounded-[24px] text-sm ${
						active === 'cards' ? 'text-neutral-900' : 'text-neutral-700'
					}`}
				>
					Cards
				</Button>
			</Link>

			<Link href={hrefList} className="relative z-10 w-1/2">
				<Button
					size="sm"
					variant="outline"
					className={`w-full rounded-[24px] text-sm ${
						active === 'list' ? 'text-neutral-900' : 'text-neutral-700'
					}`}
				>
					List
				</Button>
			</Link>
		</div>
	);
}
