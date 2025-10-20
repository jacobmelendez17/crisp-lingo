'use client';

import { useEffect, useState } from 'react';

type Row = {
	id: number;
	word: string;
	expected: string;
	userAnswer: string;
	correct: boolean;
	firstTryCorrect: boolean;
	attempts: number;
};

type Summary = {
	total: number;
	correct: number;
	firstTryCorrect: number;
	progressEnd: number;
	rows: Row[];
};

export default function SummaryPage() {
	const [summary, setSummary] = useState<Summary | null>(null);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem('quizSummary');
			if (raw) setSummary(JSON.parse(raw));
		} catch {
			// ignore
		}
	}, []);

	if (!summary) return null;

	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="mb-4 text-3xl font-bold text-neutral-800">Lesson Summary</h1>

			<section className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-black/5 bg-white p-4">
				<div>
					<p className="text-sm text-neutral-500">Total Items</p>
					<p className="text-xl font-semibold">{summary.total}</p>
				</div>
				<div>
					<p className="text-sm text-neutral-500">Correct (final)</p>
					<p className="text-xl font-semibold">{summary.correct}</p>
				</div>
				<div>
					<p className="text-sm text-neutral-500">First-try correct</p>
					<p className="text-xl font-semibold">{summary.firstTryCorrect}</p>
				</div>
				<div>
					<p className="text-sm text-neutral-500">Progress</p>
					<p className="text-xl font-semibold">{Math.round(summary.progressEnd)}%</p>
				</div>
			</section>

			<section className="rounded-xl border border-black/5 bg-white p-4">
				<h2 className="mb-3 text-xl font-semibold">Items</h2>
				<div className="divide-y">
					{summary.rows.map((r) => (
						<div key={r.id} className="py-3">
							<div className="flex items-center justify-between">
								<div className="font-semibold">{r.word}</div>
								<div className={`text-sm ${r.correct ? 'text-green-700' : 'text-red-700'}`}>
									{r.correct ? 'Correct' : 'Incorrect'}
								</div>
							</div>
							<div className="mt-1 text-sm text-neutral-600">
								<div>
									Expected: <span className="font-medium">{r.expected}</span>
								</div>
								<div>
									Your answer: <span className="font-medium">{r.userAnswer || '(blank)'}</span>
								</div>
								<div>Attempts: {r.attempts}</div>
								<div>First try correct: {r.firstTryCorrect ? 'Yes' : 'No'}</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
