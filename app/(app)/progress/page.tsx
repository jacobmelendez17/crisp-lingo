// app/(dashboard)/progress/page.tsx
import { ReviewHeatmapCard } from './components/heatmap-card';
import { CardShell } from '@/components/card-shell';
import { Progress } from '@/components/ui/progress';

// TODO: Replace this with real data from your DB
const MOCK_DAYS = [
	{ date: '2025-11-25', total: 3 },
	{ date: '2025-11-26', total: 5 },
	{ date: '2025-11-27', total: 0 },
	{ date: '2025-11-28', total: 2 },
	{ date: '2025-11-29', total: 6 },
	{ date: '2025-11-30', total: 9 },
	{ date: '2025-12-01', total: 4 },
	{ date: '2025-12-02', total: 1 },
	{ date: '2025-12-03', total: 0 },
	{ date: '2025-12-04', total: 7 },
	{ date: '2025-12-05', total: 5 }
];

// TODO: Replace these with values derived from userProgress, etc.
const VOCAB_LEVEL = 5;
const TOTAL_VOCAB_LEVELS = 60;
const GRAMMAR_LEVEL = 3;
const TOTAL_GRAMMAR_LEVELS = 60;

const VOCAB_COMPLETION = 18; // %
const GRAMMAR_COMPLETION = 9; // %

export default function ProgressPage() {
	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-8 lg:px-6">
			<header className="mb-6">
				<h1 className="text-4xl font-bold text-neutral-800">Progress</h1>
				<p className="mt-1 text-sm text-neutral-600">
					See your study streak, level progression, and overall completion.
				</p>
			</header>

			{/* Heatmap at the top */}
			<section className="mb-8">
				<ReviewHeatmapCard days={MOCK_DAYS} />
			</section>

			{/* Level progression: vocabulary + grammar */}
			<section className="mb-8 grid gap-6 lg:grid-cols-2">
				<CardShell title="Vocabulary Levels" className="bg-white">
					<div className="space-y-3 text-sm text-neutral-800">
						<p className="text-neutral-600">
							Track how far you&apos;ve come through the vocabulary course.
						</p>

						<div className="flex items-baseline justify-between">
							<div>
								<p className="text-xs uppercase tracking-wide text-neutral-500">Current Level</p>
								<p className="text-3xl font-semibold text-neutral-900">
									{VOCAB_LEVEL}
									<span className="ml-1 text-base font-normal text-neutral-500">
										/ {TOTAL_VOCAB_LEVELS}
									</span>
								</p>
							</div>
						</div>

						<div className="mt-2">
							<Progress value={VOCAB_COMPLETION} />
							<p className="mt-1 text-xs text-neutral-500">
								Approx. {VOCAB_COMPLETION}% of vocabulary course completed.
							</p>
						</div>
					</div>
				</CardShell>

				<CardShell title="Grammar Levels" className="bg-white">
					<div className="space-y-3 text-sm text-neutral-800">
						<p className="text-neutral-600">Follow your progress through the grammar course.</p>

						<div className="flex items-baseline justify-between">
							<div>
								<p className="text-xs uppercase tracking-wide text-neutral-500">Current Level</p>
								<p className="text-3xl font-semibold text-neutral-900">
									{GRAMMAR_LEVEL}
									<span className="ml-1 text-base font-normal text-neutral-500">
										/ {TOTAL_GRAMMAR_LEVELS}
									</span>
								</p>
							</div>
						</div>

						<div className="mt-2">
							<Progress value={GRAMMAR_COMPLETION} />
							<p className="mt-1 text-xs text-neutral-500">
								Approx. {GRAMMAR_COMPLETION}% of grammar course completed.
							</p>
						</div>
					</div>
				</CardShell>
			</section>

			{/* Blank section for practice courses */}
			<section className="mb-8">
				<CardShell title="Practice Courses" className="bg-white">
					<div className="flex min-h-[180px] items-center justify-center text-sm text-neutral-500">
						<p>Practice courses coming soon.</p>
					</div>
				</CardShell>
			</section>

			{/* Overall completion bars at the bottom */}
			<section className="space-y-4">
				<CardShell title="Overall Completion" className="bg-white">
					<div className="space-y-4 text-sm text-neutral-800">
						<div>
							<div className="mb-1 flex items-center justify-between">
								<span className="text-neutral-700">Vocabulary</span>
								<span className="text-xs text-neutral-500">{VOCAB_COMPLETION}%</span>
							</div>
							<Progress value={VOCAB_COMPLETION} />
						</div>

						<div>
							<div className="mb-1 flex items-center justify-between">
								<span className="text-neutral-700">Grammar</span>
								<span className="text-xs text-neutral-500">{GRAMMAR_COMPLETION}%</span>
							</div>
							<Progress value={GRAMMAR_COMPLETION} />
						</div>
					</div>
				</CardShell>
			</section>
		</main>
	);
}
