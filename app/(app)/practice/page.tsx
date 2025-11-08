// app/practice/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CardShell } from '@/components/card-shell';
import { BookOpen, Hash, Headphones, Clock, Zap, Brain, ImageIcon, Timer } from 'lucide-react';

type PracticeGame = {
	title: string;
	href: string;
	desc: string;
	icon: React.ReactNode;
	minutes: number;
	xp: number;
	color: string;
	locked?: boolean;
	comingSoon?: boolean;
};

const GAMES: PracticeGame[] = [
	{
		title: 'Verb Conjugations',
		href: '/practice/conjugations',
		desc: 'Present, past, and future drills',
		icon: <BookOpen className="size-8" />,
		minutes: 8,
		xp: 20,
		color: 'bg-[#cfe7db]'
	},
	{
		title: 'Number Practice',
		href: '/practice/numbers',
		desc: 'Listen & type or select the number',
		icon: <Hash className="size-8" />,
		minutes: 5,
		xp: 15,
		color: 'bg-[#e8efcf]'
	},
	{
		title: 'Listening Clips',
		href: '/practice/listening',
		desc: 'Short audio with quick checks',
		icon: <Headphones className="size-8" />,
		minutes: 6,
		xp: 18,
		color: 'bg-[#d7e7f3]'
	},
	{
		title: 'Speed Match',
		href: '/practice/speed',
		desc: 'Match words & meanings—fast!',
		icon: <Zap className="size-8" />,
		minutes: 3,
		xp: 12,
		color: 'bg-[#f1e4d6]'
	},
	{
		title: 'Flashcards',
		href: '/practice/flashcards',
		desc: 'Classic review with spaced timing',
		icon: <Brain className="size-8" />,
		minutes: 7,
		xp: 20,
		color: 'bg-[#e6dcf4]'
	},
	{
		title: 'Picture Match',
		href: '/practice/pictures',
		desc: 'Tap the image that fits the word',
		icon: <ImageIcon className="size-8" />,
		minutes: 4,
		xp: 14,
		color: 'bg-[#f6e9ee]'
	},
	{
		title: 'Timed Quiz',
		href: '/practice/timed',
		desc: 'Beat the clock with streaks',
		icon: <Timer className="size-8" />,
		minutes: 4,
		xp: 22,
		color: 'bg-[#dfe9ff]',
		locked: true
	}
];

function PracticeTile({ game }: { game: PracticeGame }) {
	const content = (
		<div
			className={cn(
				'relative h-full w-full rounded-2xl border border-black/5 p-5 shadow-sm',
				'transition-all hover:scale-[1.01] hover:shadow-md active:translate-y-[2px]',
				'grid grid-rows-[auto_1fr_auto] gap-4',
				game.color
			)}
		>
			{/* Lock ribbon */}
			{game.locked && (
				<div className="pointer-events-none absolute right-3 top-3 rounded-md bg-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-700">
					Locked
				</div>
			)}

			{/* Title row */}
			<div className="flex items-center gap-3">
				<div
					className={cn(
						'grid size-12 place-items-center rounded-xl bg-white/70 text-neutral-800',
						'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]'
					)}
				>
					{game.icon}
				</div>
				<h3 className="text-xl font-semibold text-neutral-900">{game.title}</h3>
			</div>

			{/* Description */}
			<p className="min-h-10 text-neutral-700">{game.desc}</p>

			{/* Meta chips */}
			<div className="mt-2 flex items-center gap-2">
				<span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm">
					<Clock className="size-4" />
					{game.minutes} min
				</span>
				<span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm">
					+{game.xp} XP
				</span>
			</div>

			{/* AC-style ground shadow / “card foot” */}
			<div className="pointer-events-none mt-2 h-2 w-28 rounded-full bg-black/10 blur-[2px]" />
		</div>
	);

	if (game.locked) {
		// Disabled look + diagonal stripes for a cozy AC “unavailable” feel
		return (
			<div className="relative">
				<div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 [background:repeating-linear-gradient(135deg,_#c9c9c9_0_10px,_#e0e0e0_10px_20px)]" />
				<div className="opacity-80 grayscale">{content}</div>
			</div>
		);
	}

	return (
		<Link
			href={game.href}
			className="focus-visible:ring-[var(--leaf)]/40 block rounded-2xl focus:outline-none focus-visible:ring-4"
		>
			{content}
		</Link>
	);
}

export default async function PracticePage() {
	return (
		<main className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:px-6">
			<header className="mb-6">
				<h1 className="text-4xl font-extrabold tracking-wide text-neutral-800">Practice</h1>
				<p className="text-neutral-600">Pick a game to sharpen a specific skill.</p>
			</header>

			{/* AC-style section frame */}
			<CardShell
				title="Mini-Games & Lessons"
				className="bg-[#acd7c7] p-6"
				titleClassName="text-neutral-800"
			>
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{GAMES.map((g) => (
						<PracticeTile key={g.title} game={g} />
					))}
				</div>
			</CardShell>
		</main>
	);
}
