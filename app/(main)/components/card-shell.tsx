import { cn } from '@/lib/utils';

export function CardShell({
	title,
	className,
	children,
	actions
}: {
	title: string;
	className?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<section className={cn('rounded-2xl border border-black/5 bg-white p-4 shadow-sm', className)}>
			<header className="justfy-between mb-3 flex items-center">
				<h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
				{actions}
			</header>
			{children}
		</section>
	);
}
