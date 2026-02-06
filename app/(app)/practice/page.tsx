'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { CardShell } from '@/components/card-shell';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
	BookOpen,
	Hash,
	Headphones,
	Clock,
	Zap,
	Brain,
	ImageIcon,
	Star
} from 'lucide-react';

type PracticeGame = {
	title: string;
	href: string;
	desc: string;
	icon: React.ReactNode;
	minutes: number;
	xp: number;

	// new
	color: string; // card background tint
	imageSrc: string; // right-side illustration
	imageAlt: string;
	locked?: boolean;
	comingSoon?: boolean;
};

const FAVORITES_KEY = 'crispLingo.practiceFavorites.v1';

const GAMES: PracticeGame[] = [
	{
		title: 'Verb Conjugations',
		href: '/practice/exercises/conjugations',
		desc: 'Present, past, and future drills',
		icon: <BookOpen className="size-8" />,
		minutes: 8,
		xp: 20,
		color: 'bg-[#dff0e8]',
		imageSrc: '/practice/microscope.png',
		imageAlt: 'Microscope'
	},
	{
		title: 'Number Practice',
		href: '/practice/numbers',
		desc: 'Listen & type or select the number',
		icon: <Hash className="size-8" />,
		minutes: 5,
		xp: 15,
		color: 'bg-[#eef5d9]',
		imageSrc: '/practice/calculator.png',
		imageAlt: 'Calculator'
	},
	{
		title: 'Listening',
		href: '/practice/listening',
		desc: 'Short audio with quick checks',
		icon: <Headphones className="size-8" />,
		minutes: 6,
		xp: 18,
		color: 'bg-[#e4eef8]',
		imageSrc: '/practice/headphones.png',
		imageAlt: 'Headphones'
	},
	{
		title: 'Grocery Store',
		href: '/practice/speed',
		desc: 'Match words & meanings—fast!',
		icon: <Zap className="size-8" />,
		minutes: 3,
		xp: 12,
		color: 'bg-[#f3eadf]',
		imageSrc: '/practice/cart.png',
		imageAlt: 'Shopping cart'
	},
	{
		title: 'Decks',
		href: '/practice/flashcards',
		desc: 'Classic review with spaced timing',
		icon: <Brain className="size-8" />,
		minutes: 7,
		xp: 20,
		color: 'bg-[#eee6f8]',
		imageSrc: '/practice/cards.png',
		imageAlt: 'Flash cards'
	},
	{
		title: 'Hospital',
		href: '/practice/pictures',
		desc: 'Tap the image that fits the word',
		icon: <ImageIcon className="size-8" />,
		minutes: 4,
		xp: 14,
		color: 'bg-[#f7e9ef]',
		imageSrc: '/practice/clipboard.png',
		imageAlt: 'Clipboard'
	}
];

function loadFavorites(): Record<string, boolean> {
	if (typeof window === 'undefined') return {};
	try {
		const raw = localStorage.getItem(FAVORITES_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function saveFavorites(map: Record<string, boolean>) {
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(map));
	} catch {
		// ignore
	}
}

function PracticeTile({
	game,
	isFavorite,
	onToggleFavorite
}: {
	game: PracticeGame;
	isFavorite: boolean;
	onToggleFavorite: () => void;
}) {
	const disabled = !!game.locked || !!game.comingSoon;

	const CardInner = (
		<div
			className={cn(
				'relative h-full w-full overflow-hidden rounded-2xl border border-black/5 p-5 shadow-sm',
				'transition-transform считает', // (removed; no-op)
				'transition-all duration-500 ease-out',
				'hover:scale-[1.02] hover:shadow-md active:scale-[0.99]',
				'grid grid-rows-[auto_1fr_auto] gap-4',
				game.color,
				disabled && 'opacity-80 grayscale'
			)}
		>
			{/* Right illustration (partially off-card) */}
			<div className="pointer-events-none absolute -right-5 top-1/2 h-28 w-28 -translate-y-1/2 opacity-90">
				<Image
					src={game.imageSrc}
					alt={game.imageAlt}
					fill
					className="object-contain"
					sizes="112px"
					priority={false}
				/>
			</div>

			{/* Favorite star */}
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault(); // don't navigate
					e.stopPropagation();
					onToggleFavorite();
				}}
				className={cn(
					'absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-xl',
					'bg-white/70 shadow-sm transition hover:bg-white'
				)}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				<Star
					className={cn(
						'size-5',
						isFavorite ? 'text-[#f2b84b]' : 'text-neutral-700'
					)}
					// lucide uses stroke by default; fill for "filled star"
					fill={isFavorite ? 'currentColor' : 'none'}
				/>
			</button>

			{/* Optional status ribbon */}
			{game.locked && (
				<div className="pointer-events-none absolute left-3 top-3 rounded-md bg-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-700">
					Locked
				</div>
			)}
			{game.comingSoon && (
				<div className="pointer-events-none absolute left-3 top-3 rounded-md bg-white/70 px-2 py-0.5 text-xs font-semibold text-neutral-700">
					Coming soon
				</div>
			)}

			<div className="flex items-center gap-3 pr-24">
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

			<p className="min-h-10 pr-24 text-neutral-700">{game.desc}</p>

			<div className="mt-1 flex items-center gap-2">
				<span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm">
					<Clock className="size-4" />
					{game.minutes} min
				</span>
				<span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm">
					+{game.xp} XP
				</span>
			</div>

			<div className="pointer-events-none mt-2 h-2 w-28 rounded-full bg-black/10 blur-[2px]" />
		</div>
	);

	if (disabled) {
		return (
			<div className="relative">
				<div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 [background:repeating-linear-gradient(135deg,_#c9c9c9_0_10px,_#e0e0e0_10px_20px)]" />
				<div>{CardInner}</div>
			</div>
		);
	}

	return (
		<Link
			href={game.href}
			className="block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--leaf)]/40"
		>
			{CardInner}
		</Link>
	);
}

export default function PracticePage() {
	const [favorites, setFavorites] = useState<Record<string, boolean>>({});
	const [favoritesOnly, setFavoritesOnly] = useState(false);

	useEffect(() => {
		setFavorites(loadFavorites());
	}, []);

	const visibleGames = useMemo(() => {
		if (!favoritesOnly) return GAMES;
		return GAMES.filter((g) => favorites[g.href]);
	}, [favoritesOnly, favorites]);

	const toggleFavorite = (href: string) => {
		setFavorites((prev) => {
			const next = { ...prev, [href]: !prev[href] };
			// clean falsy keys if you want:
			if (!next[href]) delete next[href];
			saveFavorites(next);
			return next;
		});
	};

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#fde7e1]">
			<div className="mx-auto w-full max-w-[1100px] px-4 py-10 lg:px-6">
				{/* Centered header like screenshot */}
				<header className="mx-auto mb-8 max-w-xl text-center">
					<h1 className="text-5xl font-extrabold tracking-wide text-neutral-800">
						Practice
					</h1>

					<div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<p className="text-neutral-700">
							Pick a game to sharpen a specific skill.
						</p>

						<div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
							<Switch
								id="favorites-only"
								checked={favoritesOnly}
								onCheckedChange={setFavoritesOnly}
							/>
							<Label
								htmlFor="favorites-only"
								className="cursor-pointer text-sm font-medium text-neutral-800"
							>
								Favorites only
							</Label>
						</div>
					</div>
				</header>

				{/* No colored wrapper — just the grid */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{visibleGames.map((g) => (
						<PracticeTile
							key={g.title}
							game={g}
							isFavorite={!!favorites[g.href]}
							onToggleFavorite={() => toggleFavorite(g.href)}
						/>
					))}
				</div>

				{/* Empty state if favorites-only has none */}
				{favoritesOnly && visibleGames.length === 0 && (
					<div className="mx-auto mt-10 max-w-md rounded-2xl bg-white/70 p-6 text-center shadow-sm">
						<p className="text-sm text-neutral-700">
							No favorites yet — tap the star on a practice card to add one.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
