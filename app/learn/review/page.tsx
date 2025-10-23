import { Quiz } from './quiz';
import { getVocabByIds, getNextBatch } from '@/db/queries';

type PageProps = {
	searchParams?: { ids?: string };
};

export default async function ReviewPage({ searchParams }: PageProps) {
	const idsParam = searchParams?.ids ?? '';
	const ids = idsParam
		.split(',')
		.map((s) => parseInt(s.trim(), 10))
		.filter((n) => Number.isFinite(n));

	const rows = ids.length ? await getVocabByIds(ids) : await getNextBatch(5);

	const initialPercentage = 0;

	const items = rows.map((r: any) => ({
		id: r.id,
		word: r.word,
		translation: r.translation,
		imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null
	}));

	if (!items.length) return null;

	return <Quiz items={items} initialPercentage={initialPercentage} />;
}
