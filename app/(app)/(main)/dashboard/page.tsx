import { LearnCard } from '../components/learn-card';
import { ReviewCard } from '../components/review-card';
import { ForecastCard } from '../components/forecast-card';
import { ActivityCard } from '../components/activity-card';
import { LevelProgressCard } from '../components/level-progress-card';
import { ProgressCard } from '../components/progress-card';

export default async function DashboardPage() {
	return (
		<main className="mx-auto w-full max-w-[1200px] px-4 py-6 lg:px-6">
			<div className="grid gap-6 pt-10 lg:grid-cols-[1fr_360px]">
				<div className="grid gap-6">
					<div className="grid gap-6 sm:grid-cols-2">
						<LearnCard />
						<ReviewCard />
					</div>
					<ForecastCard />
					<ActivityCard />
					<ProgressCard />
				</div>
				<aside className="h-fit lg:sticky lg:top-6">
					<LevelProgressCard />
				</aside>
			</div>
		</main>
	);
}
