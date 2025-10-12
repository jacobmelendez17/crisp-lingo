'use client';

import type { VocabItem } from '../types';

export default function MeaningTab({ item }: { item: VocabItem }) {
	return (
		<section className="mt-8 rounded-[28px] border border-black/5 p-6 shadow-sm">
			<div className="gap-8 sm:grid-cols-2">
				<h2 className="dont-semibold mb-2 text-2xl">Part of Speech</h2>
				<p className="leading-relaxed text-neutral-800">{item.partOfSpeech || 'No PoS yet'}</p>
				<h2 className="dont-semibold mb-2 text-2xl">Meaning</h2>
				<p className="leading-relaxed text-neutral-800">
					{item.meaning || 'No meaning made for this word yet'}
				</p>
				<h2 className="dont-semibold mb-2 text-2xl">Synonyms</h2>
				<p className="leading-relaxed text-neutral-800">{item.synonyms || 'No synonyms yet'}</p>
			</div>
		</section>
	);
}
