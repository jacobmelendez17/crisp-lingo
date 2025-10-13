'use client';

import type { VocabItem } from '../types';
import { CardShell } from '@/components/card-shell';

export default function ReadingTab({ item }: { item: VocabItem }) {
	return (
		<section className="mt-8 rounded-[28px] border border-black/5 p-6">
			<div className="grid gap-8 sm:grid-cols-[1fr_2fr]">
				<CardShell title="Pronunciation" className="bg-transparent">
					<h2 className="dont-semibold mb-2 text-2xl">Part of Speech</h2>
					<p className="leading-relaxed text-neutral-800">
						{item.pronunciation || 'No pronunciation yet'}
					</p>
					<h2 className="dont-semibold mb-2 text-2xl">Synonyms</h2>
					<p className="leading-relaxed text-neutral-800">{item.audioUrl || 'No audio yet'}</p>
				</CardShell>
				<CardShell title="Explanation" className="bg-transparent">
					<p className="leading-relaxed text-neutral-800">
						{/* TODO: Change item.meaning to explanation after it's integrated */}
						{item.meaning || 'No explanation made for this word yet'}
					</p>
				</CardShell>
			</div>
		</section>
	);
}
