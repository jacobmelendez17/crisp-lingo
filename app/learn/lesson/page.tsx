import db from '@/db/drizzle'; // ⬅️ use your existing drizzle client
import { vocab } from '@/db/schema'; // ⬅️ your schema export
import { asc } from 'drizzle-orm';

export default async function LessonPage() {
	// Grab the first vocab entry (seeded) deterministically
	const rows = await db.select().from(vocab).orderBy(asc(vocab.id)).limit(1);
	const first = rows[0] ?? null;

	if (!first) {
		return (
			<main className="mx-auto max-w-2xl p-6">
				<h1 className="text-2xl font-semibold">Lesson</h1>
				<p className="mt-4 text-neutral-600">No vocabulary found. Seed your DB and refresh.</p>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-2xl p-6">
			<h1 className="text-2xl font-semibold">Lesson</h1>
			<article className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
				<div className="text-3xl font-bold">{first.word}</div>
				<div className="mt-2 text-neutral-700">{first.translation}</div>
				{first.meaning && <p className="mt-4 text-neutral-600">{first.meaning}</p>}
			</article>
		</main>
	);
}
