// app/learn/lesson/page.tsx
import { getBatch } from '@/db/queries';
import { LearnSession } from './learn-session';

const LessonPage = async () => {
	const rows = await getBatch(5);

	if (!rows?.length) return null;

	const batch = rows.map((r) => ({
		id: r.id,
		word: r.word,
		translation: r.translation,
		meaning: r.meaning ?? null,
		pronunciation: r.pronunciation ?? null,
		example: r.example ?? null,
		imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null,
		audioUrl: r.audioUrl ?? null
	}));

	return <LearnSession initialPercentage={0} batch={batch} />;
};

export default LessonPage;
