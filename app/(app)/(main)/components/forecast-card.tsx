'use client';

import { useEffect, useState } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend, Filler);

type DailyPoint = {
	date: string; // 'YYYY-MM-DD'
	reviews: number;
};

type ApiResponse = {
	daily: DailyPoint[];
};

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
	const [dailyData, setDailyData] = useState<DailyPoint[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError(null);

				const res = await fetch('/api/review-forecast');
				if (!res.ok) {
					throw new Error(`Request failed with status ${res.status}`);
				}
				const json: ApiResponse = await res.json();
				if (cancelled) return;

				setDailyData(json.daily || []);
			} catch (err: any) {
				if (!cancelled) setError(err.message ?? 'Failed to load forecast');
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, []);

	// Build labels for daily mode: Mon, Tue, etc.
	const dailyLabels =
		dailyData?.map((d) => {
			const date = new Date(d.date);
			return date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, ...
		}) ?? [];

	const labels = mode === 'daily' ? dailyLabels : hourlyLabels;

	const data = {
		labels,
		datasets: [
			{
				label: 'Reviews',
				data:
					mode === 'daily'
						? (dailyData ?? []).map((d) => d.reviews)
						: // For now, keep hourly empty or simple placeholder
							Array(hourlyLabels.length).fill(0),
				backgroundColor: '#b8d19f',
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
			x: { stacked: false, grid: { display: true } },
			y: { beginAtZero: true, display: false, grid: { display: false } }
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
						// Right now hourly is just a placeholder; real data can be added later.
					>
						Hourly
					</button>
				</div>
			}
		>
			<div className="h-64 w-full">
				{loading ? (
					<div className="flex h-full items-center justify-center text-sm text-neutral-500">
						Loading forecast…
					</div>
				) : error ? (
					<div className="flex h-full items-center justify-center text-sm text-red-500">
						{error}
					</div>
				) : !dailyData || dailyData.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-neutral-500">
						No upcoming reviews yet.
					</div>
				) : (
					<Bar data={data} options={options} />
				)}
			</div>
		</CardShell>
	);
}
