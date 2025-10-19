// app/learn/lesson/quiz/quiz.tsx
'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type Item = { id: number; word: string; translation: string };
type Props = { items: Item[] };

function shuffle<T>(arr: T[]) {
	return [...arr].sort(() => Math.random() - 0.5);
}

export function Quiz({ items }: Props) {
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState<number | null>(null);
	const [status, setStatus] = useState<'none' | 'correct' | 'wrong'>('none');

	const current = items[index];

	const options = useMemo(() => {
		const pool = shuffle(items).filter((it) => it.id !== current.id);
		const distractors = pool.slice(0, Math.min(3, pool.length));
		const raw = shuffle([
			{ id: current.id, label: current.translation, correct: true },
			...distractors.map((d) => ({ id: d.id, label: d.translation, correct: false }))
		]);
		return raw;
	}, [items, current]);

	const onChoose = (optId: number) => {
		if (status !== 'none') return;
		setSelected(optId);
		const correct = options.find((o) => o.correct)?.id === optId;
		setStatus(correct ? 'correct' : 'wrong');
	};

	const onNext = () => {
		if (index < items.length - 1) {
			setIndex((i) => i + 1);
			setSelected(null);
			setStatus('none');
		} else {
			// Done — for now, bounce back to learn page
			window.location.href = '/learn';
		}
	};

	if (!current) return null;

	return (
		<main className="mx-auto max-w-screen-sm p-6">
			<h1 className="mb-6 text-2xl font-bold text-neutral-800">
				Select the translation for: <span className="underline">{current.word}</span>
			</h1>

			<div className="grid gap-3">
				{options.map((o) => {
					const isChosen = selected === o.id;
					const showCorrect = status !== 'none' && o.correct;
					const showWrong = status === 'wrong' && isChosen && !o.correct;

					return (
						<Button
							key={o.id}
							variant={showCorrect ? 'mint' : showWrong ? 'destructive' : 'outline'}
							rounded="xl"
							pressable
							className="justify-start"
							onClick={() => onChoose(o.id)}
							disabled={status !== 'none'}
						>
							{o.label}
						</Button>
					);
				})}
			</div>

			<div className="mt-6 flex items-center justify-between">
				<span className="text-sm text-neutral-500">
					{index + 1} / {items.length}
				</span>
				<Button
					variant={status === 'correct' ? 'mint' : status === 'wrong' ? 'destructive' : 'leaf'}
					onClick={onNext}
					disabled={status === 'none'}
				>
					{index === items.length - 1 ? 'Finish' : 'Next'}
				</Button>
			</div>
		</main>
	);
}
