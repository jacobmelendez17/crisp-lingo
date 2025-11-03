import Image from 'next/image';
import Link from 'next/link';
import { LearnItem } from './types';

export function LearnList({
	items,
	imageFallback = '/mascot.svg'
}: {
	items: LearnItem[];
	imageFallback?: string;
}) {
	return (
		<div className="divide-y divide-dashed divide-black/30 rounded-xl border border-black/10 bg-white">
			{items.map((it) => {
				const img =
					it.imageUrl && it.imageUrl.startsWith('/')
						? it.imageUrl
						: it.imageUrl
							? `/${it.imageUrl}`
							: imageFallback;

				return (
					<Link key={it.id} href={it.href}>
						<div className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50">
							{/* Left: tiny image + secondary (translation/structure) */}
							<div className="flex min-w-0 items-center gap-2">
								<Image
									src={img}
									alt={it.primary}
									width={24}
									height={24}
									className="h-6 w-6 rounded object-contain"
								/>
								{it.secondary ? (
									<span className="truncate text-sm text-neutral-700">{it.secondary}</span>
								) : (
									<span className="truncate text-sm text-neutral-400">—</span>
								)}
							</div>

							{/* Dashed leader */}
							<div
								className="mx-2 h-px flex-1 border-t border-dashed border-black/40"
								aria-hidden
							/>

							{/* Right: primary (word/title) */}
							<div className="shrink-0 text-right text-sm font-semibold text-neutral-900">
								{it.primary}
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
