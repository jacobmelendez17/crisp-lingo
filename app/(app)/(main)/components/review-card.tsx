import { CardShell } from '../../../../components/card-shell';
import { LearnButton } from './buttons/learn-button';

export function ReviewCard() {
	return (
		<CardShell title="Review" className="bg-[#cfbb99] text-white" titleClassName="text-white">
			<p>Unlock lessons by doing reviews</p>
			<LearnButton href="/learn/quiz?type=review" label="Start Reviews" />
		</CardShell>
	);
}
