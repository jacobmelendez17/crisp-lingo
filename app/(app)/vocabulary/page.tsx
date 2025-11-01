import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { asc, and, eq, sql } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
					nextReviewAt: userVocabSrs.nextReviewAt
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
					nextReviewAt: sql<Date>`NULL`
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

			<div className="mt-8 grid justify-items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
				{rows.map((r) => {
					const img = r.imageUrl
						? r.imageUrl.startsWith('/')
							? r.imageUrl
							: `/${r.imageUrl}`
						: '/mascot.svg';

					return (
						<Link href={`/vocabulary/${encodeURIComponent(r.word)}`} className="block">
							<div
								key={r.id}
								className="group w-full max-w-[440px] rounded-2xl border border-black/5 bg-white p-1 text-center shadow-sm transition hover:shadow-lg"
							>
								<div className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-xl bg-neutral-50">
									<Image
										src={img}
										alt={r.word}
										width={96}
										height={96}
										className="h-24 w-24 object-contain"
									/>
								</div>

								<div className="mt-3 space-y-1">
									<div className="text-lg font-semibold text-neutral-800">{r.word}</div>
									<div className="text-sm text-neutral-600">{r.translation}</div>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</main>
	);
}
