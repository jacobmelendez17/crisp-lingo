import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { asc, and, eq, sql } from 'drizzle-orm';

import db from '@/db/drizzle';
import { vocab, userVocabSrs } from '@/db/schema';

export default async function VocabularyPage() {
	const { userId } = await auth();

	// Build a query that returns every vocab row + the user's SRS level (or 0)
	const rows = userId
		? await db
				.select({
					id: vocab.id,
					word: vocab.word,
					translation: vocab.translation,
					imageUrl: vocab.imageUrl,
					srsLevel: sql<number>`COALESCE(${userVocabSrs.srsLevel}, 0)`
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
					srsLevel: sql<number>`0`
				})
				.from(vocab)
				.orderBy(asc(vocab.levelId), asc(vocab.position), asc(vocab.id));

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<h1 className="pt-2 text-2xl font-bold text-neutral-800">Vocabulary</h1>

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

								<div className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
									SRS {r.srsLevel}
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
