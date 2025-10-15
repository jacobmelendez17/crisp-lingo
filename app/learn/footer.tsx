'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Footer = ({
	currentIndex,
	total,
	nextAction,
	backAction
}: {
	currentIndex: number;
	total: number;
	nextAction: () => void;
	backAction?: () => void;
}) => {
	const [quizUnlocked, setQuizUnlocked] = useState(currentIndex === total - 1);
	useEffect(() => {
		if (currentIndex === total - 1) setQuizUnlocked(true);
	}, [currentIndex, total]);

	return (
		<footer className="fixed bottom-0 left-0 right-0 flex h-[90px] items-center justify-center border-t-2 border-green-200 bg-[#fff9f5] px-6 backdrop-blur-2xl">
			<div className="gap-30 grid w-full max-w-[880px] grid-cols-[1fr_auto_1fr] items-center">
				<div className="flex justify-start justify-self-start pl-[120px] sm:pl-[180px]">
					{currentIndex > 0 ? (
						<Button variant="leaf" onClick={backAction}>
							<ChevronLeft className="h-5 w-5" />
							<span className="hidden sm:inline">Back</span>
						</Button>
					) : (
						<div className="invisible select-none">
							<Button variant="leaf">
								<ChevronLeft className="h-5 w-5" />
								<span className="hidden sm:inline">Back</span>
							</Button>
						</div>
					)}
				</div>

				<div className="flex items-center justify-center gap-2">
					{Array.from({ length: total }).map((_, i) => (
						<div
							key={i}
							className={`h-3 w-3 rounded-full ${i === currentIndex ? 'bg-green-600' : 'bg-green-200'}`}
						/>
					))}
				</div>

				<div className="relative flex items-center justify-center justify-self-end pr-[120px] sm:pr-[180px]">
					{currentIndex < total - 1 ? (
						<Button variant="leaf" onClick={nextAction}>
							<span className="hidden sm:inline">Next</span>
							<ChevronRight className="h-5 w-5" />
						</Button>
					) : (
						<Button variant="locked">
							<span className="hidden sm:inline">Next</span>
							<ChevronRight className="h-5 w-5" />
						</Button>
					)}

					<div
						className={`${quizUnlocked ? '' : 'invisible'} absolute right-6 w-[148px]`}
						aria-hidden={!quizUnlocked}
					>
						<Button variant="leaf" asChild>
							<Link href="/learn/lesson/quiz">
								<span className="hidden sm:inline">Start Quiz</span>
								<ChevronRight className="h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</footer>
	);
};
