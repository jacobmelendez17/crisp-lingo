import { CardShell } from '@/components/card-shell';
import Link from 'next/link';

export function UserProgressCard() {
	return (
		<CardShell title="Total Progress" className="mt-4 bg-white">
			<div className="space-y-4 text-sm text-neutral-800">
				<div className="flex items-center justify-between">
					<span className="text-neutral-600">Vocabulary Learned</span>
					<span className="font-semibold text-neutral-900"></span>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-neutral-600">Grammar Learned</span>
					<span className="font-semibold text-neutral-900"></span>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-neutral-600">Reviews due</span>
					<span className="font-semibold text-neutral-900"></span>
				</div>

				<div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
					<div className="h-full rounded-full bg-[#97ac82]" style={{ width: '10%' }} />
				</div>
			</div>

			<div className="mt-6">
				<Link
					href="/progress"
					className="block w-full rounded-xl bg-[#97ac82] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#8aa578]"
				>
					Full Progress
				</Link>
			</div>
		</CardShell>
	);
}
