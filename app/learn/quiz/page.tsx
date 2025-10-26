import { Quiz } from '../review/quiz'; // or adjust the import path
import { getVocabByIds, getNextBatch } from '@/db/queries';

type PageProps = {
	searchParams?: Record<string, string | string[] | undefined>;
};

export default async function LearnQuizPage({ searchParams = {} }: PageProps) {
	const idsParam = (searchParams.ids ?? searchParams.id ?? '') as string;
	const type = (searchParams.type ?? 'lesson') as 'lesson' | 'review';

	const ids = String(idsParam)
		.split(',')
		.map((s) => parseInt(s.trim(), 10))
		.filter((n) => Number.isFinite(n));

	const rows = ids.length ? await getVocabByIds(ids) : await getNextBatch(5);

	const items = rows.map((r: any) => ({
		id: r.id,
		word: r.word,
		translation: r.translation,
		imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null
	}));

	if (!items.length) return null;

	return <Quiz items={items} initialPercentage={0} sessionType={type} />;
}
