import { notFound } from 'next/navigation';
import db from '@/db/drizzle';
import { vocab } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const revalidate = 60; // incremental static regeneration

type Props = { params: { term: string } };

export default async function VocabDetailPage({ params }: Props) {
	const term = decodeURIComponent(params.term);

	const row = await db.query.vocab.findFirst({
		where: eq(vocab.word, term)
	});

	if (!row) return notFound();

	return (
		<main className="mx-auto w-full max-w-[800px] px-4 py-8">
			<h1 className="mb-2 text-4xl font-bold">{row.word}</h1>
			<p className="text-xl text-neutral-700">{row.translation}</p>

			<div className="mt-6 grid gap-6 sm:grid-cols-2">
				<section className="rounded-xl border border-black/5 bg-transparent p-5 shadow-sm">
					<h2 className="mb-2 text-lg font-semibold">Reading / Pronunciation</h2>
					<p>{row.pronunciation ?? '-'}</p>
				</section>

				<section className="rounded-xl border border-black/5 bg-transparent p-5 shadow-sm sm:col-span-2">
					<h2 className="mb-2 text-lg font-semibold">Example</h2>
					<p>{row.example ?? '-'}</p>
					<p>{row.exampleTranslation ?? '-'}</p>
				</section>
			</div>
		</main>
	);
}
