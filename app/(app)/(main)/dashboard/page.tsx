import { LearnCard } from '../components/learn-card';
import { ReviewCard } from '../components/review-card';
import { ForecastCard } from '../components/forecast-card';
import { ActivityCard } from '../components/activity-card';
import { LevelProgressCard } from '../components/level-progress-card';
import { ProgressCard } from '../components/progress-card';
import { UserProgressCard } from '../components/user-progress-card';
import { QuickPracticeCard } from '../components/quick-practice-card';

export default async function DashboardPage() {
	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<div className="grid gap-6 pt-10 lg:grid-cols-[1fr_360px]">
				<div className="grid gap-6">
					<div className="grid gap-6 sm:grid-cols-2">
						<LearnCard />
						<ReviewCard />
					</div>
					<ForecastCard />
					<ActivityCard />
				</div>
				<aside className="h-fit lg:top-6">
					<LevelProgressCard />
					<UserProgressCard />
				</aside>
				<div className="col-span-full lg:col-[1/-1]">
					<ProgressCard />
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<QuickPracticeCard />

						<QuickPracticeCard
							title="Random Vocabulary"
							description="Practice a surprise set of vocab."
							href="/practice/random?vocab"
						/>

						<QuickPracticeCard
							title="Random Grammar"
							description="Test yourself on grammar patterns."
							href="/practice/random?grammar"
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
