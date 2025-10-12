'use client';

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

const labels = ['Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9'];

const data = {
	labels,
	datasets: [
		{
			label: 'Vocab',
			data: [2, 3, 4, 5, 7, 1],
			borderColor: '#8b5cf6',
			backgroundColor: 'rgba(139,92,246,0.2)',
			tension: 0.4,
			fill: true,
			pointRadius: 0
		},
		{
			label: 'Grammar',
			data: [1, 2, 3, 4, 5, 6],
			borderColor: '#ef4444',
			backgroundColor: 'rgba(239,68,68,0.2)',
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
			ticks: { stepSize: 1 }
		}
	}
};

export function ActivityCard() {
	return (
		<CardShell title="Activity" className="bg-white">
			<div className="h-64 w-full">
				<Line data={data} options={options} />
			</div>
		</CardShell>
	);
}
