// app/learn/lesson/page.tsx
import { getBatch } from '@/db/queries';
import { LearnSession } from './learn-session';

const LessonPage = async () => {
	//const batch = await getBatch(5);
	const batch = [
		{
			id: 1,
			word: 'hola',
			translation: 'hello',
			meaning: 'A common Spanish greeting used at any time of day.'
		},
		{
			id: 2,
			word: 'gracias',
			translation: 'thank you',
			meaning: 'Used to express gratitude or appreciation.'
		},
		{
			id: 3,
			word: 'adiós',
			translation: 'goodbye',
			meaning: 'Used when parting or leaving someone.'
		},
		{
			id: 4,
			word: 'por favor',
			translation: 'please',
			meaning: 'Used to make polite requests.'
		},
		{
			id: 5,
			word: 'perdón',
			translation: 'sorry',
			meaning: 'Used to apologize or get someone’s attention politely.'
		}
	];
	if (!batch?.length) return null;

	const first = batch[0]; // 👈 take the first seeded vocab row

	return <LearnSession initialPercentage={0} batch={batch} />;
};

export default LessonPage;
