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

	const ipa = (row as any).ipa as string | null | undefined;

	return (
		<main className="mx-auto w-full max-w-[900px] px-4 py-10 lg:px-0">
			<section className="text-center">
				<h1 className="mt-2 text-6xl font-extrabold text-neutral-900">{row.word}</h1>
				<p className="mt-3 text-2xl text-neutral-700">{row.translation}</p>

				<div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-black/5 bg-[#f0f7ee] px-6 py-3 text-base text-neutral-800 shadow-sm">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
							Part of Speech
						</span>
						<p className="text-lg font-medium">{row.partOfSpeech ?? '—'}</p>
					</div>
					<div>
						<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
							Pronunciation
						</span>
						<p className="text-lg font-medium">{row.pronunciation ?? '—'}</p>
					</div>
					<div>
						<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
							IPA
						</span>
						<p className="text-lg font-medium">{ipa ?? '—'}</p>
					</div>
				</div>
			</section>

			{/* dashed separator */}
			<div className="mt-8 border-t border-dashed border-[#a3c1ad]" />

			{/* Meaning section */}
			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Meaning</h2>

				<p className="mt-4 text-lg leading-relaxed text-neutral-800">
					{row.meaning ?? 'No meaning has been added for this word yet.'}
				</p>

				{row.synonyms && (
					<div className="mt-5 rounded-2xl bg-[#fff9f5] p-5 shadow-sm">
						<h3 className="text-lg font-semibold text-neutral-800">Synonyms</h3>
						<p className="mt-2 text-base text-neutral-700">{row.synonyms}</p>
					</div>
				)}

				{(row.example || row.exampleTranslation) && (
					<div className="mt-5 rounded-2xl bg-[#fff9f5] p-5 shadow-sm">
						<h3 className="text-lg font-semibold text-neutral-800">Example sentence</h3>
						<p className="mt-2 text-lg text-neutral-900">{row.example ?? '-'}</p>
						<p className="mt-2 text-sm text-neutral-600">{row.exampleTranslation ?? ''}</p>
					</div>
				)}
			</section>

			<div className="mt-10 border-t border-dashed border-[#a3c1ad]" />

			{/* Reading section */}
			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Reading</h2>
				<p className="mt-4 text-lg text-neutral-800">
					{row.pronunciation ?? 'No pronunciation has been added yet.'}
				</p>
			</section>

			<div className="mt-10 border-t border-dashed border-[#a3c1ad]" />

			{/* Progress / next review */}
			<section className="mt-8 rounded-2xl bg-[#f0f7ee] p-5 text-neutral-800 shadow-sm">
				<h2 className="mb-2 text-2xl font-semibold text-neutral-900">Next review</h2>
				<p className="text-lg">{nextReviewText}</p>
			</section>
		</main>
	);
}
