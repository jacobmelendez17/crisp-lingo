'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SentencePart = {
	id: string;
	text: string;
	translation: string;
	pos: string;
};

type SentenceItem = {
	id: number;
	spanish: string;
	english: string;
	parts: SentencePart[];
};

const SENTENCES: SentenceItem[] = [
	{
		id: 1,
		spanish: 'La niña lee un libro en la casa.',
		english: 'The girl reads a book in the house.',
		parts: [
			{ id: '1', text: 'La niña', translation: 'the girl', pos: 'subject' },
			{ id: '2', text: 'lee', translation: 'reads', pos: 'verb' },
			{ id: '3', text: 'un libro', translation: 'a book', pos: 'direct object' },
			{ id: '4', text: 'en la casa', translation: 'in the house', pos: 'prepositional phrase' }
		]
	}
];

const TOKEN_COLORS = [
	'bg-emerald-200/80 text-emerald-950 hover:bg-emerald-300/90',
	'bg-sky-200/80 text-sky-950 hover:bg-sky-300/90',
	'bg-amber-200/90 text-amber-950 hover:bg-amber-300/90',
	'bg-rose-200/80 text-rose-950 hover:bg-rose-300/90',
	'bg-violet-200/80 text-violet-950 hover:bg-violet-300/90',
	'bg-teal-200/80 text-teal-950 hover:bg-teal-300/90',
	'bg-orange-200/80 text-orange-950 hover:bg-orange-300/90',
	'bg-fuchsia-200/80 text-fuchsia-950 hover:bg-fuchsia-300/90'
];

export default function SentencePracticePage() {
	const [index, setIndex] = useState(0);
	const [isDissected, setIsDissected] = useState(false);

	const current = SENTENCES[index];

	const parts = useMemo(() => {
		return current.parts.map((part, i) => ({
			...part,
			colorClass: TOKEN_COLORS[i % TOKEN_COLORS.length]
		}));
	}, [current]);

	function handleNext() {
		setIndex((prev) => (prev + 1) % SENTENCES.length);
		setIsDissected(false);
	}

	return (
		<div className="min-h-[calc(100vh-5rem)] bg-[#f6fbf7] px-6 py-10">
			<div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col">
				<div className="mb-10 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
							Sentence Practice
						</p>
						<h1 className="text-3xl font-semibold text-neutral-800">Prototype</h1>
					</div>

					<div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm">
						{index + 1} / {SENTENCES.length}
					</div>
				</div>

				<div className="flex flex-1 flex-col items-center justify-center">
					<div className="w-full max-w-5xl rounded-[2rem] border border-black/5 bg-white/90 px-8 py-12 shadow-sm md:px-12 md:py-16">
						<div className="mb-12 min-h-[260px]">
							<div className="flex min-h-[260px] flex-col items-center justify-center">
								<p className="mb-8 text-sm uppercase tracking-[0.25em] text-neutral-400">
									Spanish sentence
								</p>

								<motion.div
									layout
									transition={{
										layout: {
											type: 'spring',
											stiffness: 260,
											damping: 26
										}
									}}
									className={cn(
										'flex flex-wrap items-center justify-center',
										isDissected ? 'gap-x-3 gap-y-6' : 'gap-x-3.5 gap-y-2'
									)}
								>
									{parts.map((part, i) => (
										<motion.div
											key={`${current.id}-${part.id}`}
											layout
											transition={{
												layout: {
													type: 'spring',
													stiffness: 280,
													damping: 28
												}
											}}
											className="flex items-center"
										>
											<WordToken
												part={part}
												isDissected={isDissected}
												isLast={i === parts.length - 1}
											/>

											<AnimatePresence>
												{isDissected && i < parts.length - 1 ? (
													<motion.span
														initial={{ opacity: 0, scale: 0.7, y: 6 }}
														animate={{ opacity: 1, scale: 1, y: 0 }}
														exit={{ opacity: 0, scale: 0.7, y: -4 }}
														transition={{ duration: 0.2, delay: i * 0.02 }}
														className="mx-2 text-2xl font-light text-neutral-400"
													>
														+
													</motion.span>
												) : null}
											</AnimatePresence>
										</motion.div>
									))}
								</motion.div>

								<motion.p
									layout
									animate={{ opacity: isDissected ? 1 : 0.7 }}
									className="mt-8 text-center text-sm text-neutral-500"
								>
									{isDissected
										? 'Hover a phrase to see its translation and grammar role.'
										: 'Tap Dissect to spread the sentence apart.'}
								</motion.p>
							</div>
						</div>

						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								variant="outline"
								size="lg"
								className="min-w-[180px]"
								onClick={() => setIsDissected((prev) => !prev)}
							>
								{isDissected ? 'Hide dissect' : 'Dissect'}
							</Button>

							<Button
								size="lg"
								className="min-w-[180px]"
								onClick={handleNext}
							>
								Next
							</Button>
						</div>

						<div className="mt-8 text-center">
							<p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
								Reference translation
							</p>
							<p className="mt-2 text-base text-neutral-600">{current.english}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function WordToken({
	part,
	isDissected,
	isLast
}: {
	part: SentencePart & { colorClass: string };
	isDissected: boolean;
	isLast: boolean;
}) {
	return (
		<div className="group relative">
			<motion.div
				layout
				transition={{
					layout: {
						type: 'spring',
						stiffness: 300,
						damping: 30
					}
				}}
				animate={{
					scale: isDissected ? 0.94 : 1,
					borderRadius: isDissected ? 18 : 10
				}}
				className={cn(
					'relative cursor-default select-none font-semibold text-neutral-800 transition-all duration-200',
					isDissected
						? cn(
								'px-4 py-3 shadow-sm',
								part.colorClass
						  )
						: 'bg-transparent px-0 py-0 text-3xl md:text-5xl'
				)}
			>
				{part.text}
				{!isDissected && !isLast ? ' ' : ''}
			</motion.div>

			{isDissected ? (
				<div
					className={cn(
						'pointer-events-none absolute left-1/2 top-0 z-30 w-max max-w-[240px] -translate-x-1/2',
						'-translate-y-[calc(100%+14px)] rounded-xl border border-black/5 bg-white px-3 py-2 text-center shadow-lg',
						'opacity-0 transition-all duration-200',
						'group-hover:-translate-y-[calc(100%+20px)] group-hover:opacity-100'
					)}
				>
					<p className="text-sm font-semibold text-neutral-800">{part.translation}</p>
					<p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">{part.pos}</p>
				</div>
			) : null}
		</div>
	);
}