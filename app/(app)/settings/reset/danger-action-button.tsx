'use client';

import { Button } from '@/components/ui/button';
import { useDeleteModal, DangerActionType } from '@/store/use-delete-modal';

export function DangerActionButton({
	action,
	children,
	variant = 'outline'
}: {
	action: DangerActionType;
	children: React.ReactNode;
	variant?: 'outline' | 'destructive' | 'sage';
}) {
	const { open } = useDeleteModal();

	return (
		<Button variant={variant} size="sm" onClick={() => open(action)}>
			{children}
		</Button>
	);
}
