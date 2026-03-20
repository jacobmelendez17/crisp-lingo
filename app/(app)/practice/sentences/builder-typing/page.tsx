'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BuilderSentence = {
	id: number;
	spanish: string;
	english: string;
};

const SENTENCES: BuilderSentence[] = [
	{
		id: 1,
		spanish: 'La niña lee un libro.',
		english: 'The girl reads a book.'
	},
	{
		id: 2,
		spanish: 'El hombre está en la casa.',
		english: 'The man is in the house.'
	},
	{
		id: 3,
		spanish: 'Nosotros comemos en la mesa.',
		english: 'We eat at the table.'
	}
];

function normalize(text: string) {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[.,!?;:]/g, '')
		.replace(/\s+/g, ' ');
}

export default function SentenceBuilderTypingPage() {
	const [index, setIndex] = useState(0);
	const [value, setValue] = useState('');
	const [checked, setChecked] = useState(false);

	const current = SENTENCES[index];

	const isCorrect = useMemo(() => {
		return checked && normalize(value) === normalize(current.spanish);
	}, [checked, value, current]);

	function handleCheck() {
		setChecked(true);
	}

	function handleNext() {
		const nextIndex = (index + 1) % SENTENCES.length;
		setIndex(nextIndex);
		setValue('');
		setChecked(false);
	}

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#f6fbf7]">
	<div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-10 text-center">
		{/* Top */}
		<div className="mb-10 flex w-full items-center justify-between">
			<Button asChild variant="outline" size="sm">
				<Link href="/practice/sentences">Back</Link>
			</Button>

			<div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
				{index + 1} / {SENTENCES.length}
			</div>
		</div>

		<p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
			Type the sentence
		</p>

		<h1 className="mt-4 text-3xl font-semibold text-neutral-900 md:text-4xl">
			{current.english}
		</h1>

		{/* Input */}
		<input
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
				setChecked(false);
			}}
			placeholder="Type the sentence..."
			className="mt-12 w-full border-b-2 border-neutral-300 bg-transparent px-2 py-4 text-center text-xl outline-none transition focus:border-neutral-600"
		/>

		{/* Feedback */}
		<div className="mt-6 min-h-[28px]">
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
					Type the full Spanish sentence.
				</p>
			)}
		</div>

		{/* Actions */}
		<div className="mt-10 flex gap-3">
			<Button
				variant="outline"
				onClick={handleCheck}
				disabled={!value.trim()}
			>
				Check
			</Button>

			<Button onClick={handleNext}>Next</Button>
		</div>
	</div>
</main>
	);
}