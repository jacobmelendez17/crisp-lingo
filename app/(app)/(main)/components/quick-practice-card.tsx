import Link from 'next/link';
import { CardShell } from '@/components/card-shell';
import { cn } from '@/lib/utils';

type Props = {
	href?: string;
	title?: string;
	description?: string;
	className?: string;
};

export function QuickPracticeCard({
	href = '/practice/random',
	title = 'Quick Practice',
	description = 'Jump into a random review session.',
	className
}: Props) {
	return (
		<Link href={href} className="group block">
			<CardShell
				title={title}
				className={cn(
					'cursor-pointer bg-white transition-all',
					'hover:-translate-y-[2px] hover:shadow-md',
					'active:translate-y-0',
					className
				)}
			>
				<p className="text-sm text-neutral-600">{description}</p>

				<div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3bc6c4]">
					Start →
				</div>
			</CardShell>
		</Link>
	);
}
