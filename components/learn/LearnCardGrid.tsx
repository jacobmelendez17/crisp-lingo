import Image from 'next/image';
import Link from 'next/link';
import { LearnItem } from './types';

export function LearnCardGrid({
	items,
	imageFallback = '/mascot.svg'
}: {
	items: LearnItem[];
	imageFallback?: string;
}) {
	return (
		<div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
			{items.map((it) => {
				const img =
					it.imageUrl && it.imageUrl.startsWith('/')
						? it.imageUrl
						: it.imageUrl
							? `/${it.imageUrl}`
							: imageFallback;

				return (
					<Link key={it.id} href={it.href} className="block w-full max-w-[140px]">
						<div className="group w-full rounded-2xl border border-black/5 bg-white p-2 text-center shadow-sm transition hover:shadow-lg">
							<div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-neutral-50">
								<Image
									src={img}
									alt={it.primary}
									width={64}
									height={64}
									className="h-16 w-16 object-contain"
								/>
							</div>
							<div className="mt-2 space-y-0.5">
								<div className="text-base font-semibold leading-tight text-neutral-800">
									{it.primary}
								</div>
								{it.secondary ? (
									<div className="text-xs text-neutral-600">{it.secondary}</div>
								) : null}
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
