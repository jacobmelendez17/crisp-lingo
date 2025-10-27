'use client';

import { useState } from 'react';

import { Footer } from '../footer';
import { Header } from './header';
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
	synonyms?: string | null;
	imageUrl?: string | null;
	audioUrl?: string | null;
};

type Props = {
	initialPercentage: number;
	batch: VocabItem[];
};

export const LearnSession = ({ initialPercentage, batch }: Props) => {
	if (!batch?.length) return null;

	const [activeTab, setActiveTab] = useState<'meaning' | 'reading' | 'context'>('meaning');
	const [currentIndex, setCurrentIndex] = useState(0);
	const total = batch.length;
	const current = batch[currentIndex];
	const quizHref = `/learn/quiz?type=lesson&id=${batch.map((b) => b.id).join(',')}`;

	const tabs: Array<{ key: 'meaning' | 'reading' | 'context'; label: string }> = [
		{ key: 'meaning', label: 'meaning' },
		{ key: 'reading', label: 'reading' },
		{ key: 'context', label: 'context' }
	];

	const activeIndex = tabs.findIndex((t) => t.key === activeTab);

	return (
		<>
			<Header />
			<main className="mx-auto max-w-screen-lg p-6">
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

				<div
					className="my-4 h-[2px] w-full"
					style={{
						backgroundImage:
							'repeating-linear-gradient(to right, #a3c1ad 0 10px, transparent 10px 20px)'
					}}
				/>

				{/* TODO: Fix the slider so it is centered with the tabs and matches color. Might need to change color*/}
				<div className="gap-30 relative mx-auto flex w-fit items-center justify-center rounded-[28px] bg-transparent p-1">
					<span
						className="absolute inset-y-0 left-0 z-0 h-full rounded-[24px] bg-[#b8d9b3] transition-transform duration-300 ease-out"
						style={{
							width: 'calc(100% / 3)',
							transform:
								activeTab === 'meaning'
									? 'translateX(0%)'
									: activeTab === 'reading'
										? 'translateX(100%)'
										: 'translateX(200%)'
						}}
					/>

					<Button
						variant={activeTab === 'meaning' ? 'sage' : 'outline'}
						rounded="2xl"
						className="relative z-10"
						onClick={() => setActiveTab('meaning')}
					>
						meaning
					</Button>
					<Button
						variant={activeTab === 'reading' ? 'sage' : 'outline'}
						rounded="2xl"
						className="relative z-10"
						onClick={() => setActiveTab('reading')}
					>
						reading
					</Button>
					<Button
						variant={activeTab === 'context' ? 'sage' : 'outline'}
						rounded="2xl"
						className="relative z-10"
						onClick={() => setActiveTab('context')}
					>
						context
					</Button>
				</div>

				<div
					className="my-4 h-[2px] w-full"
					style={{
						backgroundImage:
							'repeating-linear-gradient(to right, #a3c1ad 0 10px, transparent 10px 20px)'
					}}
				/>

				{activeTab === 'meaning' && <MeaningTab item={current} />}
				{activeTab === 'reading' && <ReadingTab item={current} />}
				{activeTab === 'context' && <ContextTab item={current} />}
			</main>
			<Footer
				currentIndex={currentIndex}
				total={total}
				nextAction={() => setCurrentIndex((i) => Math.min(i + 1, total - 1))}
				backAction={currentIndex > 0 ? () => setCurrentIndex((i) => Math.max(i - 1, 0)) : undefined}
				quizHref={quizHref}
			/>
		</>
	);
};
