'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type DayActivity = {
	date: string;
	total: number;
};

type Props = {
	days: DayActivity[];
};

function intensityClass(total: number) {
	if (total === 0) return 'bg-neutral-200';
	if (total <= 2) return 'bg-[#d6e7cc]';
	if (total <= 5) return 'bg-[#b3d295]';
	if (total <= 9) return 'bg-[#8ab46a]';
	return 'bg-[#5a8141]';
}

export function ReviewHeatmap({ days }: Props) {
	const weeks = useMemo(() => {
		if (!days.length) return [];

		const firstDate = new Date(days[0].date + 'T00:00:00');
		while (firstDate.getDay() !== 0) {
			firstDate.setDate(firstDate.getDate() - 1);
		}

		const endDate = new Date(days[days.length - 1].date + 'T00:00:00');

		const allDays: DayActivity[] = [];
		const cursor = new Date(firstDate.getTime());

		const map = new Map<string, DayActivity>();
		for (const d of days) map.set(d.date, d);

		while (cursor <= endDate) {
			const key = cursor.toISOString().slice(0, 10);
			allDays.push(map.get(key) ?? { date: key, total: 0 });
			cursor.setDate(cursor.getDate() + 1);
		}

		const weeksArray: DayActivity[][] = [];
		for (let i = 0; i < allDays.length; i += 7) {
			weeksArray.push(allDays.slice(i, i + 7));
		}

		return weeksArray;
	}, [days]);

	return (
		<div className="flex gap-3">
			<div className="flex flex-col justify-between py-1 text-xs text-neutral-500">
				<span>Mon</span>
				<span>Wed</span>
				<span>Fri</span>
			</div>

			<div className="grid auto-cols-[12px] grid-flow-col gap-[3px]">
				{weeks.map((week, wi) => (
					<div key={wi} className="grid grid-rows-7 gap-[3px]">
						{week.map((day, di) => {
							return (
								<div
									key={day.date + di}
									className={cn(
										'h-3 w-3 rounded-[3px] transition-colors',
										intensityClass(day.total)
									)}
									title={`${day.total} items on ${day.date}`}
								/>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
