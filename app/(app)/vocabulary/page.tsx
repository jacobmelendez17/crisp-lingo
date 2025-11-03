import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

import { BRAND, IMAGE } from '@/lib/constants';
import { LEVEL_RANGES, parseRangeKey } from '@/lib/learn/ranges';
import { formatNextReview } from '@/lib/learn/format';
import { groupByLevelId } from '@/lib/learn/group';
import { fetchLevels, sliceLevels, fetchVocabForLevels } from '@/lib/learn/fetch';

type PageProps = { searchParams: Promise<{ range?: string }> };

export default async function VocabularyPage({ searchParams }: PageProps) {
	const sp = await searchParams;
	const { userId } = await auth();
	const { start, end, key } = parseRangeKey(sp?.range);

	const all = await fetchLevels();
	const selected = await sliceLevels(all, start, end);
	const selectedIds = selected.map((l) => l.id);

	const rows = await fetchVocabForLevels(selectedIds, userId);
	const groups = groupByLevelId(rows);

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="pt-2 text-5xl font-bold text-neutral-800">Vocabulary</h1>

				<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
					{LEVEL_RANGES.map((r) => {
						const href = r === '1-10' ? '/vocabulary' : `/vocabulary?range=${r}`;
						const isActive = r === key;
						return (
							<Link key={r} href={href}>
								<Button
									variant={isActive ? 'default' : 'secondary'}
									className={isActive ? 'bg-[#97ac82] text-white hover:opacity-90' : ''}
								>
									{r}
								</Button>
							</Link>
						);
					})}
				</div>
			</div>

			{selected.map((lvl, idx) => {
				const items = groups.get(lvl.id) ?? [];
				return (
					<section key={lvl.id} className={idx === 0 ? 'mt-6' : 'mt-10'}>
						<div className="mb-3 flex items-center gap-3">
							<div
								className="rounded-full px-3 py-1 text-lg font-semibold text-white"
								style={{ backgroundColor: BRAND.primary }}
							>
								{lvl.title || `Level ${start + idx}`}
							</div>
							<div className="h-px flex-1 border-t border-dashed border-black" />
						</div>

						{items.length === 0 ? (
							<div className="rounded-xl border border-dashed border-black/20 bg-white p-6 text-center text-neutral-600">
								Coming soon!
							</div>
						) : (
							<div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
								{items.map((r) => {
									const img =
										r.imageUrl && r.imageUrl.startsWith('/')
											? r.imageUrl
											: r.imageUrl
												? `/${r.imageUrl}`
												: IMAGE.fallback;
									return (
										<Link
											key={r.id}
											href={`/vocabulary/${encodeURIComponent(r.word)}`}
											className="block w-full max-w-[140px]"
										>
											<div className="group w-full rounded-2xl border border-black/5 bg-white p-2 text-center shadow-sm transition hover:shadow-lg">
												<div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-neutral-50">
													<Image
														src={img}
														alt={r.word}
														width={64}
														height={64}
														className="h-16 w-16 object-contain"
													/>
												</div>
												<div className="mt-2 space-y-0.5">
													<div className="text-base font-semibold leading-tight text-neutral-800">
														{r.word}
													</div>
													<div className="text-xs text-neutral-600">{r.translation}</div>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						)}
					</section>
				);
			})}
		</main>
	);
}
