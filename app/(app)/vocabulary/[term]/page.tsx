import { notFound } from 'next/navigation';
import db from '@/db/drizzle';
import { vocab, userVocabSrs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export const revalidate = 60;

type Props = { params: { term: string } };

export default async function VocabDetailPage({ params }: Props) {
	const term = decodeURIComponent(params.term);

	const row = await db.query.vocab.findFirst({
		where: eq(vocab.word, term)
	});

	if (!row) return notFound();

	const { userId } = await auth();
	let nextReviewText = 'Not scheduled yet';

	if (userId) {
		const [srsRow] = await db
			.select({
				nextReviewAt: userVocabSrs.nextReviewAt
			})
			.from(userVocabSrs)
			.where(and(eq(userVocabSrs.userId, userId), eq(userVocabSrs.vocabId, row.id)))
			.limit(1);

		const nextReviewAt = srsRow?.nextReviewAt as Date | undefined;

		if (nextReviewAt) {
			const now = new Date();
			const diffMs = nextReviewAt.getTime() - now.getTime();

			if (diffMs <= 0) {
				nextReviewText = 'Review available now';
			} else {
				const hours = Math.round(diffMs / (1000 * 60 * 60));

				if (hours < 1) {
					nextReviewText = 'In less than 1 hour';
				} else if (hours === 1) {
					nextReviewText = 'In about 1 hour';
				} else {
					nextReviewText = `In about ${hours} hours`;
				}
			}
		}
	}

	return (
		<main className="mx-auto w-full max-w-[800px] px-4 py-8">
			<h1 className="mb-2 text-4xl font-bold">{row.word}</h1>
			<p className="text-xl text-neutral-700">{row.translation}</p>

			<div className="mt-6 grid gap-6 sm:grid-cols-2">
				<section className="rounded-xl border border-black/5 bg-transparent p-5 shadow-sm">
					<h2 className="mb-2 text-lg font-semibold">Reading / Pronunciation</h2>
					<p>{row.pronunciation ?? '-'}</p>
				</section>

				<section className="rounded-xl border border-black/5 bg-transparent p-5 shadow-sm">
					<h2 className="mb-2 text-lg font-semibold">Meaning</h2>
					<p className="font-medium text-neutral-600">{row.partOfSpeech ?? '-'}</p>
					<p>{row.meaning ?? '-'}</p>
				</section>

				<section className="rounded-xl border border-black/5 bg-transparent p-5 shadow-sm sm:col-span-2">
					<h2 className="mb-2 text-lg font-semibold">Example</h2>
					<p>{row.example ?? '-'}</p>
					<p className="text-neutral-600">{row.exampleTranslation ?? '-'}</p>
				</section>

				<section className="rounded-xl border border-black/5 bg-transparent p-5 shadow-sm">
					<h2 className="mb-2 text-lg font-semibold">More</h2>
					<p>{row.synonyms ?? '-'}</p>
				</section>
			</div>
			<div className="mx-2 h-px flex-1 border-t border-dashed border-black/40" aria-hidden />
			<section className="mt-8 rounded-xl border border-black/5 bg-neutral-50 p-4 text-sm text-neutral-700">
				<h2 className="mb-1 text-base font-semibold">Next review</h2>
				<p>{nextReviewText}</p>
			</section>
			<div className="mx-2 h-px flex-1 border-t border-dashed border-black/40" aria-hidden />
		</main>
	);
}
