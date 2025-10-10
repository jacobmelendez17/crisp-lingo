import { getBatch, getUserProgress } from '@/db/queries';
import { LearnSession } from './learn-session';

export default async function LessonPage() {
	const initialPercentage = 100;

	return <LearnSession initialPercentage={initialPercentage} />;
}
