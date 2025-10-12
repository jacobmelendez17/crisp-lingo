'use client';

import { CardShell } from '../../../../components/card-shell';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	BarElement,
	Tooltip,
	Legend,
	Filler
} from 'chart.js';

import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend, Filler);

//dummy data
const dailyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hourlyLabels = [
	'12 AM',
	'1 AM',
	'2 AM',
	'3 AM',
	'4 AM',
	'5 AM',
	'6 AM',
	'7 AM',
	'8 AM',
	'9 AM',
	'10 AM',
	'11 AM'
];

export function ForecastCard() {
	const [mode, setMode] = useState<'daily' | 'hourly'>('daily');

	const labels = mode == 'daily' ? dailyLabels : hourlyLabels;

	const data = {
		labels,
		datasets: [
			{
				label: 'Reviews',
				data:
					mode === 'daily' ? [12, 18, 9, 22, 16, 14, 20] : [2, 4, 3, 6, 5, 4, 3, 7, 9, 13, 5, 2],
				backgroundColor: 'rgba(239, 68, 68, 0.8)', // red
				borderRadius: 6
			},
			{
				label: 'Learn',
				data: mode === 'daily' ? [3, 5, 2, 6, 4, 4, 7] : [1, 2, 1, 3, 2, 1, 2, 4, 7, 13, 6, 5, 4],
				backgroundColor: 'rgba(147, 51, 234, 0.8)', // purple
				borderRadius: 6
			}
		]
	};

	const options: any = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'bottom' },
			tooltip: { mode: 'index', intersect: false }
		},
		interaction: { mode: 'index', intersect: false },
		scales: {
			x: { stacked: true, grid: { display: true } },
			y: { stacked: true, beginAtZero: true, display: false, grid: { display: false } }
		}
	};

	return (
		<CardShell
			title="Forecast"
			className="bg-white"
			actions={
				<div className="flex gap-2 rounded-xl bg-neutral-100 p-1">
					<button
						onClick={() => setMode('daily')}
						className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
							mode === 'daily'
								? 'bg-white text-black shadow-sm'
								: 'text-neutral-500 hover:text-neutral-700'
						}`}
					>
						Daily
					</button>
					<button
						onClick={() => setMode('hourly')}
						className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
							mode === 'hourly'
								? 'bg-white text-black shadow-sm'
								: 'text-neutral-500 hover:text-neutral-700'
						}`}
					>
						Hourly
					</button>
				</div>
			}
		>
			<div className="h-64 w-full">
				<Bar data={data} options={options} />
			</div>
		</CardShell>
	);
}
