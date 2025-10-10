'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

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
	return (
		<footer className="fixed bottom-0 left-0 right-0 flex h-[90px] items-center justify-center border-t-2 border-green-200 bg-[#fff9f5] px-6">
			<div className="flex items-center gap-20">
				<div className="flex w-[90px] justify-center">
					{currentIndex > 0 ? (
						<Button variant="leaf" onClick={backAction}>
							<ChevronLeft className="h-5 w-5" />
							<span className="hidden sm:inline">Back</span>
						</Button>
					) : (
						<div className="invisible select-none">
							<Button variant="leaf" className="flex items-center gap-1">
								<ChevronLeft className="h-5 w-5" />
								<span className="hidden sm:inline">Back</span>
							</Button>
						</div>
					)}
				</div>
				<div className="flex items-center gap-2">
					{Array.from({ length: total }).map((_, i) => (
						<div
							key={i}
							className={`h-3 w-3 rounded-full ${
								i === currentIndex ? 'bg-green-600' : 'bg-green-200'
							}`}
						/>
					))}
				</div>
				<Button variant="leaf" onClick={nextAction}>
					<span className="hidden sm:inline">Next</span>
					<ChevronRight className="h-5 w-5" />
				</Button>
			</div>
		</footer>
	);
};
