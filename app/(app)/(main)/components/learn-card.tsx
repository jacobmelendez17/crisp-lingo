import { CardShell } from '../../../../components/card-shell';
import { LearnButton } from './buttons/learn-button';

export function LearnCard() {
	return (
		<CardShell title="Learn" className="bg-[#cfbb99] text-white" titleClassName="text-white">
			<p className="mb-4">Learn something new</p>

			<div className="flex flex-row gap-3">
				<LearnButton href="/learn/lesson" label="Start Lessons" />
				<LearnButton href="/" label="Advanced" />
			</div>
		</CardShell>
	);
}
