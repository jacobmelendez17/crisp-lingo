'use client';

import Link from 'next/link';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

export function ViewToggle({
	active,
	hrefCards,
	hrefList,
	color = '#b8d9b3'
}: {
	active: 'cards' | 'list';
	hrefCards: string;
	hrefList: string;
	color?: string;
}) {
	return (
		<div
			className="relative inline-flex h-10 w-[120px] items-center rounded-full bg-white shadow-sm"
			aria-label="Toggle view"
			role="tablist"
		>
			{/* Sliding green pill */}
			<span
				className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out"
				style={{
					backgroundColor: color,
					transform: active === 'cards' ? 'translateX(0%)' : 'translateX(100%)'
				}}
				aria-hidden
			/>

			{/* Cards icon */}
			<Link
				href={hrefCards}
				role="tab"
				aria-selected={active === 'cards'}
				className="relative z-10 flex w-1/2 items-center justify-center"
				title="Cards"
			>
				<LayoutGrid
					className={`h-5 w-5 transition-colors duration-200 ${
						active === 'cards' ? 'text-neutral-900' : 'text-neutral-600'
					}`}
					strokeWidth={2}
				/>
				<span className="sr-only">Cards view</span>
			</Link>

			{/* List icon */}
			<Link
				href={hrefList}
				role="tab"
				aria-selected={active === 'list'}
				className="relative z-10 flex w-1/2 items-center justify-center"
				title="List"
			>
				<ListIcon
					className={`h-5 w-5 transition-colors duration-200 ${
						active === 'list' ? 'text-neutral-900' : 'text-neutral-600'
					}`}
					strokeWidth={2}
				/>
				<span className="sr-only">List view</span>
			</Link>
		</div>
	);
}
