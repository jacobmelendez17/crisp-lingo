'use client';

import { useEffect, useState } from 'react';
import { CardShell } from '../../../../components/card-shell';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ActivityDay = {
	date: string; // 'YYYY-MM-DD'
	vocab: number;
	grammar: number;
};

type ActivityResponse = {
	days: ActivityDay[];
};

export function ActivityCard() {
	const [days, setDays] = useState<ActivityDay[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError(null);

				const res = await fetch('/api/activity');
				if (!res.ok) {
					throw new Error(`Request failed with status ${res.status}`);
				}

				const json: ActivityResponse = await res.json();
				if (cancelled) return;

				setDays(json.days || []);
			} catch (err: any) {
				if (!cancelled) setError(err.message ?? 'Failed to load activity');
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, []);

	// Build labels like "Oct 4", "Oct 5"...
	const labels =
		days?.map((d) => {
			const date = new Date(d.date);
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});
		}) ?? [];

	const vocabData = days?.map((d) => d.vocab) ?? [];
	const grammarData = days?.map((d) => d.grammar) ?? [];

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Vocab',
				data: vocabData,
				borderColor: '#b8d19f',
				backgroundColor: 'rgba(189,209,159,0.2)',
				tension: 0.4,
				fill: true,
				pointRadius: 0
			},
			{
				label: 'Grammar',
				data: grammarData,
				borderColor: '#678b5b', // fixed extra '#'
				backgroundColor: 'rgba(103,139,91,0.2)',
				tension: 0.4,
				fill: true,
				pointRadius: 0
			}
		]
	};

	const options: any = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'top' },
			tooltip: { mode: 'index', intersect: false }
		},
		interaction: { mode: 'index', intersect: false },
		scales: {
			x: { grid: { display: false } },
			y: {
				beginAtZero: true,
				grid: { color: 'rgba(0,0,0,0.05)' },
				ticks: {
					stepSize: 1,
					precision: 0
				}
			}
		}
	};

	return (
		<CardShell title="Activity" className="bg-white">
			<div className="h-64 w-full">
				{loading ? (
					<div className="flex h-full items-center justify-center text-sm text-neutral-500">
						Loading activity…
					</div>
				) : error ? (
					<div className="flex h-full items-center justify-center text-sm text-red-500">
						{error}
					</div>
				) : !days || days.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-neutral-500">
						No activity in the last 7 days.
					</div>
				) : (
					<Line data={chartData} options={options} />
				)}
			</div>
		</CardShell>
	);
}
