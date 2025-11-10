import { CardShell } from '@/components/card-shell';
import { Progress } from '@/components/ui/progress';

type Props = {
	level?: number;
	wordsDone?: number;
	wordsTotal?: number;
	grammarDone?: number;
	grammarTotal?: number;
	weekStreak?: number;
	currentStreak?: number;
};

export function LevelProgressCard({
	level = 1,
	wordsDone = 0,
	wordsTotal = 60,
	grammarDone = 0,
	grammarTotal = 12,
	weekStreak = 0,
	currentStreak = 0
}: Props) {
	const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
	const wordsLeft = Math.max(0, wordsTotal - wordsDone);
	const grammarLeft = Math.max(0, grammarTotal - grammarDone);
	const wordsPct = clamp(Math.round((wordsDone / wordsTotal) * 100));
	const grammarPct = clamp(Math.round((grammarDone / grammarTotal) * 100));
	const filledDots = clamp(weekStreak, 0, 7);

	return (
		<CardShell
			title="Level Progress"
			className="bg-white"
			headerClassName="items-center"
			actions={
				<span className="rounded-full bg-[#b8d9b3] px-3 py-1 text-sm font-semibold text-neutral-800">
					Level {level}
				</span>
			}
		>
			<div className="grid gap-8">
				{/* Vocabulary */}
				<section>
					<div className="mb-2 flex items-end justify-between">
						<h4 className="text-xl font-semibold text-neutral-800">Vocabulary</h4>
						<span className="text-sm text-neutral-600">
							{wordsLeft} left / {wordsTotal}
						</span>
					</div>
					<Progress value={wordsPct} className="h-3 bg-[#eaf4ee]" />
					<div className="mt-1 text-xs text-neutral-500">{wordsPct}% complete</div>
				</section>

				{/* Grammar */}
				<section>
					<div className="mb-2 flex items-end justify-between">
						<h4 className="text-xl font-semibold text-neutral-800">Grammar</h4>
						<span className="text-sm text-neutral-600">
							{grammarLeft} left / {grammarTotal}
						</span>
					</div>
					<Progress value={grammarPct} className="h-3 bg-[#eaf4ee]" />
					<div className="mt-1 text-xs text-neutral-500">{grammarPct}% complete</div>
				</section>

				{/* Streak */}
				<section className="flex items-center justify-between rounded-xl bg-neutral-50 p-4">
					<div className="flex items-center gap-2">
						{Array.from({ length: 7 }).map((_, i) => (
							<div
								key={i}
								className={`h-3 w-3 rounded-full ${i < filledDots ? 'bg-green-600' : 'bg-green-200'}`}
							/>
						))}
					</div>
					<div className="text-sm font-medium text-neutral-700">
						Current streak: <span className="font-semibold">{currentStreak}</span> days
					</div>
				</section>
			</div>
		</CardShell>
	);
}
