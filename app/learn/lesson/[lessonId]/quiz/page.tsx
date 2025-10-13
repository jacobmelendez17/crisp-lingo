// app/learn/lesson/[lessonId]/quiz/page.tsx
import { getBatch } from '@/db/queries';
import Quiz from './quiz';

export default async function QuizPage({ params }: { params: { lessonId: string } }) {
	// For MVP we’re ignoring lessonId and just taking 5 vocab from seed
	const items = await getBatch(5);

	return <Quiz items={items} initialHearts={5} />;
}
