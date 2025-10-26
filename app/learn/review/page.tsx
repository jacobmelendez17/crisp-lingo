import { Quiz } from './quiz';
import { getVocabByIds, getNextBatch } from '@/db/queries';

type PageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const idsParam = (params.ids ?? params.id ?? '') as string;
	const ids = idsParam
		.split(',')
		.map((s) => parseInt(s.trim(), 10))
		.filter((n) => Number.isFinite(n));

	console.log('review idsParam:', idsParam);
	console.log('review ids parsed:', ids);

	const rows = ids.length ? await getVocabByIds(ids) : await getNextBatch(5);

	const initialPercentage = 0;

	const items = rows.map((r: any) => ({
		id: r.id,
		word: r.word,
		translation: r.translation,
		imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null
	}));

	if (!items.length) return null;

	return <Quiz items={items} initialPercentage={initialPercentage} sessionType="review" />;
}
