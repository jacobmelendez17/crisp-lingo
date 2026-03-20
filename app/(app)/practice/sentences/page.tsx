'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Blocks,
	FilePenLine,
	Languages,
	PencilLine,
	CheckCircle2
} from 'lucide-react';

type PracticeMode = {
	id: 'builder' | 'fill-blank' | 'translate';
	title: string;
	description: string;
	icon: React.ReactNode;
};

type BuilderAnswerStyle = 'blocks' | 'typing';

const MODES: PracticeMode[] = [
	{
		id: 'builder',
		title: 'Sentence Builder',
		description: 'Build the full Spanish sentence from a prompt.',
		icon: <Blocks className="size-6" />
	},
	{
		id: 'fill-blank',
		title: 'Fill in the Blank',
		description: 'Type the missing Spanish word in a sentence.',
		icon: <FilePenLine className="size-6" />
	},
	{
		id: 'translate',
		title: 'Translate the Sentence',
		description: 'Read a Spanish sentence and type its English meaning.',
		icon: <Languages className="size-6" />
	}
];

export default function SentencePracticeSetupPage() {
	const [selectedMode, setSelectedMode] =
		useState<PracticeMode['id']>('builder');
	const [builderAnswerStyle, setBuilderAnswerStyle] =
		useState<BuilderAnswerStyle>('blocks');

	const activeMode =
		MODES.find((mode) => mode.id === selectedMode) ?? MODES[0];

	const startHref = useMemo(() => {
		if (selectedMode === 'builder') {
			return builderAnswerStyle === 'blocks'
				? '/practice/sentences/builder'
				: '/practice/sentences/builder-typing';
		}

		if (selectedMode === 'fill-blank') {
			return '/practice/sentences/fill-blanks';
		}

		return '/practice/sentences/translate';
	}, [selectedMode, builderAnswerStyle]);

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#f6fbf7]">
			<div className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-6">
				<header className="mx-auto mb-10 max-w-2xl text-center">
					<p className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-500">
						Sentence Practice
					</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
						Choose your practice
					</h1>
					<p className="mt-4 text-base leading-7 text-neutral-600">
						Pick a sentence mode, then start your session.
					</p>
				</header>

				<div className="grid gap-8 lg:grid-cols-[1fr_360px]">
					<section className="space-y-4">
						{MODES.map((mode) => {
							const isSelected = selectedMode === mode.id;

							return (
								<button
									key={mode.id}
									type="button"
									onClick={() => setSelectedMode(mode.id)}
									className={cn(
										'w-full rounded-[1.75rem] border bg-white p-5 text-left shadow-sm transition-all duration-200',
										isSelected
											? 'border-neutral-900 shadow-md'
											: 'border-black/5 hover:-translate-y-0.5 hover:shadow-md'
									)}
								>
									<div className="flex items-start gap-4">
										<div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eef6f0] text-neutral-800">
											{mode.icon}
										</div>

										<div className="flex-1">
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
										</div>
									</div>
								</button>
							);
						})}
					</section>

					<aside className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
						<h3 className="text-2xl font-semibold text-neutral-900">
							{activeMode.title}
						</h3>

						<p className="mt-2 text-sm leading-6 text-neutral-600">
							{activeMode.description}
						</p>

						{selectedMode === 'builder' && (
							<div className="mt-6">
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
									Answer style
								</p>

								<div className="mt-3 grid grid-cols-2 gap-3">
									<button
										type="button"
										onClick={() => setBuilderAnswerStyle('blocks')}
										className={cn(
											'rounded-2xl border px-4 py-4 text-left transition',
											builderAnswerStyle === 'blocks'
												? 'border-neutral-900 bg-[#f8fbf8]'
												: 'border-black/5 bg-white hover:bg-[#fafcfb]'
										)}
									>
										<div className="flex items-center gap-3">
											<Blocks className="size-5 text-neutral-800" />
											<div>
												<p className="font-semibold text-neutral-900">Blocks</p>
												<p className="text-xs text-neutral-600">
													Tap chunks in order
												</p>
											</div>
										</div>
									</button>

									<button
										type="button"
										onClick={() => setBuilderAnswerStyle('typing')}
										className={cn(
											'rounded-2xl border px-4 py-4 text-left transition',
											builderAnswerStyle === 'typing'
												? 'border-neutral-900 bg-[#f8fbf8]'
												: 'border-black/5 bg-white hover:bg-[#fafcfb]'
										)}
									>
										<div className="flex items-center gap-3">
											<PencilLine className="size-5 text-neutral-800" />
											<div>
												<p className="font-semibold text-neutral-900">Typing</p>
												<p className="text-xs text-neutral-600">
													Type the full sentence
												</p>
											</div>
										</div>
									</button>
								</div>
							</div>
						)}

						<div className="mt-8 space-y-3">
							<Button asChild size="lg" className="w-full">
								<Link href={startHref}>
									Start
								</Link>
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