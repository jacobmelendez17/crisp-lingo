import { CardShell } from '@/components/card-shell';
import { ReviewHeatmap } from './heatmap';

type Props = {
	days: { date: string; total: number }[];
};

export function ReviewHeatmapCard({ days }: Props) {
	return (
		<CardShell title="Study Streak (Last Year)" className="bg-white">
			<div className="space-y-3">
				<p className="text-xs text-neutral-500">
					Each square shows how many lessons and reviews you completed on that day.
				</p>
				<ReviewHeatmap days={days} />
				<div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-neutral-500">
					<span>Less</span>
					<div className="flex gap-1">
						<div className="h-3 w-3 rounded-[3px] bg-neutral-200" />
						<div className="h-3 w-3 rounded-[3px] bg-[#d6e7cc]" />
						<div className="h-3 w-3 rounded-[3px] bg-[#b3d295]" />
						<div className="h-3 w-3 rounded-[3px] bg-[#8ab46a]" />
						<div className="h-3 w-3 rounded-[3px] bg-[#5a8141]" />
					</div>
					<span>More</span>
				</div>
			</div>
		</CardShell>
	);
}
