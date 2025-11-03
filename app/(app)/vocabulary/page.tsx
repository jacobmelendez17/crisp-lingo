import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { asc, and, eq, sql } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import db from '@/db/drizzle';
import { vocab, userVocabSrs, levels } from '@/db/schema'; // <-- import levels

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

type Row = {
	id: number;
	word: string;
	translation: string;
	imageUrl: string | null;
	levelId: number;
	levelTitle: string;
	srsLevel: number;
	nextReviewAt: Date | null;
};

export default async function VocabularyPage() {
	const { userId } = await auth();

	const baseSelect = {
		id: vocab.id,
		word: vocab.word,
		translation: vocab.translation,
		imageUrl: vocab.imageUrl,
		levelId: vocab.levelId,
		levelTitle: levels.title
	};

	const rows: Row[] = userId
		? await db
				.select({
					...baseSelect,
					srsLevel: sql<number>`COALESCE(${userVocabSrs.srsLevel}, 0)`,
					nextReviewAt: userVocabSrs.nextReviewAt
				})
				.from(vocab)
				.leftJoin(
					userVocabSrs,
					and(eq(userVocabSrs.vocabId, vocab.id), eq(userVocabSrs.userId, userId))
				)
				.innerJoin(levels, eq(levels.id, vocab.levelId))
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id))
		: await db
				.select({
					...baseSelect,
					srsLevel: sql<number>`0`,
					nextReviewAt: sql<Date>`NULL`
				})
				.from(vocab)
				.innerJoin(levels, eq(levels.id, vocab.levelId))
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));

	// Group rows by levelId (preserves order due to orderBy)
	const byLevel = new Map<number, { title: string; items: Row[] }>();
	for (const r of rows) {
		if (!byLevel.has(r.levelId)) byLevel.set(r.levelId, { title: r.levelTitle, items: [] });
		byLevel.get(r.levelId)!.items.push(r);
	}

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="pt-2 text-5xl font-bold text-neutral-800">Vocabulary</h1>

				<div className="mt-4 flex flex-wrap items-center justify-center gap-4">
					<Button>1-10</Button>
					<Button>11-20</Button>
					<Button>21-30</Button>
					<Button>31-40</Button>
					<Button>41-50</Button>
				</div>
			</div>

			{/*<div
				className="my-6 h-[2px] w-full"
				style={{
					backgroundImage:
						'repeating-linear-gradient(to right, #a3c1ad 0 10px, transparent 10px 20px)'
				}}
			/>*/}

			{/* Render each level as its own section */}
			{[...byLevel.entries()].map(([levelId, group], idx) => (
				<section key={levelId} className={idx === 0 ? 'mt-6' : 'mt-10'}>
					{/* Small header + dashed divider */}
					<div className="mb-3 flex items-center gap-3">
						<div className="rounded-full bg-[#97ac82] px-3 py-1 text-2xl font-semibold text-neutral-700">
							{group.title || `Level ${idx + 1}`}
						</div>
						<div className="h-px flex-1 border-t border-dashed border-black" />
					</div>

					{/* 10 per row on xl; smaller on down breakpoints */}
					<div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
						{group.items.map((r) => {
							const img = r.imageUrl
								? r.imageUrl.startsWith('/')
									? r.imageUrl
									: `/${r.imageUrl}`
								: '/mascot.svg';

							return (
								<Link
									key={r.id}
									href={`/vocabulary/${encodeURIComponent(r.word)}`}
									className="block w-full max-w-[140px]" // narrower card
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
				</section>
			))}
		</main>
	);
}
