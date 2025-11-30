// app/learn/quiz/page.tsx
import { notFound } from 'next/navigation';
import { Quiz } from '../review/quiz'; // keep your import
import { getVocabByIds, getDueReviews } from '@/db/queries';

type PageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstStr(v: string | string[] | undefined, fallback = ''): string {
	if (Array.isArray(v)) return v[0] ?? fallback;
	return (v as string) ?? fallback;
}

export default async function LearnQuizPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const typeParam = firstStr(params.type, 'lesson').toLowerCase();
	const type = (typeParam === 'review' ? 'review' : 'lesson') as 'lesson' | 'review';

	const idsParam = firstStr(params.id) || firstStr(params.ids);
	const ids = (idsParam || '')
		.split(',')
		.map((s) => parseInt(s.trim(), 10))
		.filter(Number.isFinite);

	let rows: Array<{
		id: number;
		word: string;
		translation: string;
		imageUrl: string | null;
		srsLevel?: number;
		example?: string | null;
		exampleTranslation?: string | null;
	}> | null = null;

	if (type === 'lesson') {
		if (!ids.length) return notFound();
		const vocabRows = await getVocabByIds(ids);
		rows = vocabRows.map((r) => ({
			id: r.id,
			word: r.word,
			translation: r.translation,
			imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null,
			srsLevel: undefined,
			example: null,
			exampleTranslation: null
		}));
	} else {
		const due = await getDueReviews();
		if (!due.length) {
			return (
				<main className="mx-auto max-w-screen-md p-6 text-center">
					<h1 className="mb-2 text-2xl font-semibold text-neutral-800">No reviews due</h1>
					<p className="text-neutral-600">Check back later or learn new items to unlock reviews.</p>
				</main>
			);
		}
		rows = due.map((r) => ({
			id: r.id,
			word: r.word,
			translation: r.translation,
			imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null,
			srsLevel: r.srsLevel ?? 0,
			example: r.example ?? null,
			exampleTranslation: r.exampleTranslation ?? null
		}));
	}

	if (!rows?.length) return null;
	return <Quiz items={rows} initialPercentage={0} sessionType={type} />;
}
