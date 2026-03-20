'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, RotateCcw, Volume2, ArrowLeft, Shuffle } from 'lucide-react';

type PromptType = 'english' | 'audio';

type BuilderSentence = {
	id: number;
	spanish: string;
	english: string;
	promptType: PromptType;
	parts: string[];
};

const SENTENCES: BuilderSentence[] = [
	{
		id: 1,
		spanish: 'La niña lee un libro.',
		english: 'The girl reads a book.',
		promptType: 'english',
		parts: ['La niña', 'lee', 'un libro']
	},
	{
		id: 2,
		spanish: 'El hombre está en la casa.',
		english: 'The man is in the house.',
		promptType: 'english',
		parts: ['El hombre', 'está', 'en la casa']
	},
	{
		id: 3,
		spanish: 'Nosotros comemos en la mesa.',
		english: 'We eat at the table.',
		promptType: 'audio',
		parts: ['Nosotros', 'comemos', 'en la mesa']
	},
	{
		id: 4,
		spanish: 'La silla está junto a la mesa.',
		english: 'The chair is next to the table.',
		promptType: 'english',
		parts: ['La silla', 'está', 'junto a la mesa']
	}
];

function shuffleArray<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function normalize(text: string) {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[.,!?;:]/g, '')
		.replace(/\s+/g, ' ');
}

function getInitialBank(parts: string[]) {
	return shuffleArray(
		parts.map((text, index) => ({
			id: `${text}-${index}`,
			text
		}))
	);
}

type WordChip = {
	id: string;
	text: string;
};

export default function SentenceBuilderPage() {
	const [index, setIndex] = useState(0);
	const [assembled, setAssembled] = useState<WordChip[]>([]);
	const [bank, setBank] = useState<WordChip[]>(() => getInitialBank(SENTENCES[0].parts));
	const [hasChecked, setHasChecked] = useState(false);

	const current = SENTENCES[index];

	const builtSentence = useMemo(
		() => assembled.map((item) => item.text).join(' '),
		[assembled]
	);

	const isCorrect =
		hasChecked && normalize(builtSentence) === normalize(current.spanish);

	function moveToAnswer(chip: WordChip) {
		setBank((prev) => prev.filter((item) => item.id !== chip.id));
		setAssembled((prev) => [...prev, chip]);
		setHasChecked(false);
	}

	function moveBackToBank(chip: WordChip) {
		setAssembled((prev) => prev.filter((item) => item.id !== chip.id));
		setBank((prev) => [...prev, chip]);
		setHasChecked(false);
	}

	function resetRound() {
		setAssembled([]);
		setBank(getInitialBank(current.parts));
		setHasChecked(false);
	}

	function checkAnswer() {
		setHasChecked(true);
	}

	function handleNext() {
		const nextIndex = (index + 1) % SENTENCES.length;
		setIndex(nextIndex);
		setAssembled([]);
		setBank(getInitialBank(SENTENCES[nextIndex].parts));
		setHasChecked(false);
	}

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#f6fbf7]">
			<div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
				<div className="mb-6 flex items-center justify-between gap-4">
					<Button asChild variant="outline" size="sm">
						<Link href="/practice/sentences">
							<ArrowLeft className="mr-2 size-4" />
							Back
						</Link>
					</Button>

					<div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
						{index + 1} / {SENTENCES.length}
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
						<p className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-500">
							Sentence Builder
						</p>

						<h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
							Build the Spanish sentence
						</h1>

						<p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
							Choose the blocks in the correct order to form the sentence.
						</p>

						<div className="mt-8 rounded-[1.5rem] bg-[#f8fbf8] p-5">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
								Prompt
							</p>

							{current.promptType === 'english' ? (
								<p className="mt-3 text-xl font-semibold text-neutral-900 md:text-2xl">
									{current.english}
								</p>
							) : (
								<div className="mt-3 flex items-center gap-3">
									<div className="grid size-12 place-items-center rounded-2xl bg-white shadow-sm">
										<Volume2 className="size-5 text-neutral-700" />
									</div>
									<div>
										<p className="text-lg font-semibold text-neutral-900">
											Spanish audio prompt
										</p>
										<p className="text-sm text-neutral-500">
											Wire this to your audio player next.
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="mt-6">
							<div className="mb-3 flex items-center justify-between">
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
									Your answer
								</p>

								{assembled.length > 0 && (
									<button
										type="button"
										onClick={resetRound}
										className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 transition hover:text-neutral-800"
									>
										<RotateCcw className="size-4" />
										Reset
									</button>
								)}
							</div>

							<div
								className={cn(
									'min-h-[140px] rounded-[1.5rem] border-2 border-dashed p-4 transition',
									hasChecked
										? isCorrect
											? 'border-emerald-300 bg-emerald-50'
											: 'border-rose-300 bg-rose-50'
										: 'border-black/10 bg-white'
								)}
							>
								{assembled.length === 0 ? (
									<div className="flex min-h-[108px] items-center justify-center text-center text-sm text-neutral-400">
										Tap word blocks below to build the sentence.
									</div>
								) : (
									<div className="flex flex-wrap gap-3">
										{assembled.map((chip) => (
											<button
												key={chip.id}
												type="button"
												onClick={() => moveBackToBank(chip)}
												className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
											>
												{chip.text}
											</button>
										))}
									</div>
								)}
							</div>

							<div className="mt-4 min-h-[28px]">
								{hasChecked ? (
									isCorrect ? (
										<p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
											<CheckCircle2 className="size-4" />
											Correct — nice work.
										</p>
									) : (
										<div className="space-y-1 text-sm">
											<p className="font-semibold text-rose-700">
												Not quite. Try rearranging the blocks.
											</p>
											<p className="text-neutral-500">
												Expected: {current.spanish}
											</p>
										</div>
									)
								) : (
									<p className="text-sm text-neutral-500">
										Tap a block in your answer area to remove it.
									</p>
								)}
							</div>
						</div>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button
								type="button"
								variant="outline"
								size="lg"
								onClick={checkAnswer}
								disabled={assembled.length !== current.parts.length}
								className="min-w-[170px]"
							>
								Check answer
							</Button>

							<Button
								type="button"
								size="lg"
								onClick={handleNext}
								className="min-w-[170px]"
							>
								Next sentence
							</Button>
						</div>
					</section>

					<aside className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
						<div className="inline-flex rounded-2xl bg-amber-50 p-3 text-amber-700">
							<Shuffle className="size-6" />
						</div>

						<h2 className="mt-4 text-2xl font-semibold text-neutral-900">
							Available blocks
						</h2>

						<p className="mt-2 text-sm leading-6 text-neutral-600">
							Tap blocks to send them into the answer area in order.
						</p>

						<div className="mt-6 flex flex-wrap gap-3">
							{bank.map((chip) => (
								<button
									key={chip.id}
									type="button"
									onClick={() => moveToAnswer(chip)}
									className="rounded-2xl border border-black/5 bg-[#f8faf8] px-4 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#eef6f0]"
								>
									{chip.text}
								</button>
							))}
						</div>

						{bank.length === 0 && (
							<div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
								All blocks used. Check your answer when ready.
							</div>
						)}

						<div className="mt-8 rounded-[1.5rem] bg-[#f8fbf8] p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
								Reference meaning
							</p>
							<p className="mt-2 text-sm text-neutral-700">{current.english}</p>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}