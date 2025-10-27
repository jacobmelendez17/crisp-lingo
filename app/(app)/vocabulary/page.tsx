import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { asc, and, eq, sql } from 'drizzle-orm';
import { Button } from '@/components/ui/button';

import db from '@/db/drizzle';
import { vocab, userVocabSrs } from '@/db/schema';

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

export default async function VocabularyPage() {
	const { userId } = await auth();

	const rows = userId
		? await db
				.select({
					id: vocab.id,
					word: vocab.word,
					translation: vocab.translation,
					imageUrl: vocab.imageUrl,
					srsLevel: sql<number>`COALESCE(${userVocabSrs.srsLevel}, 0)`,
					nextReviewAt: userVocabSrs.nextReviewAt // <-- add this
				})
				.from(vocab)
				.leftJoin(
					userVocabSrs,
					and(eq(userVocabSrs.vocabId, vocab.id), eq(userVocabSrs.userId, userId))
				)
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id))
		: await db
				.select({
					id: vocab.id,
					word: vocab.word,
					translation: vocab.translation,
					imageUrl: vocab.imageUrl,
					srsLevel: sql<number>`0`,
					// return NULL for guests so UI shows "—"
					nextReviewAt: sql<Date>`NULL` // <-- add this
				})
				.from(vocab)
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));

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

			<div
				className="my-6 h-[2px] w-full"
				style={{
					backgroundImage:
						'repeating-linear-gradient(to right, #a3c1ad 0 10px, transparent 10px 20px)'
				}}
			/>

			<div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{rows.map((r) => {
					const img = r.imageUrl
						? r.imageUrl.startsWith('/')
							? r.imageUrl
							: `/${r.imageUrl}`
						: '/mascot.svg';

					return (
						<div
							key={r.id}
							className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md"
						>
							<div className="mb-3 flex items-center gap-3">
								<div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-neutral-50">
									<Image
										src={img}
										alt={r.word}
										width={64}
										height={64}
										className="h-16 w-16 object-contain"
									/>
								</div>

								<div className="ml-auto text-right">
									<div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
										SRS {r.srsLevel}
									</div>
									<div
										className="mt-1 text-[11px] font-medium text-neutral-500"
										title={r.nextReviewAt ? new Date(r.nextReviewAt).toLocaleString() : ''}
									>
										Next review: {formatNextReview(r.nextReviewAt as unknown as Date | null)}
									</div>
								</div>
							</div>

							<div className="space-y-1">
								<div className="text-lg font-semibold text-neutral-800">{r.word}</div>
								<div className="text-sm text-neutral-600">{r.translation}</div>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}
