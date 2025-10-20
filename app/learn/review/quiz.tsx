'use client';

import { useMemo, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '../header';

type Item = { id: number; word: string; translation: string };

type Props = {
	items: Item[];
	initialPercentage: number;
};

function normalize(s: string) {
	return s
		.normalize('NFD') // split accents
		.replace(/[\u0300-\u036f]/g, '') // strip accents
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ') // collapse spaces
		.replace(/[.!?'"`(),:;[\]{}]/g, ''); // drop punctuation
}

export function Quiz({ items, initialPercentage }: Props) {
	const [index, setIndex] = useState(0);
	const [input, setInput] = useState('');
	const [status, setStatus] = useState<'none' | 'correct' | 'wrong'>('none');
	const [percentage] = useState(initialPercentage === 100 ? 0 : initialPercentage);

	const current = items[index];
	const inputRef = useRef<HTMLInputElement>(null);

	const acceptableAnswers = useMemo(() => {
		// Allow multiple correct answers if author separated them by / ; or ,
		return current.translation
			.split(/[/;,]| or /i)
			.map((s) => normalize(s))
			.filter((s) => s.length > 0);
	}, [current]);

	const onSubmit = () => {
		if (status !== 'none') return;
		const guess = normalize(input);
		const isCorrect = acceptableAnswers.includes(guess);
		setStatus(isCorrect ? 'correct' : 'wrong');
	};

	const onNext = () => {
		if (index < items.length - 1) {
			setIndex((i) => i + 1);
			setInput('');
			setStatus('none');
			inputRef.current?.focus();
		} else {
			window.location.href = '/learn';
		}
	};

	if (!current) return null;

	return (
		<>
			<Header percentage={percentage} />

			<main className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-6 text-center">
				<h1 className="mb-4 text-2xl font-bold text-neutral-800">
					Type the translation for: <span className="underline">{current.word}</span>
				</h1>

				<form
					className="w-full max-w-sm"
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit();
					}}
				>
					<input
						ref={inputRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your answer"
						className={[
							'w-full rounded-xl border px-4 py-3 text-lg outline-none transition',
							status === 'correct'
								? 'border-green-500 ring-2 ring-green-200'
								: status === 'wrong'
									? 'border-red-500 ring-2 ring-red-200'
									: 'focus:ring-[var(--leaf)]/30 border-black/15 focus:border-[var(--leaf)] focus:ring-2'
						].join(' ')}
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						spellCheck={false}
					/>

					<div className="mt-3 flex items-center justify-end gap-2">
						<Button type="submit" variant="leaf" disabled={!input.trim() || status !== 'none'}>
							Check
						</Button>

						<Button
							type="button"
							variant={
								status === 'correct' ? 'mint' : status === 'wrong' ? 'destructive' : 'secondary'
							}
							onClick={onNext}
							disabled={status === 'none'}
						>
							{index === items.length - 1 ? 'Finish' : 'Next'}
						</Button>
					</div>
				</form>

				{/* Feedback row */}
				<div className="mt-3 h-6">
					{status === 'correct' && (
						<p className="text-sm font-semibold text-green-700">Nice! That’s correct.</p>
					)}
					{status === 'wrong' && (
						<p className="text-sm text-red-700">
							Correct answer: <span className="font-semibold">{current.translation}</span>
						</p>
					)}
				</div>
			</main>
		</>
	);
}
