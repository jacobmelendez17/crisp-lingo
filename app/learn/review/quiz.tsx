'use client';

import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '../header';
import { useRouter } from 'next/navigation';

type Item = { id: number; word: string; translation: string };

type Props = {
	items: Item[];
	initialPercentage: number;
};

// normalize helper stays the same
function normalize(s: string) {
	return s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ')
		.replace(/[.!?'"`(),:;[\]{}]/g, '');
}

type Status = 'none' | 'correct' | 'wrong';

// for summary
type ResultRow = {
	id: number;
	word: string;
	expected: string;
	userAnswer: string;
	correct: boolean;
	firstTryCorrect: boolean;
	attempts: number;
};

export function Quiz({ items, initialPercentage }: Props) {
	const router = useRouter();

	// ----- progress math (award once per item) -----
	const [progress, setProgress] = useState(initialPercentage === 100 ? 0 : initialPercentage);
	const step = useMemo(() => {
		const base = initialPercentage === 100 ? 0 : initialPercentage;
		const remaining = Math.max(0, 100 - base);
		// step = remaining / unique items
		return items.length > 0 ? remaining / items.length : 0;
	}, [items.length, initialPercentage]);

	// ----- quiz queue (retries on wrong) -----
	// queue holds indexes into "items"
	const [queue, setQueue] = useState<number[]>(() => items.map((_, i) => i));
	const [cursor, setCursor] = useState(0); // current position in queue

	// per-item state
	const [awarded, setAwarded] = useState<Record<number, boolean>>({}); // progress awarded per item
	const [attempts, setAttempts] = useState<Record<number, number>>({}); // attempts per item
	const [firstTry, setFirstTry] = useState<Record<number, boolean>>({}); // first try correctness per item

	// UI state
	const [input, setInput] = useState('');
	const [status, setStatus] = useState<Status>('none');
	const inputRef = useRef<HTMLInputElement>(null);

	// summary rows
	const [rows, setRows] = useState<ResultRow[]>([]);

	const done = cursor >= queue.length;
	const currentIndex = queue[cursor];
	const current = items[currentIndex];

	// acceptable answers for current item
	const acceptableAnswers = useMemo(() => {
		if (!current) return [];
		return current.translation
			.split(/[/;,]| or /i)
			.map((s) => normalize(s))
			.filter(Boolean);
	}, [current]);

	const onCheck = () => {
		if (!current || status !== 'none') return;

		const guessRaw = input;
		const guess = normalize(guessRaw);
		const isCorrect = acceptableAnswers.includes(guess);

		// update attempts
		setAttempts((prev) => ({
			...prev,
			[current.id]: (prev[current.id] ?? 0) + 1
		}));

		// set first-try correctness if not set
		setFirstTry((prev) =>
			prev[current.id] !== undefined ? prev : { ...prev, [current.id]: isCorrect }
		);

		// push a row for this attempt (we’ll keep the last attempt result per item in summary)
		setRows((prev) => {
			const filtered = prev.filter((r) => r.id !== current.id);
			return [
				...filtered,
				{
					id: current.id,
					word: current.word,
					expected: current.translation,
					userAnswer: guessRaw,
					correct: isCorrect,
					firstTryCorrect: prev.find((r) => r.id === current.id)?.firstTryCorrect ?? isCorrect,
					attempts: (attempts[current.id] ?? 0) + 1
				}
			];
		});

		if (isCorrect) {
			setStatus('correct');

			// only award progress once per item (first time they get it correct)
			if (!awarded[current.id]) {
				setProgress((p) => Math.min(100, p + step));
				setAwarded((prev) => ({ ...prev, [current.id]: true }));
			}
		} else {
			setStatus('wrong');
		}
	};

	const goNext = () => {
		if (!current) return;

		// on wrong: reinsert the same index a little later in the queue
		if (status === 'wrong') {
			const copy = [...queue];
			// insert 2 positions ahead (or at end) to space it out slightly
			const insertPos = Math.min(cursor + 2, copy.length);
			copy.splice(insertPos, 0, currentIndex);
			setQueue(copy);
		}

		// advance
		setCursor((c) => c + 1);
		setStatus('none');
		setInput('');
		inputRef.current?.focus();
	};

	// when finished: persist summary + navigate
	if (done) {
		// keep the *last known state* for each id (already ensured above)
		const summary = {
			total: items.length,
			correct: rows.filter((r) => r.correct).length,
			firstTryCorrect: rows.filter((r) => r.firstTryCorrect).length,
			progressEnd: progress,
			rows
		};
		// session storage so we don’t need server changes
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('quizSummary', JSON.stringify(summary));
		}
		// go to summary page
		router.replace('/learn/summary');
		return null;
	}

	if (!current) return null;

	const atLastScreen = cursor === queue.length - 1;

	return (
		<>
			<Header percentage={progress} />

			<main className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-6 text-center">
				<h1 className="mb-4 text-2xl font-bold text-neutral-800">
					Type the translation for: <span className="underline">{current.word}</span>
				</h1>

				<form
					className="w-full max-w-sm"
					onSubmit={(e) => {
						e.preventDefault();
						if (status === 'none') onCheck();
						else goNext();
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
						{status === 'none' ? (
							<Button type="submit" variant="leaf" disabled={!input.trim()}>
								Check
							</Button>
						) : (
							<Button
								type="button"
								variant={status === 'correct' ? 'mint' : 'destructive'}
								onClick={goNext}
							>
								{atLastScreen ? 'Finish' : 'Next'}
							</Button>
						)}
					</div>
				</form>

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
