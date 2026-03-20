'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BuilderSentence = {
	id: number;
	spanish: string;
	english: string;
	parts: string[];
};

type Chip = {
	id: string;
	text: string;
};

const SENTENCES: BuilderSentence[] = [
	{
		id: 1,
		spanish: 'La niña lee un libro.',
		english: 'The girl reads a book.',
		parts: ['La niña', 'lee', 'un libro']
	},
	{
		id: 2,
		spanish: 'El hombre está en la casa.',
		english: 'The man is in the house.',
		parts: ['El hombre', 'está', 'en la casa']
	},
	{
		id: 3,
		spanish: 'Nosotros comemos en la mesa.',
		english: 'We eat at the table.',
		parts: ['Nosotros', 'comemos', 'en la mesa']
	},
	{
		id: 4,
		spanish: 'La silla está junto a la mesa.',
		english: 'The chair is next to the table.',
		parts: ['La silla', 'está', 'junto a la mesa']
	}
];

function shuffleArray<T>(items: T[]) {
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

function buildInitialBank(parts: string[]): Chip[] {
	return shuffleArray(
		parts.map((text, index) => ({
			id: `${text}-${index}`,
			text
		}))
	);
}

export default function SentenceBuilderPage() {
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState<Chip[]>([]);
	const [checked, setChecked] = useState(false);
	const [bank, setBank] = useState<Chip[]>(() =>
		buildInitialBank(SENTENCES[0].parts)
	);

	const current = SENTENCES[index];

	const builtSentence = useMemo(
		() => selected.map((chip) => chip.text).join(' '),
		[selected]
	);

	const isCorrect =
		checked && normalize(builtSentence) === normalize(current.spanish);

	function addChip(chip: Chip) {
		setBank((prev) => prev.filter((item) => item.id !== chip.id));
		setSelected((prev) => [...prev, chip]);
		setChecked(false);
	}

	function removeChip(chip: Chip) {
		setSelected((prev) => prev.filter((item) => item.id !== chip.id));
		setBank((prev) => [...prev, chip]);
		setChecked(false);
	}

	function resetRound() {
		setSelected([]);
		setBank(buildInitialBank(current.parts));
		setChecked(false);
	}

	function checkAnswer() {
		setChecked(true);
	}

	function nextSentence() {
		const nextIndex = (index + 1) % SENTENCES.length;
		setIndex(nextIndex);
		setSelected([]);
		setBank(buildInitialBank(SENTENCES[nextIndex].parts));
		setChecked(false);
	}

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#f6fbf7]">
	<div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10">
		{/* Top bar */}
		<div className="mb-10 flex w-full items-center justify-between">
			<Button asChild variant="outline" size="sm">
				<Link href="/practice/sentences">Back</Link>
			</Button>

			<div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
				{index + 1} / {SENTENCES.length}
			</div>
		</div>

		{/* Prompt */}
		<p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
			Build the sentence
		</p>

		<h1 className="mt-4 text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
			{current.english}
		</h1>

		{/* Answer line */}
		<div className="mt-12 w-full border-b-2 border-neutral-300 pb-4">
			<div className="flex min-h-[60px] flex-wrap justify-center gap-3">
				{selected.map((chip) => (
					<button
						key={chip.id}
						onClick={() => removeChip(chip)}
						className="rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white"
					>
						{chip.text}
					</button>
				))}
			</div>
		</div>

		{/* Feedback */}
		<div className="mt-6 min-h-[28px] text-center">
			{checked ? (
				isCorrect ? (
					<p className="text-sm font-semibold text-emerald-700">
						Correct — nice work.
					</p>
				) : (
					<p className="text-sm font-medium text-rose-700">
						Not quite. Try again.
					</p>
				)
			) : (
				<p className="text-sm text-neutral-500">
					Tap blocks to build your answer.
				</p>
			)}
		</div>

		{/* Word bank (ONLY card) */}
		<div className="mt-10 w-full rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
			<div className="flex flex-wrap justify-center gap-3">
				{bank.map((chip) => (
					<button
						key={chip.id}
						onClick={() => addChip(chip)}
						className="rounded-2xl bg-[#f7faf8] px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:-translate-y-0.5"
					>
						{chip.text}
					</button>
				))}
			</div>
		</div>

		{/* Actions */}
		<div className="mt-10 flex flex-wrap justify-center gap-3">
			<Button variant="outline" onClick={resetRound}>
				Reset
			</Button>

			<Button
				variant="outline"
				onClick={checkAnswer}
				disabled={selected.length !== current.parts.length}
			>
				Check
			</Button>

			<Button onClick={nextSentence}>Next</Button>
		</div>
	</div>
</main>
	);
}