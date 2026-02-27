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

// what kind of prompt we’re showing
type PromptMode = 'esToEn' | 'enToEs' | 'imageToEs' | 'clozeEs';

type Prompt = {
	key: string; // unique per prompt (vocabId + mode)
	itemIndex: number;
	mode: PromptMode;
};

type ResultRow = {
	promptKey: string;
	vocabId: number;
	mode: PromptMode;
	word: string;
	expected: string;
	userAnswer: string;
	correct: boolean;
	firstTryCorrect: boolean;
	attempts: number;
	imageUrl?: string | null;
};

export function Quiz({ items, initialPercentage, sessionType }: Props) {
	const router = useRouter();

	// Build 2 prompts per vocab item:
	//  1) Spanish -> English (type English)
	//  2) Spanish production (type Spanish) -> enToEs/imageToEs/clozeEs
	const prompts: Prompt[] = useMemo(() => {
		const out: Prompt[] = [];

		for (let i = 0; i < items.length; i++) {
			const it = items[i];

			// Prompt 1: always Spanish -> English
			out.push({
				key: `${it.id}:esToEn`,
				itemIndex: i,
				mode: 'esToEn'
			});

			// Prompt 2: Spanish production
			let second: PromptMode = 'enToEs';

			if (sessionType === 'review') {
				const level = it.srsLevel ?? 1;
				if (level === 2 && it.imageUrl) second = 'imageToEs';
				else if (level >= 3 && it.example) second = 'clozeEs';
				else second = 'enToEs';
			} else {
				// lesson: always require typing Spanish too
				second = 'enToEs';
			}

			out.push({
				key: `${it.id}:${second}`,
				itemIndex: i,
				mode: second
			});
		}

		return out;
	}, [items, sessionType]);

	// progress setup (now based on number of prompts, not number of items)
	const [progress, setProgress] = useState(initialPercentage === 100 ? 0 : initialPercentage);
	const total = prompts.length;

	const step = useMemo(() => {
		const base = initialPercentage === 100 ? 0 : initialPercentage;
		const remaining = Math.max(0, 100 - base);
		return total > 0 ? remaining / total : 0;
	}, [total, initialPercentage]);

	// queue for retry logic (now prompt indices)
	const [queue, setQueue] = useState<number[]>(() => prompts.map((_, i) => i));
	const [cursor, setCursor] = useState(0);

	// per-prompt state (keyed by prompt key, not vocab id)
	const [awarded, setAwarded] = useState<Record<string, boolean>>({});
	const [attempts, setAttempts] = useState<Record<string, number>>({});
	const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});

	// UI state
	const [input, setInput] = useState('');
	const [status, setStatus] = useState<Status>('none');
	const inputRef = useRef<HTMLInputElement>(null);

	// summary rows (one per prompt)
	const [rows, setRows] = useState<ResultRow[]>([]);

	// Reset state when prompts change (new session / new items)
	useEffect(() => {
		setQueue(prompts.map((_, i) => i));
		setCursor(0);
		setAwarded({});
		setAttempts({});
		setFirstTry({});
		setRows([]);
		setInput('');
		setStatus('none');
		setProgress(initialPercentage === 100 ? 0 : initialPercentage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prompts.length]);

	const done = cursor >= queue.length;

	const currentPromptIndex = queue[cursor];
	const currentPrompt = prompts[currentPromptIndex];

	const currentIndex = currentPrompt?.itemIndex;
	const current = currentIndex !== undefined ? items[currentIndex] : undefined;

	const correct = rows.filter((r) => r.correct).length;
	const firstTryCorrectCount = rows.filter((r) => r.firstTryCorrect).length;

	// This is what the header shows as "correct"
	const correctForHeader = sessionType === 'review' ? firstTryCorrectCount : correct;

	const remaining = Math.max(0, total - correct);

	const startTimeRef = useRef<number>(Date.now());

	const promptMode: PromptMode = currentPrompt?.mode ?? 'esToEn';

	// Build cloze sentence for clozeEs
	const clozeSentence = useMemo(() => {
		if (!current?.example) return null;
		const re = new RegExp(`\\b${current.word}\\b`, 'gi');
		return current.example.replace(re, '____');
	}, [current]);

	// Acceptable answers depend on promptMode
	const acceptableAnswers = useMemo(() => {
		if (!current) return [];

		if (promptMode === 'esToEn') {
			// Spanish -> English: accept any translation variants
			return current.translation
				.split(/[/;,]| or /i)
				.map((s) => normalize(s))
				.filter(Boolean);
		}

		// enToEs / imageToEs / clozeEs expect the Spanish word
		return [normalize(current.word)];
	}, [current, promptMode]);

	const onCheck = () => {
		if (!current || !currentPrompt || status !== 'none') return;

		const guessRaw = input;
		const guess = normalize(guessRaw);
		const isCorrect = acceptableAnswers.includes(guess);

		const k = currentPrompt.key;

		setAttempts((prev) => ({
			...prev,
			[k]: (prev[k] ?? 0) + 1
		}));

		// record first try per prompt
		setFirstTry((prev) => (prev[k] !== undefined ? prev : { ...prev, [k]: isCorrect }));

		setRows((prev) => {
			const existing = prev.find((r) => r.promptKey === k);
			const filtered = prev.filter((r) => r.promptKey !== k);

			const firstTryCorrectValue = existing?.firstTryCorrect ?? isCorrect;

			const expected = promptMode === 'esToEn' ? current.translation : current.word;

			return [
				...filtered,
				{
					promptKey: k,
					vocabId: current.id,
					mode: promptMode,
					word: current.word,
					expected,
					userAnswer: guessRaw,
					correct: isCorrect,
					firstTryCorrect: firstTryCorrectValue,
					attempts: (attempts[k] ?? 0) + 1,
					imageUrl: current.imageUrl ?? null
				}
			];
		});

		if (isCorrect) {
			setStatus('correct');

			if (!awarded[k]) {
				setProgress((p) => Math.min(100, p + step));
				setAwarded((prev) => ({ ...prev, [k]: true }));
			}
		} else {
			setStatus('wrong');
		}
	};

	const goNext = () => {
		if (!current || !currentPrompt) return;

		// reinsert wrong prompts later in queue
		if (status === 'wrong') {
			const copy = [...queue];
			const insertPos = Math.min(cursor + 2, copy.length);
			copy.splice(insertPos, 0, currentPromptIndex);
			setQueue(copy);
		}

		setCursor((c) => c + 1);
		setStatus('none');
		setInput('');
		inputRef.current?.focus();
	};

	useEffect(() => {
		if (!done) return;

		// group prompt results by vocabId
		const byVocab = new Map<number, ResultRow[]>();
		for (const r of rows) {
			const arr = byVocab.get(r.vocabId) ?? [];
			arr.push(r);
			byVocab.set(r.vocabId, arr);
		}

		// A vocab is "passed" only if both prompts ended correct
		const passedVocabIds: number[] = [];

		// In review: move up only if both prompts were first-try correct
		const upIds: number[] = [];
		const downIds: number[] = [];

		for (const it of items) {
			const rs = byVocab.get(it.id) ?? [];
			const allCorrect = rs.length >= 2 && rs.every((x) => x.correct);
			const allFirstTry = rs.length >= 2 && rs.every((x) => x.firstTryCorrect);

			if (allCorrect) passedVocabIds.push(it.id);

			if (sessionType === 'review') {
				if (allFirstTry) upIds.push(it.id);
				else downIds.push(it.id);
			}
		}

		const elapsedMs = Date.now() - startTimeRef.current;
		const duration = Math.round(elapsedMs / 1000);

		(async () => {
			try {
				if (sessionType === 'lesson') {
					if (passedVocabIds.length) {
						await setSrsToOne({ vocabIds: passedVocabIds });
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
				total, // prompts.length
				correct: firstTryCorrectCount,
				firstTryCorrect: firstTryCorrectCount,
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
	}, [done, rows, progress, router, sessionType, items, total, firstTryCorrectCount]);

	if (done) {
		return (
			<>
				<Header
					percentage={progress}
					total={total}
					correct={correctForHeader}
					remaining={remaining}
				/>
				<main className="flex min-h-[calc(100vh-100px)] items-center justify-center p-6">
					<p className="text-neutral-600">Finishing up...</p>
				</main>
			</>
		);
	}

	if (!current || !currentPrompt) return null;

	const atLastScreen = cursor === queue.length - 1;

	// Build the prompt text based on mode
	let title = '';
	let subtitle: string | null = null;

	if (promptMode === 'esToEn') {
		title = `Type the English meaning for: ${current.word}`;
		subtitle = null;
	} else if (promptMode === 'enToEs') {
		title = `Type the Spanish word for: ${current.translation}`;
		subtitle = null;
	} else if (promptMode === 'imageToEs') {
		title = 'Type this word in Spanish';
		subtitle = current.translation; // optional hint — remove if you don’t want it
	} else {
		title = 'Fill in the blank in Spanish';
		subtitle = clozeSentence ?? current.example ?? '';
	}

	// what we display as the correct answer if user is wrong
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