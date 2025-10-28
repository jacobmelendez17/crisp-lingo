import { cn } from '@/lib/utils';

export function CardShell({
	title,
	className,
	children,
	actions,
	headerClassName,
	titleClassName
}: {
	title: string;
	className?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
	headerClassName?: string;
	titleClassName?: string;
}) {
	return (
		<section className={cn('rounded-xl border border-black/5 bg-white p-8 shadow-sm', className)}>
			<header className={cn('mb-4 flex items-center justify-between', headerClassName)}>
				<h3 className={cn('text-4xl font-semibold text-neutral-800', titleClassName)}>{title}</h3>
				{actions}
			</header>
			{children}
		</section>
	);
}
