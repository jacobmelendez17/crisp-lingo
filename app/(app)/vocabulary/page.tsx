import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { asc, and, eq, inArray, sql } from 'drizzle-orm';
import Link from 'next/link';

import db from '@/db/drizzle';
import { vocab, userVocabSrs, levels } from '@/db/schema';
import { Button } from '@/components/ui/button';

function formatNextReview(d: Date | null) {
	if (!d) return '—';
	const now = new Date();
	const diffMs = d.getTime() - now.getTime();
	if (diffMs <= 0) return 'Ready now';
	const minutes = Math.round(diffMs / 60000);
	if (minutes < 60) return `in ${minutes} min`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return `in ${hours} h`;
	const days = Math.round(hours / 24);
	return `in ${days} day${days === 1 ? '' : 's'}`;
}

const RANGES = ['1-10', '11-20', '21-30', '31-40', '41-50'] as const;
type RangeKey = (typeof RANGES)[number];

function parseRange(r?: string): { start: number; end: number; key: RangeKey } {
	const key = (RANGES.includes(r as RangeKey) ? (r as RangeKey) : '1-10') as RangeKey;
	const [a, b] = key.split('-').map(Number);
	return { start: a, end: b, key };
}

type Row = {
	id: number;
	word: string;
	translation: string;
	imageUrl: string | null;
	levelId: number;
	srsLevel: number;
	nextReviewAt: Date | null;
};

export default async function VocabularyPage({
	searchParams
}: {
	searchParams?: { range?: string };
}) {
	const { userId } = await auth();
	const sp = await searchParams;
	const { start, end, key } = parseRange(searchParams?.range);

	// 1) Get all levels (order is your canonical level order)
	const allLevels = await db
		.select({ id: levels.id, title: levels.title })
		.from(levels)
		.orderBy(asc(levels.id))
		.limit(200); // adjust if you expect more

	// Convert 1-based [start,end] into 0-based slice
	const selectedLevels = allLevels.slice(start - 1, end);
	const selectedLevelIds = selectedLevels.map((l) => l.id);

	// 2) Fetch vocab for just the selected levels
	let rows: Row[] = [];
	if (selectedLevelIds.length) {
		if (userId) {
			rows = await db
				.select({
					id: vocab.id,
					word: vocab.word,
					translation: vocab.translation,
					imageUrl: vocab.imageUrl,
					levelId: vocab.levelId,
					srsLevel: sql<number>`COALESCE(${userVocabSrs.srsLevel}, 0)`,
					nextReviewAt: userVocabSrs.nextReviewAt
				})
				.from(vocab)
				.leftJoin(
					userVocabSrs,
					and(eq(userVocabSrs.vocabId, vocab.id), eq(userVocabSrs.userId, userId))
				)
				.where(inArray(vocab.levelId, selectedLevelIds))
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));
		} else {
			rows = await db
				.select({
					id: vocab.id,
					word: vocab.word,
					translation: vocab.translation,
					imageUrl: vocab.imageUrl,
					levelId: vocab.levelId,
					srsLevel: sql<number>`0`,
					nextReviewAt: sql<Date>`NULL`
				})
				.from(vocab)
				.where(inArray(vocab.levelId, selectedLevelIds))
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));
		}
	}

	// 3) Group fetched vocab by levelId
	const itemsByLevel = new Map<number, Row[]>();
	for (const l of selectedLevelIds) itemsByLevel.set(l, []);
	for (const r of rows) itemsByLevel.get(r.levelId)!.push(r);

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="pt-2 text-5xl font-bold text-neutral-800">Vocabulary</h1>

				{/* Range buttons */}
				<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
					{RANGES.map((r) => {
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

			{/* Level sections for the selected range */}
			{selectedLevels.map((lvl, idx) => {
				const items = itemsByLevel.get(lvl.id) ?? [];
				return (
					<section key={lvl.id} className={idx === 0 ? 'mt-6' : 'mt-10'}>
						{/* Small header + dashed divider */}
						<div className="mb-3 flex items-center gap-3">
							<div className="rounded-full bg-[#97ac82] px-3 py-1 text-lg font-semibold text-black">
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
									const img = r.imageUrl
										? r.imageUrl.startsWith('/')
											? r.imageUrl
											: `/${r.imageUrl}`
										: '/mascot.svg';

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
