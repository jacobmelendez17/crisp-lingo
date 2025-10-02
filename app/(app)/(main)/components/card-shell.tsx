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
		<section
			className={cn('rounded-2xl border border-black/5 bg-[#f2ebd8] p-8 shadow-sm', className)}
		>
			<header className="mb-4 flex items-center justify-between">
				<h3 className="text-3xl font-semibold text-neutral-800">{title}</h3>
				{actions}
			</header>
			{children}
		</section>
	);
}
