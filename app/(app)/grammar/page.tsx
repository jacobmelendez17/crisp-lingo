import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

import { BRAND, IMAGE } from '@/lib/constants';
import { LEVEL_RANGES, parseRangeKey } from '@/lib/learn/ranges';
import { formatNextReview } from '@/lib/learn/format';
import { groupByLevelId } from '@/lib/learn/group';
import { fetchLevels, sliceLevels, fetchVocabForLevels } from '@/lib/learn/fetch';

function formatNextReview(d: Date | null) {
	if (!d) return '—';
	const now = new Date();
	const diffMs = d.getTime() - now.getTime();
	if (diffMs <= 0) return 'Ready now';

	const minutes = Math.round(diffMs / 60000);
	if (minutes < 60) return `in ${minutes} min`;

	const hours = Math.round(minutes / 60);
	if (hours < 48) return `in ${hours} h`;

	const days = Math.round(hours / 24);
	return `in ${days} day${days === 1 ? '' : 's'}`;
}

export default async function GrammarPage() {
	const { userId } = await auth();

	const rows = userId;

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="pt-2 text-5xl font-bold text-neutral-800">Grammar</h1>

				<div className="mt-4 flex flex-wrap items-center justify-center gap-4">
					<Button>1-10</Button>
					<Button>11-20</Button>
					<Button>21-30</Button>
					<Button>31-40</Button>
					<Button>41-50</Button>
				</div>
			</div>

			<div
				className="my-6 h-[2px] w-full"
				style={{
					backgroundImage:
						'repeating-linear-gradient(to right, #a3c1ad 0 10px, transparent 10px 20px)'
				}}
			/>
		</main>
	);
}
