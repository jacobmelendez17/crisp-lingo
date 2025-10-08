import { CardShell } from './card-shell';
import { LearnButton } from './buttons/learn-button';

export function LearnCard() {
	return (
		<CardShell title="Learn" className="bg-[#cfbb99] text-white" titleClassName="text-white">
			<p>Learn something new</p>
			<LearnButton href="/learn/lesson" label="Start Lessons" />
			<LearnButton href="/" label="Advanced" />
		</CardShell>
	);
}
