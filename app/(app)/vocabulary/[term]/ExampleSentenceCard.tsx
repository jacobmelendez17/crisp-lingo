'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export type ExampleProps = {
	id: number | string;
	sentence: string;
	translation: string;
	audioUrl?: string | null;
};

type Props = {
	examples: ExampleProps[];
};

export function ExampleSentenceCard({ examples }: Props) {
	const [playingId, setPlayingId] = useState<number | string | null>(null);

	const handlePlay = async (ex: ExampleProps) => {
		if (!ex.audioUrl) return;
		try {
			const audio = new Audio(ex.audioUrl);
			setPlayingId(ex.id);
			await audio.play();
			audio.onended = () => setPlayingId(null);
		} catch {
			setPlayingId(null);
		}
	};

	if (!examples.length) {
		return (
			<section className="mt-8 rounded-2xl bg-[#fff9f5] p-5 shadow-sm">
				<h2 className="text-3xl font-semibold text-neutral-900">Example Sentences</h2>
				<p className="mt-4 text-lg text-neutral-700">
					No example sentences have been added for this word yet!
				</p>
			</section>
		);
	}

	return (
		<section className="mt-8 rounded-2xl bg-[#fff9f5] p-5 shadow-sm">
			<h2 className="text-3xl font-semibold text-neutral-900">Example Sentences</h2>

			<div className="mt-4 space-y-3">
				{examples.map((ex) => (
					<div
						key={ex.id}
						className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-4 py-3"
					>
						<div className="flex-1 text-center">
							<p className="text-lg font-semibold text-neutral-900">{ex.sentence}</p>
							<p className="mt-1 text-sm text-neutral-600">{ex.translation}</p>
						</div>

						<Button
							size="icon"
							variant="leaf"
							disabled={!ex.audioUrl}
							aria-label="Play audio"
							onClick={() => handlePlay(ex)}
						>
							<Play className={`h-5 w-5 ${playingId === ex.id ? 'animate-pulse' : ''}`} />
						</Button>
					</div>
				))}
			</div>
		</section>
	);
}
