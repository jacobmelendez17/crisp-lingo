import { CardShell } from '@/components/card-shell';
import { ReviewHeatmap } from './heatmap';

type Props = {
	days: { date: string; total: number }[]; // date should be "YYYY-MM-DD"
};

function isoDay(d: Date) {
	// UTC day string. If your DB dates are local, we can swap to local formatting.
	return d.toISOString().slice(0, 10);
}

function buildLast365Days(input: Props['days']) {
	const byDate = new Map(input.map((d) => [d.date, d.total]));

	const today = new Date();
	// Start at "today - 364" through "today" inclusive => 365 squares
	const out: { date: string; total: number }[] = [];

	for (let i = 364; i >= 0; i--) {
		const dt = new Date(today);
		dt.setDate(today.getDate() - i);

		const key = isoDay(dt);
		out.push({ date: key, total: byDate.get(key) ?? 0 });
	}

	return out;
}

export function ReviewHeatmapCard({ days }: Props) {
	const fullYear = buildLast365Days(days);

	return (
		<CardShell title="Study Streak" className="bg-white">
			<div className="space-y-3">
				<p className="text-xs text-neutral-500">
					Each square shows how many lessons and reviews you completed on that day.
				</p>

				{/* now always 365 entries */}
				<ReviewHeatmap days={fullYear} />

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
