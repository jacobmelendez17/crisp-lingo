import { notFound } from 'next/navigation';
import db from '@/db/drizzle';
import { userVocabSrs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import { ExampleSentenceCard } from './ExampleSentenceCard';
import { getVocabByWord, getVocabExamples } from '@/db/queries';
import { AudioPlayButton } from './AudioPlayButton';

export const revalidate = 60;

type Props = { params: Promise<{ term: string }> };

const MAX_SRS_LEVEL = 8;

function formatDate(value?: Date | null) {
	if (!value) return '—';

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(value));
}

function formatDateTime(value?: Date | null) {
	if (!value) return '—';

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}).format(new Date(value));
}

function getRelativeReviewText(nextReviewAt?: Date | null) {
	if (!nextReviewAt) return 'Not scheduled yet';

	const now = new Date();
	const diffMs = new Date(nextReviewAt).getTime() - now.getTime();

	if (diffMs <= 0) return 'Available now';

	const minutes = Math.round(diffMs / (1000 * 60));
	const hours = Math.round(diffMs / (1000 * 60 * 60));
	const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

	if (minutes < 60) {
		if (minutes <= 1) return 'In less than 1 minute';
		return `In about ${minutes} minutes`;
	}

	if (hours < 24) {
		if (hours === 1) return 'In about 1 hour';
		return `In about ${hours} hours`;
	}

	if (days === 1) return 'In about 1 day';
	return `In about ${days} days`;
}

function StatPill({
	label,
	value
}: {
	label: string;
	value: string | number;
}) {
	return (
		<div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm">
			<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
				{label}
			</p>
			<p className="mt-1 text-lg font-semibold text-neutral-900">{value}</p>
		</div>
	);
}

function AccuracyBar({
	label,
	correct,
	incorrect
}: {
	label: string;
	correct: number;
	incorrect: number;
}) {
	const total = correct + incorrect;
	const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

	return (
		<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h3 className="text-xl font-semibold text-neutral-900">{label}</h3>
					<p className="mt-1 text-sm text-neutral-600">
						{total > 0
							? `${correct} correct · ${incorrect} incorrect · ${total} total`
							: 'No review data yet'}
					</p>
				</div>

				<div className="shrink-0 text-right">
					<p className="text-2xl font-extrabold text-[#2f9e44]">{percent}%</p>
					<p className="text-xs uppercase tracking-wide text-neutral-500">Accuracy</p>
				</div>
			</div>

			<div className="mt-4">
				<div className="h-5 overflow-hidden rounded-full bg-[#dbe7de] shadow-inner">
					<div
						className="flex h-full items-center justify-end rounded-full bg-[#79c98c] pr-3 text-xs font-bold text-white transition-all"
						style={{ width: `${percent}%` }}
					>
						{total > 0 ? `${percent}%` : ''}
					</div>
				</div>

				<div className="mt-2 flex justify-between text-sm text-neutral-500">
					<span>0</span>
					<span>{total}</span>
				</div>
			</div>
		</div>
	);
}

export default async function VocabDetailPage({ params }: Props) {
	const { term } = await params;
	const decodedTerm = decodeURIComponent(term);

	const row = await getVocabByWord(decodedTerm);
	if (!row) return notFound();

	const examples = await getVocabExamples(row.id);

	let firstLearnedAt: Date | undefined;
	let lastReviewedAt: Date | undefined;
	let nextReviewAt: Date | undefined;
	let srsLevel = 0;
	let correctCount = 0;
	let incorrectCount = 0;

	const { userId } = await auth();

	if (userId) {
		const [srsRow] = await db
			.select({
				srsLevel: userVocabSrs.srsLevel,
				nextReviewAt: userVocabSrs.nextReviewAt,
				lastReviewedAt: userVocabSrs.lastReviewedAt,
				firstLearnedAt: userVocabSrs.firstLearnedAt,
				correctCount: userVocabSrs.correctCount,
				incorrectCount: userVocabSrs.incorrectCount
			})
			.from(userVocabSrs)
			.where(and(eq(userVocabSrs.userId, userId), eq(userVocabSrs.vocabId, row.id)))
			.limit(1);

		srsLevel = srsRow?.srsLevel ?? 0;
		nextReviewAt = (srsRow?.nextReviewAt as Date | undefined) ?? undefined;
		lastReviewedAt = (srsRow?.lastReviewedAt as Date | undefined) ?? undefined;
		firstLearnedAt = (srsRow?.firstLearnedAt as Date | undefined) ?? undefined;
		correctCount = srsRow?.correctCount ?? 0;
		incorrectCount = srsRow?.incorrectCount ?? 0;
	}

	const isRetired = srsLevel >= MAX_SRS_LEVEL;
	const reviewLabel = isRetired ? 'Retired On' : 'Next Review';
	const reviewValue = isRetired
		? formatDateTime(lastReviewedAt)
		: getRelativeReviewText(nextReviewAt);
	const reviewSubtext = isRetired
		? 'This word has completed the full SRS track.'
		: nextReviewAt
			? formatDateTime(nextReviewAt)
			: 'This word has not been scheduled yet.';

	const totalAnswered = correctCount + incorrectCount;
	const accuracyPercent =
		totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

	const ipa = (row as any).ipa as string | null | undefined;

	return (
		<main className="mx-auto w-full max-w-[900px] px-4 py-10 lg:px-0">
			<section className="rounded-[2rem] bg-[#f7fbf5] p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
					{row.imageUrl ? (
						<div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
							<Image
								src={row.imageUrl}
								alt={row.word}
								width={112}
								height={112}
								className="object-contain p-2"
							/>
						</div>
					) : null}

					<div className="min-w-0 flex-1 text-left">
						<h1 className="text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
							{row.word}
						</h1>
						<p className="mt-2 text-2xl text-neutral-700">{row.translation}</p>

						<div className="mt-5 grid gap-3 sm:grid-cols-3">
							<StatPill
								label="Part of Speech"
								value={row.partOfSpeech ?? '—'}
							/>
							<StatPill
								label="Pronunciation"
								value={row.pronunciation ?? '—'}
							/>
							<StatPill
								label="IPA"
								value={ipa ?? '—'}
							/>
						</div>
					</div>
				</div>
			</section>

			<div className="mt-10 border-t border-dashed border-black/20" />

			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Meaning</h2>

				<p className="mt-4 whitespace-pre-line text-xl leading-relaxed text-neutral-800">
					{row.meaning ?? 'No meaning has been added for this word yet.'}
				</p>

				<div className="mt-5 grid gap-4 sm:grid-cols-2">
					{row.synonyms && (
						<div className="rounded-2xl bg-[#fff9f5] p-5 shadow-sm ring-1 ring-black/5">
							<h3 className="text-lg font-semibold text-neutral-800">Synonyms</h3>
							<p className="mt-2 text-base text-neutral-700">{row.synonyms}</p>
						</div>
					)}

					{row.variants && (
						<div className="rounded-2xl bg-[#fff9f5] p-5 shadow-sm ring-1 ring-black/5">
							<h3 className="text-lg font-semibold text-neutral-800">Variants</h3>
							<p className="mt-2 text-base text-neutral-700">{row.variants}</p>
						</div>
					)}
				</div>
			</section>

			<div className="mt-10 border-t border-dashed border-black/20" />

			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Mnemonic</h2>
				<p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-neutral-800">
					{row.mnemonic ?? 'No mnemonic has been added for this word yet.'}
				</p>
			</section>

			<div className="mt-10 border-t border-dashed border-black/20" />

			<section className="mt-8">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-3xl font-semibold text-neutral-900">Reading</h2>

					{row.audioUrl ? (
						<AudioPlayButton src={row.audioUrl} label={`Play audio for ${row.word}`} />
					) : null}
				</div>

				<div className="mt-4 rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
					<p className="text-lg text-neutral-900">
						<span className="font-semibold">Typed reading:</span>{' '}
						{row.pronunciation ?? '—'}
					</p>
					<p className="mt-2 text-sm text-neutral-600">
						<span className="font-semibold">IPA:</span> {ipa ?? '—'}
					</p>
				</div>
			</section>

			<div className="mt-10 border-t border-dashed border-black/20" />

			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Example Sentences</h2>

				{examples.length ? (
					<div className="mt-4">
						<ExampleSentenceCard
							examples={examples.map((ex) => ({
								id: ex.id,
								sentence: ex.sentence,
								translation: ex.translation ?? '',
								audioUrl: ex.audioUrl ?? undefined
							}))}
						/>
					</div>
				) : (
					<p className="mt-4 text-lg text-neutral-800">
						No example sentences have been added yet.
					</p>
				)}
			</section>

			<div className="mt-10 border-t border-dashed border-black/20" />

			<section className="mt-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Current Progress</h2>

				{userId ? (
					<div className="mt-4 space-y-4">
						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
								<h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
									Current SRS
								</h3>
								<p className="mt-2 text-3xl font-extrabold text-neutral-900">
									{srsLevel}
									<span className="ml-1 text-lg font-semibold text-neutral-500">
										/ {MAX_SRS_LEVEL}
									</span>
								</p>
							</div>

							<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
								<h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
									Correct
								</h3>
								<p className="mt-2 text-3xl font-extrabold text-[#2f9e44]">
									{correctCount}
								</p>
							</div>

							<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
								<h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
									Incorrect
								</h3>
								<p className="mt-2 text-3xl font-extrabold text-[#d94841]">
									{incorrectCount}
								</p>
							</div>
						</div>

						<AccuracyBar
							label="Combined Answered Correct"
							correct={correctCount}
							incorrect={incorrectCount}
						/>

						<p>
							{totalAnswered > 0 ? (
								<span> Current accuracy: {accuracyPercent}%.</span>
							) : null}
						</p>
					</div>
				) : (
					<div className="mt-4 rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
						<p className="text-lg text-neutral-800">Sign in to track progress for this word.</p>
					</div>
				)}
			</section>

			<div className="mt-10 border-t border-dashed border-black/20" />

			<section className="mt-8 grid gap-4 sm:grid-cols-3">
				<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
					<h2 className="text-xl font-semibold text-neutral-900">{reviewLabel}</h2>
					<p className="mt-2 text-lg font-medium text-neutral-800">{reviewValue}</p>
					<p className="mt-2 text-sm text-neutral-600">{reviewSubtext}</p>
				</div>

				<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
					<h2 className="text-xl font-semibold text-neutral-900">Last Reviewed</h2>
					<p className="mt-2 text-lg font-medium text-neutral-800">
						{formatDateTime(lastReviewedAt)}
					</p>
					<p className="mt-2 text-sm text-neutral-600">
						Most recent time this card was reviewed.
					</p>
				</div>

				<div className="rounded-2xl bg-[#f0f7ee] p-5 shadow-sm ring-1 ring-black/5">
					<h2 className="text-xl font-semibold text-neutral-900">Unlocked On</h2>
					<p className="mt-2 text-lg font-medium text-neutral-800">
						{formatDate(firstLearnedAt)}
					</p>
					<p className="mt-2 text-sm text-neutral-600">
						When this word first entered your SRS progress.
					</p>
				</div>
			</section>
		</main>
	);
}