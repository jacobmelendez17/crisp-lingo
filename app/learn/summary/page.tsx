'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ItemChip } from './item-chip';

type Row = {
	id: number;
	word: string;
	expected: string;
	userAnswer: string;
	correct: boolean;
	firstTryCorrect: boolean;
	attempts: number;
	imageUrl?: string | null;
};

type Summary = {
	total: number;
	correct: number;
	firstTryCorrect: number;
	progressEnd: number;
	rows: Row[];
	duration?: number;
};

const MAX_VISIBLE_ICONS = 24;

function SessionProgressChart({ rows }: { rows: Row[] }) {
	if (!rows.length) return null;

	// cumulative accuracy over the session
	const values: number[] = [];
	let runningCorrect = 0;
	rows.forEach((r, idx) => {
		if (r.correct) runningCorrect++;
		values.push(runningCorrect / (idx + 1)); // 0–1
	});

	const points = values.map((v, idx) => {
		const x = values.length === 1 ? 0 : (idx / (values.length - 1)) * 100; // 0–100
		const y = 40 - v * 40; // 0–40, invert so higher accuracy is higher on chart
		return `${x},${y}`;
	});

	return (
		<div className="mt-4 rounded-xl border border-black/5 bg-white px-4 pb-4 pt-3">
			<div className="mb-2 flex items-center justify-between">
				<h2 className="text-sm font-semibold text-neutral-800">Session progress</h2>
				<span className="text-xs text-neutral-500">Accuracy over this quiz</span>
			</div>
			<svg
				viewBox="0 0 100 40"
				className="h-20 w-full text-[var(--leaf,#6c9c6a)]"
				preserveAspectRatio="none"
			>
				{/* baseline */}
				<line x1={0} y1={40} x2={100} y2={40} className="stroke-neutral-200" strokeWidth={0.8} />
				{/* line */}
				<polyline
					points={points.join(' ')}
					className="stroke-current"
					strokeWidth={2}
					fill="none"
				/>
			</svg>
		</div>
	);
}

export default function SummaryPage() {
	const [summary, setSummary] = useState<Summary | null>(null);
	const [showAllCorrect, setShowAllCorrect] = useState(false);
	const [showAllWrong, setShowAllWrong] = useState(false);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem('quizSummary');
			if (raw) setSummary(JSON.parse(raw));
		} catch {
			// ignore
		}
	}, []);

	const computed = useMemo(() => {
		if (!summary) return null;

		const correctRows = summary.rows.filter((r) => r.correct);
		const wrongRows = summary.rows.filter((r) => !r.correct);

		const accuracy = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;

		return { correctRows, wrongRows, accuracy };
	}, [summary]);

	if (!summary || !computed) return null;

	const { correctRows, wrongRows, accuracy } = computed;

	const visibleCorrect = showAllCorrect ? correctRows : correctRows.slice(0, MAX_VISIBLE_ICONS);
	const visibleWrong = showAllWrong ? wrongRows : wrongRows.slice(0, MAX_VISIBLE_ICONS);

	return (
		<>
			{/* main content with extra bottom padding so footer doesn’t cover it */}
			<main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-4xl flex-col px-6 pb-32 pt-8">
				{/* Header */}
				<header className="mb-4">
					<h1 className="flex items-center gap-2 text-5xl font-bold text-neutral-900">
						Session complete <span>🎉</span>
					</h1>
					<p className="mt-2 text-xl text-neutral-600">
						{accuracy}% correct, {summary.total} answered.
					</p>
				</header>

				{/* Correct / first-try stats */}
				<section className="mb-6 grid grid-cols-3 gap-3 rounded-xl border border-black/5 bg-white p-4 text-sm">
					<div>
						<p className="text-2xl text-neutral-500">Total Items</p>
						<p className="text-2xl font-semibold text-neutral-900">{summary.total}</p>
					</div>
					<div>
						<p className="text-2xl text-neutral-500">Accuracy</p>
						<p className="text-2xl font-semibold text-neutral-900">
							{Math.round((summary.correct / summary.total) * 100)}%
						</p>
					</div>
					<div>
						<p className="text-2xl text-neutral-500">Duration</p>
						<p className="text-2xl font-semibold text-neutral-900">
							{summary.duration
								? `${Math.floor(summary.duration / 60)}m ${summary.duration % 60}s`
								: '—'}
						</p>
					</div>
				</section>

				{/* Correct answers */}
				<section className="mb-5">
					<div className="mb-2 flex items-center gap-2">
						<h2 className="text-3xl font-semibold text-neutral-900">Correct answers</h2>
						<span className="rounded-full bg-[#5ec3c6]/20 px-2.5 py-0.5 text-xs font-semibold text-[#116e72]">
							{correctRows.length}
						</span>
					</div>
					{correctRows.length === 0 ? (
						<p className="text-xl text-neutral-500">
							Umm...you didn't get any of them right. Like at all.
						</p>
					) : (
						<>
							<div className="flex flex-wrap gap-2">
								{visibleCorrect.map((r) => (
									<ItemChip key={r.id} word={r.word} imageUrl={r.imageUrl} tooltip={r.word} />
								))}
							</div>
							{correctRows.length > MAX_VISIBLE_ICONS && (
								<button
									type="button"
									onClick={() => setShowAllCorrect((v) => !v)}
									className="mt-2 text-sm font-medium text-[var(--leaf,#6c9c6a)] underline-offset-2 hover:underline"
								>
									{showAllCorrect ? 'Show fewer correct answers' : 'Show more correct answers'}
								</button>
							)}
						</>
					)}
				</section>

				{/* Wrong answers */}
				<section className="mb-4">
					<div className="mb-2 flex items-center gap-2">
						<h2 className="text-3xl font-semibold text-neutral-900">Wrong answers</h2>
						<span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
							{wrongRows.length}
						</span>
					</div>
					{wrongRows.length === 0 ? (
						<p className="text-xl text-neutral-500">Nice! No misses this time.</p>
					) : (
						<>
							<div className="flex flex-wrap gap-2">
								{visibleWrong.map((r) => (
									<ItemChip key={r.id} word={r.word} imageUrl={r.imageUrl} tooltip={r.word} />
								))}
							</div>
							{wrongRows.length > MAX_VISIBLE_ICONS && (
								<button
									type="button"
									onClick={() => setShowAllWrong((v) => !v)}
									className="mt-2 text-sm font-medium text-[var(--leaf,#6c9c6a)] underline-offset-2 hover:underline"
								>
									{showAllWrong ? 'Show fewer wrong answers' : 'Show more wrong answers'}
								</button>
							)}
						</>
					)}
				</section>

				{/* Line chart */}
				<SessionProgressChart rows={summary.rows} />
			</main>

			<div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-[#fffdf7]/90 backdrop-blur-xl">
				<div className="mx-auto flex max-w-4xl items-center justify-center gap-6 px-6 py-12">
					<Button asChild variant="sage" size="lg" className="px-10 py-8 text-lg font-semibold">
						<a href="/dashboard">Back to Dashboard</a>
					</Button>
					<Button asChild variant="outline" size="lg" className="px-10 py-8 text-lg font-semibold">
						<a href="/dashboard">Review Incorrect</a>
					</Button>
				</div>
			</div>
		</>
	);
}
