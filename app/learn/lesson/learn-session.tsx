'use client';

import { useState } from 'react';
import { Header } from '../header';
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
	firstItem: VocabItem; // 👈 new prop
};

export const LearnSession = ({ initialPercentage, firstItem }: Props) => {
	const [percentage] = useState(initialPercentage === 100 ? 0 : initialPercentage);

	return (
		<>
			<Header percentage={percentage} />
			<main className="mx-auto max-w-2xl p-6">
				<article className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
					<div className="text-3xl font-bold">{firstItem.word}</div>
					<div className="mt-2 text-neutral-700">{firstItem.translation}</div>
					{firstItem.meaning && <p className="mt-4 text-neutral-600">{firstItem.meaning}</p>}
				</article>
			</main>
		</>
	);
};
