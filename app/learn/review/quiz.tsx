'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from '../header';
import { useRouter } from 'next/navigation';

type Item = {
	id: number;
	word: string;
	translation: string;
	imageUrl?: string | null;
};

type Props = {
	items: Item[];
	initialPercentage: number;
};

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

	// progress setup
	const [progress, setProgress] = useState(initialPercentage === 100 ? 0 : initialPercentage);
	const step = useMemo(() => {
		const base = initialPercentage === 100 ? 0 : initialPercentage;
		const remaining = Math.max(0, 100 - base);
		return items.length > 0 ? remaining / items.length : 0;
	}, [items.length, initialPercentage]);

	// queue for retry logic
	const [queue, setQueue] = useState<number[]>(() => items.map((_, i) => i));
	const [cursor, setCursor] = useState(0);

	// per-item state
	const [awarded, setAwarded] = useState<Record<number, boolean>>({});
	const [attempts, setAttempts] = useState<Record<number, number>>({});
	const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});

	// UI state
	const [input, setInput] = useState('');
	const [status, setStatus] = useState<Status>('none');
	const inputRef = useRef<HTMLInputElement>(null);

	// summary rows
	const [rows, setRows] = useState<ResultRow[]>([]);

	const done = cursor >= queue.length;
	const currentIndex = queue[cursor];
	const current = items[currentIndex];

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

		// record first try correctness
		setFirstTry((prev) =>
			prev[current.id] !== undefined ? prev : { ...prev, [current.id]: isCorrect }
		);

		// update summary row
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

			// only award progress once
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

		// reinsert wrong answers later in queue
		if (status === 'wrong') {
			const copy = [...queue];
			const insertPos = Math.min(cursor + 2, copy.length);
			copy.splice(insertPos, 0, currentIndex);
			setQueue(copy);
		}

		setCursor((c) => c + 1);
		setStatus('none');
		setInput('');
		inputRef.current?.focus();
	};

	// ✅ redirect logic moved to useEffect (fixes Router update during render)
	useEffect(() => {
		if (!done) return;

		const summary = {
			total: items.length,
			correct: rows.filter((r) => r.correct).length,
			firstTryCorrect: rows.filter((r) => r.firstTryCorrect).length,
			progressEnd: progress,
			rows
		};

		try {
			sessionStorage.setItem('quizSummary', JSON.stringify(summary));
		} catch (err) {
			console.error('Failed to save quiz summary:', err);
		}

		router.replace('/learn/summary'); // adjust path if needed
	}, [done, items.length, rows, progress, router]);

	if (done) {
		return (
			<>
				<Header percentage={progress} />
				<main className="flex min-h-[calc(100vh-100px)] items-center justify-center p-6">
					<p className="text-neutral-600">Finishing up...</p>
				</main>
			</>
		);
	}

	if (!current) return null;

	const atLastScreen = cursor === queue.length - 1;

	return (
		<>
			<Header percentage={progress} />

			<main className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-6 text-center">
				{/* ✅ word image */}
				{current.imageUrl ? (
					<div className="mb-4 h-28 w-28">
						<Image
							src={current.imageUrl}
							alt={current.word}
							width={112}
							height={112}
							className="h-28 w-28 rounded-xl object-contain"
							priority
						/>
					</div>
				) : null}

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
