'use client';

import { CardShell } from './card-shell';
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

//dummy data
const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const data = {
	labels,
	datasets: [
		{
			label: 'Reviews',
			data: [12, 18, 9, 22, 16, 14, 20],
			borderColor: '#22c55e',
			backgroundColor: 'rgba(239, 68, 68, 0.8)',
			pointRadius: 0,
			tension: 0.35,
			fill: true
		},
		{
			label: 'Lessons',
			data: [3, 5, 2, 6, 4, 4, 7],
			borderColor: '#0ea5e9',
			backgroundColor: 'rgba(147, 51, 234, 0.8)',
			pointRadius: 0,
			tension: 0.35,
			fill: true
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
//dummy data end

export function ForecastCard() {
	return (
		<CardShell title="Forecast" className="bg-[#ffffff]">
			<div className="h-64 w-full">
				<Bar data={data} options={options} />
			</div>
		</CardShell>
	);
}
