import { getNextBatch } from '@/db/queries';
import { LearnSession } from './learn-session';
import { ensureUserProgress } from '@/db/ensure-progress';

const LessonPage = async () => {
	//await ensureUserProgress();
	const rows = await getNextBatch(5);

	if (!rows?.length) return null;

	const batch = rows.map((r) => ({
		id: r.id,
		word: r.word,
		translation: r.translation,
		meaning: r.meaning ?? null,
		pronunciation: r.pronunciation ?? null,
		example: r.example ?? null,
		partOfSpeech: r.partOfSpeech ?? null,
		imageUrl: r.imageUrl ? (r.imageUrl.startsWith('/') ? r.imageUrl : `/${r.imageUrl}`) : null,
		audioUrl: r.audioUrl ?? null
	}));

	return <LearnSession initialPercentage={0} batch={batch} />;
};

export default LessonPage;
