import { cn } from '@/lib/utils';

export function CardShell({
	title,
	className,
	children,
	actions,
	titleClassName
}: {
	title: string;
	className?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
	titleClassName?: string;
}) {
	return (
		<section
			className={cn('rounded-xl border border-black/5 bg-[#acd7c7] p-8 shadow-sm', className)}
		>
			<header className="mb-4 flex items-center justify-between">
				<h3 className={cn('text-3xl font-semibold text-neutral-800', titleClassName)}>{title}</h3>
				{actions}
			</header>
			{children}
		</section>
	);
}
