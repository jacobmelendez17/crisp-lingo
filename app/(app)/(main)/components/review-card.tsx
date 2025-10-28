import { CardShell } from '../../../../components/card-shell';
import { LearnButton } from './buttons/learn-button';
import { countDueReviews } from '@/db/queries';

export async function ReviewCard() {
	const due = await countDueReviews();

	return (
		<CardShell
			title="Review"
			className="bg-[#cfbb99] text-white"
			titleClassName="text-white"
			actions={
				due > 0 ? (
					<span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#6b4f2e] shadow-sm">
						{due}
					</span>
				) : null
			}
		>
			{due > 0 ? (
				<>
					<p className="mb-4">You have reviews waiting</p>
					<div className="flex flex-row gap-3">
						<LearnButton href="/learn/quiz?type=review" label="Start Reviews" />
					</div>
				</>
			) : (
				<p>No reviews due now</p>
			)}
		</CardShell>
	);
}
