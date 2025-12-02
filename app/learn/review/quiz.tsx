'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from './header';
import { useRouter } from 'next/navigation';
import { setSrsToOne, applyReviewSrs } from '@/app/(app)/actions/srs';

type Item = {
	id: number;
	word: string;
	translation: string;
	imageUrl?: string | null;
	srsLevel?: number;
	example?: string | null;
	exampleTranslation?: string | null;
};

type Props = {
	items: Item[];
	initialPercentage: number;
	sessionType: 'lesson' | 'review';
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
	imageUrl?: string | null;
};

// 🆕 what kind of prompt we’re showing
type PromptMode = 'esToEn' | 'imageToEs' | 'clozeEs';

export function Quiz({ items, initialPercentage, sessionType }: Props) {
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

	const total = items.length;
	const correct = rows.filter((r) => r.correct).length;
	const firstTryCorrect = rows.filter((r) => r.firstTryCorrect).length;
	const correctForLesson = sessionType === 'review' ? firstTryCorrect : correct;
	const remaining = Math.max(0, total - correct);

	const startTimeRef = useRef<number>(Date.now());

	// 🆕 decide what kind of prompt to show for the current item
	const promptMode: PromptMode = useMemo(() => {
		if (!current) return 'esToEn';

		// Lessons always Spanish -> English
		if (sessionType === 'lesson') return 'esToEn';

		const level = current.srsLevel ?? 1;

		if (level <= 1) {
			// first review → Spanish -> English
			return 'esToEn';
		}

		if (level === 2 && current.imageUrl) {
			// second stage → Image -> Spanish
			return 'imageToEs';
		}

		if (level >= 3 && current.example) {
			// later stages → Cloze sentence -> Spanish
			return 'clozeEs';
		}

		// fallback
		return 'esToEn';
	}, [current, sessionType]);

	// 🆕 build cloze sentence for SRS 3+
	const clozeSentence = useMemo(() => {
		if (!current?.example) return null;
		const re = new RegExp(`\\b${current.word}\\b`, 'gi');
		const replaced = current.example.replace(re, '____');
		return replaced;
	}, [current]);

	// 🆕 acceptable answers now depend on promptMode
	const acceptableAnswers = useMemo(() => {
		if (!current) return [];

		if (promptMode === 'esToEn') {
			// Spanish → English: accept any of the translation variants
			return current.translation
				.split(/[/;,]| or /i)
				.map((s) => normalize(s))
				.filter(Boolean);
		}

		// imageToEs or clozeEs → expect Spanish word
		return [normalize(current.word)];
	}, [current, promptMode]);

	const onCheck = () => {
		if (!current || status !== 'none') return;

		const guessRaw = input;
		const guess = normalize(guessRaw);
		const isCorrect = acceptableAnswers.includes(guess);

		setAttempts((prev) => ({
			...prev,
			[current.id]: (prev[current.id] ?? 0) + 1
		}));

		// Only record first-try for review sessions
		if (sessionType === 'review') {
			setFirstTry((prev) =>
				prev[current.id] !== undefined ? prev : { ...prev, [current.id]: isCorrect }
			);
		}

		setRows((prev) => {
			const existing = prev.find((r) => r.id === current.id);
			const filtered = prev.filter((r) => r.id !== current.id);

			const firstTryCorrectValue =
				sessionType === 'review'
					? (existing?.firstTryCorrect ?? isCorrect) // review: keep first-try truth
					: false; // lesson: ignore first-try entirely

			// 🆕 what we consider the “expected” string, to show on wrong answers
			const expected = promptMode === 'esToEn' ? current.translation : current.word;

			return [
				...filtered,
				{
					id: current.id,
					word: current.word,
					expected,
					userAnswer: guessRaw,
					correct: isCorrect,
					firstTryCorrect: firstTryCorrectValue,
					attempts: (attempts[current.id] ?? 0) + 1,
					imageUrl: current.imageUrl ?? null
				}
			];
		});

		if (isCorrect) {
			setStatus('correct');

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

	useEffect(() => {
		if (!done) return;

		const correctIds = rows.filter((r) => r.correct).map((r) => r.id);
		const upIds = rows.filter((r) => r.firstTryCorrect).map((r) => r.id);
		const downIds = rows.filter((r) => !r.firstTryCorrect).map((r) => r.id);

		const elapsedMs = Date.now() - startTimeRef.current;
		const duration = Math.round(elapsedMs / 1000);

		(async () => {
			try {
				if (sessionType === 'lesson') {
					if (correctIds.length) {
						await setSrsToOne({ vocabIds: correctIds });
					}
				} else {
					if (upIds.length || downIds.length) {
						await applyReviewSrs({ upIds, downIds });
					}
				}
			} catch (e) {
				console.error('SRS update failed', e);
			}

			const summary = {
				total,
				correct: firstTryCorrect,
				firstTryCorrect,
				progressEnd: progress,
				rows,
				duration
			};

			try {
				sessionStorage.setItem('quizSummary', JSON.stringify(summary));
			} catch (err) {
				console.error('Failed to save quiz summary:', err);
			}

			router.replace('/learn/summary');
		})();
	}, [done, rows, progress, router, sessionType]);

	if (done) {
		return (
			<>
				<Header
					percentage={progress}
					total={total}
					correct={correctForLesson}
					remaining={remaining}
				/>
				<main className="flex min-h-[calc(100vh-100px)] items-center justify-center p-6">
					<p className="text-neutral-600">Finishing up...</p>
				</main>
			</>
		);
	}

	if (!current) return null;

	const atLastScreen = cursor === queue.length - 1;

	// 🆕 Build the prompt text based on mode
	let title = '';
	let subtitle: string | null = null;

	if (promptMode === 'esToEn') {
		title = `Type the English meaning for: ${current.word}`;
		subtitle = null;
	} else if (promptMode === 'imageToEs') {
		title = 'Type this word in Spanish';
		subtitle = current.translation; // optional hint — remove if you don’t want it
	} else {
		title = 'Fill in the blank in Spanish';
		subtitle = clozeSentence ?? current.example ?? '';
	}

	// 🆕 what we display as the correct answer if user is wrong
	const correctAnswerDisplay = promptMode === 'esToEn' ? current.translation : current.word;

	return (
		<>
			<Header percentage={progress} total={total} correct={correct} remaining={remaining} />

			<main className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-6 text-center">
				{/* Image – still shown when available. Especially important for imageToEs */}
				{current.imageUrl && (
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
				)}

				<h1 className="mb-2 text-2xl font-bold text-neutral-800">{title}</h1>

				{subtitle && (
					<p className="mb-4 whitespace-pre-line text-lg text-neutral-700">{subtitle}</p>
				)}

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
							Correct answer: <span className="font-semibold">{correctAnswerDisplay}</span>
						</p>
					)}
				</div>
			</main>
		</>
	);
}
