'use client';

import { useState } from 'react';

type QuizItem = {
	id: number;
	word: string;
	translation: string;
	meaning?: string | null;
	pronunciation?: string | null;
	imageUrl?: string | null;
};

export default function Quiz({
	items,
	initialHearts = 5
}: {
	items: QuizItem[];
	initialHearts?: number;
}) {
	const [i, setI] = useState(0);
	const [hearts, setHearts] = useState(initialHearts);
	const [answer, setAnswer] = useState('');
	const [done, setDone] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);

	if (!items?.length) return <p className="p-6">No quiz items.</p>;

	const current = items[i];

	function submit() {
		const isCorrect =
			answer.trim().toLowerCase() === (current.translation ?? '').trim().toLowerCase();

		if (isCorrect) setCorrectCount((c) => c + 1);
		else setHearts((h) => Math.max(0, h - 1));

		setAnswer('');

		if (i === items.length - 1) setDone(true);
		else setI((n) => n + 1);
	}

	if (done) {
		return (
			<section className="mx-auto my-8 max-w-xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
				<h2 className="mb-2 text-2xl font-semibold">Quiz complete</h2>
				<p className="mb-4">
					Score: {correctCount} / {items.length}
				</p>
				<button onClick={() => history.back()} className="rounded-lg border px-4 py-2">
					Back
				</button>
			</section>
		);
	}

	return (
		<section className="mx-auto my-8 max-w-xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
			<header className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-semibold">Hearts: {hearts}</h2>
				<p>
					{i + 1} / {items.length}
				</p>
			</header>

			<div className="mb-4">
				<p className="text-lg text-neutral-600">Translate:</p>
				<p className="text-3xl font-semibold text-neutral-900">{current.word}</p>
			</div>

			<input
				className="mb-4 w-full rounded-lg border border-black/10 p-3"
				placeholder="Type the translation"
				value={answer}
				onChange={(e) => setAnswer(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && submit()}
			/>

			<button onClick={submit} className="rounded-lg bg-black px-4 py-2 text-white">
				Submit
			</button>
		</section>
	);
}
