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
	const [percentage] = useState(initialPercentage === 100 ? 0 : initialPercentage);

	const [currentIndex, setCurrentIndex] = useState(0);
	const total = batch.length;
	const current = batch[currentIndex];

	return (
		<>
			<Header percentage={percentage} />
			<main className="mx-auto max-w-2xl p-6">
				<article className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
					<section className="flex flex-col items-center">
						<div className="mb-4 h-28 w-28">
							<Image
								src={current.imageUrl || 'vercel.svg'}
								alt={current.word}
								width={112}
								height={112}
								className="h-28 w-28 object-contain"
							/>
						</div>
					</section>
					<h1>{current.word}</h1>
					<p>{current.translation}</p>
				</article>
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
