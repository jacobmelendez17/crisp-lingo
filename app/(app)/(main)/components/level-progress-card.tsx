import { CardShell } from '@/components/card-shell';
import { Progress } from '@/components/ui/progress';

type Props = {
  level?: number;
  wordsDone?: number;    // how many completed
  wordsTotal?: number;   // default 60
  grammarDone?: number;  // how many completed
  grammarTotal?: number; // default 12
  weekStreak?: number;   // 0–7 dots filled
  currentStreak?: number; // total-day streak number
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
  const wordsLeft = Math.max(0, wordsTotal - wordsDone);
  const grammarLeft = Math.max(0, grammarTotal - grammarDone);
  const wordsPct = Math.min(100, Math.round((wordsDone / wordsTotal) * 100));
  const grammarPct = Math.min(100, Math.round((grammarDone / grammarTotal) * 100));
  const filledDots = Math.max(0, Math.min(7, weekStreak));

  return (
    <CardShell
      title="Level Progress"
      className="min-h-[320px] bg-white"
      actions={
        <span className="rounded-full bg-[#b8d9b3] px-3 py-1 text-sm font-semibold text-neutral-800">
          Level {level}
        </span>
      }
    >
      <div className="grid gap-8">
        {/* Words */}
        <section>
          <div className="mb-2 flex items-end justify-between">
            <h4 className="text-lg font-semibold text-neutral-800">Vocabulary</h4>
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
            <h4 className="text-lg font-semibold text-neutral-800">Grammar</h4>
            <span className="text-sm text-neut
