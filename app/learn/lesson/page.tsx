import { getBatch, getUserProgress } from '@/db/queries';
import { LearnSession } from './learn-session';

const LessonPage = async () => {
	const userProgressData = getUserProgress();
	const batchData = getBatch();

	const [userProgress, batch] = await Promise.all([userProgressData, batchData]);

	if (!batch || !userProgress) {
		return null;
	}

	const initialPercentage = 100;

	return <LearnSession initialPercentage={initialPercentage} />;
};

export default LessonPage;
