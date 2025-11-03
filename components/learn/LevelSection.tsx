// src/components/learn/LevelSection.tsx
import { ReactNode } from 'react';

export function LevelSection({
	title,
	children,
	showEmpty = false,
	emptyText = 'Coming soon!',
	headerBg = '#97ac82',
	first = false,
	rightSlot
}: {
	title: string;
	children?: ReactNode;
	showEmpty?: boolean;
	emptyText?: string;
	headerBg?: string;
	first?: boolean;
	rightSlot?: ReactNode;
}) {
	return (
		<section className={first ? 'mt-6' : 'mt-10'}>
			{/* One row: [chip] ---- dashed ---- [optional right slot] */}
			<div className="mb-3 flex items-center gap-3">
				<div
					className="rounded-full px-3 py-1 text-lg font-semibold text-white"
					style={{ backgroundColor: headerBg }}
				>
					{title}
				</div>
				<div className="h-px flex-1 border-t border-dashed border-black" />
				{rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
			</div>

			{showEmpty ? (
				<div className="rounded-xl border border-dashed border-black/20 bg-white p-6 text-center text-neutral-600">
					{emptyText}
				</div>
			) : (
				children
			)}
		</section>
	);
}
