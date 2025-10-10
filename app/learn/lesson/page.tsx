// app/learn/lesson/page.tsx
import { getBatch } from '@/db/queries';
import { LearnSession } from './learn-session';

const LessonPage = async () => {
	const batch = await getBatch(5);
	if (!batch?.length) return null;

	const first = batch[0]; // 👈 take the first seeded vocab row

	return (
		<LearnSession
			initialPercentage={0}
			firstItem={{
				id: first.id,
				word: first.word,
				translation: first.translation,
				meaning: first.meaning ?? null
			}}
		/>
	);
};

export default LessonPage;
