'use client';

import { useEffect, useState } from 'react';
import { CardShell } from '@/components/card-shell';
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
import { doublePrecision } from 'drizzle-orm/gel-core';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend, Filler);

type DailyPoint = {
	date: string; // 'YYYY-MM-DD'
	reviews: number;
};

type HourlyPoint = {
	hour: number;
	reviews: number;
};

type ApiResponse = {
	daily: DailyPoint[];
	hourly?: HourlyPoint[];
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
	'11 AM',
	'12 PM',
	'1 PM',
	'2 PM',
	'3 PM',
	'4 PM',
	'5 PM',
	'6 PM',
	'7 PM',
	'8 PM',
	'9 PM',
	'10 PM',
	'11 PM'
];

export function ForecastCard() {
	const [mode, setMode] = useState<'daily' | 'hourly'>('daily');
	const [dailyData, setDailyData] = useState<DailyPoint[] | null>(null);
	const [hourlyData, setHourlyData] = useState<HourlyPoint[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError(null);

				const url = mode === 'daily' ? '/api/review-forecast' : '/api/review-forecast?mode=hourly';

				const res = await fetch(url);
				if (!res.ok) {
					throw new Error(`Request failed with status ${res.status}`);
				}

				const json: ApiResponse = await res.json();
				if (cancelled) return;

				if (mode === 'daily') {
					setDailyData(json.daily || []);
				} else {
					setHourlyData(json.hourly || []);
				}
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
	}, [mode]);

	// Build labels for daily mode: Mon, Tue, etc.
	const dailyLabels =
		dailyData?.map((d) => {
			const date = new Date(d.date);
			return date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, ...
		}) ?? [];

	const labels = mode === 'daily' ? dailyLabels : hourlyLabels;

	const datasetData =
		mode === 'daily'
			? (dailyData ?? []).map((d) => d.reviews)
			: (hourlyData ?? []).map((h) => h.reviews);

	const hasData =
		mode === 'daily' ? dailyData && dailyData.length > 0 : hourlyData && hourlyData.length > 0;

	const data = {
		labels,
		datasets: [
			{
				label: 'Reviews',
				data: datasetData,
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
			y: {
				beginAtZero: true,
				grid: {
					display: false
				},
				ticks: {
					stepSize: 1,
					precision: 0,
					font: {
						size: 12,
						weight: '500'
					},
					color: '#555',
					padding: 4
				}
			}
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
				{loading ? (
					<div className="flex h-full items-center justify-center text-sm text-neutral-500">
						Loading forecast…
					</div>
				) : error ? (
					<div className="flex h-full items-center justify-center text-sm text-red-500">
						{error}
					</div>
				) : !hasData ? (
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
