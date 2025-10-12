'use client';

import { useState } from 'react';

import { Header } from '../header';
import { Footer } from '../footer';
import MeaningTab from './meaning';
import ReadingTab from './reading';
import ContextTab from './context';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type VocabItem = {
	id: number;
	word: string;
	translation: string;
	meaning: string | null;
	pronunciation?: string | null;
	example?: string | null;
	partOfSpeech?: string | null;
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
	const [activeTab, setActiveTab] = useState<'meaning' | 'reading' | 'context'>('meaning');
	const [currentIndex, setCurrentIndex] = useState(0);
	const total = batch.length;
	const current = batch[currentIndex];

	return (
		<>
			<Header percentage={percentage} />
			{/*TODO: Make sub-components so this isn't so clustered
				Make components for meaning, reading, and context */}
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
				<div className="mt-4 border-t-2 border-dotted border-black" />
				<div className="gap-30 flex justify-center">
					<Button
						variant={activeTab === 'meaning' ? 'sage' : 'outline'}
						rounded="2xl"
						onClick={() => setActiveTab('meaning')}
					>
						meaning
					</Button>
					<Button
						variant={activeTab === 'reading' ? 'sage' : 'outline'}
						rounded="2xl"
						onClick={() => setActiveTab('reading')}
					>
						reading
					</Button>
					<Button
						variant={activeTab === 'context' ? 'sage' : 'outline'}
						rounded="2xl"
						onClick={() => setActiveTab('context')}
					>
						context
					</Button>
				</div>
				<div className="border-t-2 border-dotted border-black" />

				{activeTab === 'meaning' && <MeaningTab item={current} />}
				{activeTab === 'reading' && <ReadingTab item={current} />}
				{activeTab === 'context' && <ContextTab item={current} />}
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
