'use client';

import type { VocabItem } from '../types';
import { CardShell } from '@/components/card-shell';

export default function ContextTab({ item }: { item: VocabItem }) {
	return (
		<section className="mt-8 rounded-[28px] border border-black/5 p-6">
			<div className="grid gap-8 sm:grid-cols-[1fr_2fr]">
				<CardShell title="Use Patterns" className="bg-transparent">
					<h2 className="dont-semibold mb-2 text-2xl">Blah blah blah</h2>
				</CardShell>
				<CardShell title=" " className="bg-transparent">
					<p className="leading-relaxed text-neutral-800">
						{item.meaning || 'No meaning made for this word yet'}
					</p>
				</CardShell>
			</div>
			<CardShell title="Example Sentences" className="mt-5 bg-transparent">
				<p className="leading-relaxed text-neutral-800">
					{item.meaning || 'No meaning made for this word yet'}
				</p>
			</CardShell>
		</section>
	);
}
