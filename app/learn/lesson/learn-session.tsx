'use client';

import { useState } from 'react';

import { Header } from '../header';
import { Footer } from '../footer';
import Image from 'next/image';
//import Button from '@/components/ui/button';

type VocabItem = {
	id: number;
	word: string;
	translation: string;
	meaning: string | null;
	pronunciation?: string | null;
	example?: string | null;
	imageUrl?: string | null;
	audioUrl?: string | null;
};

type Props = {
	initialPercentage: number;
	batch: VocabItem[];
};

export const LearnSession = ({ initialPercentage, batch }: Props) => {
	if (!batch?.length) return null;

	const [percentage] = useState(initialPercentage === 100 ? 0 : initialPercentage);

	const [currentIndex, setCurrentIndex] = useState(0);
	const total = batch.length;
	const current = batch[currentIndex];

	return (
		<>
			<Header percentage={percentage} />
			<main className="mx-auto max-w-2xl p-6">
				<section className="flex flex-col items-center">
					<div className="mb-4 h-28 w-28">
						<Image
							src={current.imageUrl || '/vercel.svg'}
							alt={current.word}
							width={112}
							height={112}
							className="h-28 w-28 object-contain"
						/>
					</div>
					<h1 className="text-4xl font-bold text-neutral-800">{current.word}</h1>
				</section>

				<p>{current.translation}</p>
			</main>
			<Footer
				currentIndex={currentIndex}
				total={total}
				nextAction={() => setCurrentIndex((i) => Math.min(i + 1, total - 1))}
				backAction={currentIndex > 0 ? () => setCurrentIndex((i) => Math.max(i - 1, 0)) : undefined}
			/>
		</>
	);
};
