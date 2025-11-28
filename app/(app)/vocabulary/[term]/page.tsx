import { notFound } from 'next/navigation';
import db from '@/db/drizzle';
import { vocab, userVocabSrs, vocabExamples } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import { ExampleSentenceCard } from './ExampleSentenceCard';
import { getVocabByWord, getVocabExamples } from '@/db/queries';

export const revalidate = 60;

type Props = { params: { term: string } };

export default async function VocabDetailPage({ params }: Props) {
	const term = decodeURIComponent((await params).term);

	const row = await getVocabByWord(term);

	if (!row) return notFound();

	let lastReviewedAt: Date | undefined;
	let firstLearnedAt: Date | undefined;

	const examples = await getVocabExamples(row.id);

	const { userId } = await auth();
	let nextReviewText = 'Not scheduled yet';

	if (userId) {
		const [srsRow] = await db
			.select({
				nextReviewAt: userVocabSrs.nextReviewAt,
				lastReviewedAt: userVocabSrs.lastReviewedAt,
				firstLearnedAt: userVocabSrs.firstLearnedAt
			})
			.from(userVocabSrs)
			.where(and(eq(userVocabSrs.userId, userId), eq(userVocabSrs.vocabId, row.id)))
			.limit(1);

		const nextReviewAt = srsRow?.nextReviewAt as Date | undefined;
		lastReviewedAt = srsRow?.lastReviewedAt as Date | undefined;
		firstLearnedAt = srsRow?.firstLearnedAt as Date | undefined;

		if (nextReviewAt) {
			const now = new Date();
			const diffMs = nextReviewAt.getTime() - now.getTime();

			if (diffMs <= 0) {
				nextReviewText = 'Available now';
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
				{row.imageUrl && (
					<div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
						<Image
							src={row.imageUrl}
							alt={row.word}
							width={128}
							height={128}
							className="object-contain p-2"
						/>
					</div>
				)}

				<h1 className="mt-2 text-6xl font-extrabold text-neutral-900">{row.word}</h1>
				<p className="mt-3 text-2xl text-neutral-700">{row.translation}</p>

				<div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-black/5 bg-[#f0f7ee] px-6 py-3 text-base text-neutral-800 shadow-sm">
					<div>
						<span className="text-small font-semibold uppercase tracking-wide text-neutral-500">
							Part Of Speech
						</span>
						<p className="text-lg font-medium">{row.partOfSpeech ?? '—'}</p>
					</div>
					<div>
						<span className="text-small font-semibold uppercase tracking-wide text-neutral-500">
							Pronunciation
						</span>
						<p className="text-lg font-medium">{row.pronunciation ?? '—'}</p>
					</div>
					<div>
						<span className="text-small font-semibold uppercase tracking-wide text-neutral-500">
							IPA
						</span>
						<p className="text-lg font-medium">{ipa ?? '—'}</p>
					</div>
				</div>
			</section>

			{/* dashed separator */}
			<div className="mt-8 border-t border-dashed border-black" />

			{/* Meaning section */}
			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Meaning</h2>

				<p className="mt-4 text-xl leading-relaxed text-neutral-800">
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

			<div className="mt-10 border-t border-dashed border-black" />

			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Reading</h2>
				<p className="mt-4 text-lg text-neutral-800">
					{row.pronunciation ?? 'No pronunciation has been added yet.'}
				</p>
			</section>

			<div className="mt-10 border-t border-dashed border-black" />

			<section className="mt-8">
				<ExampleSentenceCard
					examples={examples.map((ex) => ({
						id: ex.id,
						sentence: ex.sentence,
						translation: ex.translation ?? '',
						audioUrl: ex.audioUrl ?? undefined
					}))}
				/>
			</section>

			<div className="mt-10 border-t border-dashed border-black" />

			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Current Progress</h2>
				<p className="mt-4 text-lg text-neutral-800">
					{row.pronunciation ?? 'No pronunciation has been added yet.'}
				</p>
			</section>

			<div className="mt-10 border-t border-dashed border-black" />

			{/* Progress strip */}
			<section className="mt-8 grid gap-4 sm:grid-cols-3">
				{/* Next Review */}
				<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm">
					<h2 className="text-xl font-semibold text-neutral-900">Next Review</h2>
					<p className="mt-2 text-lg text-neutral-800">{nextReviewText}</p>
				</div>

				{/* Last Reviewed */}
				<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm">
					<h2 className="text-xl font-semibold text-neutral-900">Last Reviewed</h2>
					<p className="mt-2 text-lg text-neutral-800">
						{lastReviewedAt ? lastReviewedAt.toLocaleDateString() : '—'}
					</p>
				</div>

				{/* Unlocked Date */}
				<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm">
					<h2 className="text-xl font-semibold text-neutral-900">Unlocked On</h2>
					<p className="mt-2 text-lg text-neutral-800">
						{firstLearnedAt ? firstLearnedAt.toLocaleDateString() : '—'}
					</p>
				</div>
			</section>
		</main>
	);
}
