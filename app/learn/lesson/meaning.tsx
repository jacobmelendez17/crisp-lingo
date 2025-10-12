'use client';

import type { VocabItem } from '../types';

export default function MeaningTab({ item }: { item: VocabItem }) {
	return (
		<section className="mt-8 rounded-[28px] border border-black/5 bg-[#b8d9b3] p-6 shadow-sm">
			<div className="grid gap-8 sm:grid-cols-2">
				<div>
					<h2 className="mb-2 text-2xl font-semibold">Word Type</h2>
					<p className="leading-relaxed text-neutral-800">{item.partOfSpeech || 'No PoS yet'}</p>
				</div>
				<div>
					<h2 className="mb-2 text-2xl font-semibold">Explanation</h2>
					<p className="leading-relaxed text-neutral-800">
						{item.meaning || 'No meaning made for this word yet'}
					</p>
				</div>
			</div>
		</section>
	);
}
