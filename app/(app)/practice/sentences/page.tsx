'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Blocks,
	FilePenLine,
	Languages,
	Volume2,
	CheckCircle2,
	Sparkles
} from 'lucide-react';

type SentenceMode = {
	id: string;
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	accent: string;
	bg: string;
	highlights: string[];
};

const MODES: SentenceMode[] = [
	{
		id: 'builder',
		title: 'Sentence Builder',
		description:
			'Build the sentence yourself from word blocks after seeing an English prompt or hearing Spanish audio.',
		href: '/practice/sentences/builder',
		icon: <Blocks className="size-6" />,
		accent: 'text-emerald-700',
		bg: 'bg-emerald-50',
		highlights: ['Word blocks', 'English or audio prompt', 'Great for structure']
	},
	{
		id: 'fill-blank',
		title: 'Fill in the Blank',
		description:
			'Read the sentence and type the missing Spanish word to strengthen recall in context.',
		href: '/practice/sentences/fill-blanks',
		icon: <FilePenLine className="size-6" />,
		accent: 'text-sky-700',
		bg: 'bg-sky-50',
		highlights: ['Context clues', 'Typing practice', 'Fast reps']
	},
	{
		id: 'translate',
		title: 'Type the Translation',
		description:
			'See a Spanish sentence and type the English meaning yourself.',
		href: '/practice/sentences/translate',
		icon: <Languages className="size-6" />,
		accent: 'text-violet-700',
		bg: 'bg-violet-50',
		highlights: ['Full sentence meaning', 'Reading practice', 'Higher difficulty']
	}
];

export default function SentencePracticePage() {
	const [selectedMode, setSelectedMode] = useState<string>(MODES[0].id);

	const activeMode =
		MODES.find((mode) => mode.id === selectedMode) ?? MODES[0];

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#f6fbf7]">
			<div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-10 lg:px-6">
				<header className="mx-auto mb-10 max-w-2xl text-center">
					<p className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-500">
						Sentence Practice
					</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
						Choose a practice mode
					</h1>
					<p className="mt-4 text-base leading-7 text-neutral-600">
						Practice sentence structure, word recall, and translation in a few
						different ways. Pick the mode you want to train today.
					</p>
				</header>

				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<section className="grid gap-4">
						{MODES.map((mode) => {
							const isSelected = selectedMode === mode.id;

							return (
								<button
									key={mode.id}
									type="button"
									onClick={() => setSelectedMode(mode.id)}
									className={cn(
										'w-full rounded-[1.75rem] border p-5 text-left transition-all duration-200',
										'hover:-translate-y-0.5 hover:shadow-md',
										isSelected
											? 'border-neutral-900 bg-white shadow-md'
											: 'border-black/5 bg-white/80 shadow-sm'
									)}
								>
									<div className="flex items-start gap-4">
										<div
											className={cn(
												'grid size-12 shrink-0 place-items-center rounded-2xl',
												mode.bg,
												mode.accent
											)}
										>
											{mode.icon}
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-3">
												<h2 className="text-xl font-semibold text-neutral-900">
													{mode.title}
												</h2>

												{isSelected && (
													<span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white">
														<CheckCircle2 className="size-3.5" />
														Selected
													</span>
												)}
											</div>

											<p className="mt-2 text-sm leading-6 text-neutral-600">
												{mode.description}
											</p>

											<div className="mt-4 flex flex-wrap gap-2">
												{mode.highlights.map((item) => (
													<span
														key={item}
														className="rounded-full border border-black/5 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700"
													>
														{item}
													</span>
												))}
											</div>
										</div>
									</div>
								</button>
							);
						})}
					</section>

					<aside className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
						<div
							className={cn(
								'mb-5 inline-flex rounded-2xl p-3',
								activeMode.bg,
								activeMode.accent
							)}
						>
							{activeMode.icon}
						</div>

						<h3 className="text-2xl font-semibold text-neutral-900">
							{activeMode.title}
						</h3>

						<p className="mt-3 text-sm leading-6 text-neutral-600">
							{activeMode.description}
						</p>

						<div className="mt-6 rounded-2xl border border-black/5 bg-[#f8faf8] p-4">
							<p className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
								<Sparkles className="size-4" />
								How this mode works
							</p>

							{activeMode.id === 'builder' && (
								<div className="mt-3 space-y-3 text-sm text-neutral-600">
									<p>
										You’ll get an English prompt or Spanish audio, then assemble the
										correct Spanish sentence from shuffled chunks.
									</p>
									<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
										<Volume2 className="size-4 text-neutral-500" />
										<span>Can later support audio-first practice very naturally.</span>
									</div>
								</div>
							)}

							{activeMode.id === 'fill-blank' && (
								<div className="mt-3 space-y-3 text-sm text-neutral-600">
									<p>
										A sentence appears with one word missing. The learner types the
										word that best completes it.
									</p>
									<div className="rounded-xl bg-white px-3 py-2 text-neutral-700">
										Example: <span className="font-medium">La niña ____ un libro.</span>
									</div>
								</div>
							)}

							{activeMode.id === 'translate' && (
								<div className="mt-3 space-y-3 text-sm text-neutral-600">
									<p>
										The learner reads a full Spanish sentence and types the English
										translation from memory.
									</p>
									<div className="rounded-xl bg-white px-3 py-2 text-neutral-700">
										Example: <span className="font-medium">La niña lee un libro.</span>
									</div>
								</div>
							)}
						</div>

						<div className="mt-6 flex flex-col gap-3">
							<Button asChild size="lg" className="w-full">
								<Link href={activeMode.href}>Start {activeMode.title}</Link>
							</Button>

							<Button asChild variant="outline" size="lg" className="w-full">
								<Link href="/practice">Back to Practice</Link>
							</Button>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}