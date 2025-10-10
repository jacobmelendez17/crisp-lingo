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
		<footer className="fixed bottom-0 left-0 right-0 flex h-[90px] items-center justify-between border-t-2 border-green-200 bg-[#fff9f5] px-6">
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
			<Button>
				Next
				<ChevronRight className="h-5 w-5" />
			</Button>
			<Button>
				Back
				<ChevronLeft className="h-5 w-5" />
			</Button>
		</footer>
	);
};
