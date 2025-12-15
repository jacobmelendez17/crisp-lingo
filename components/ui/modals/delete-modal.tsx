'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteModal } from '@/store/use-delete-modal';

export function DeleteModal() {
	const [isClient, setIsClient] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { isOpen, action, close } = useDeleteModal();

	useEffect(() => setIsClient(true), []);

	const copy = useMemo(() => {
		switch (action) {
			case 'reset_vocab':
				return {
					title: 'Reset vocabulary?',
					description:
						'This will erase your vocabulary SRS progress, due dates, and review history. This can’t be undone.',
					confirmText: 'Reset vocabulary'
				};
			case 'reset_grammar':
				return {
					title: 'Reset grammar?',
					description:
						'This will erase your grammar SRS progress and review history. This can’t be undone.',
					confirmText: 'Reset grammar'
				};
			case 'reset_account':
				return {
					title: 'Reset account progress?',
					description:
						'This will reset vocabulary + grammar progress and your overall stats. This can’t be undone.',
					confirmText: 'Reset account'
				};
			case 'delete_account':
				return {
					title: 'Delete account?',
					description:
						'This will permanently delete your account data from Crisp Lingo. This can’t be undone.',
					confirmText: 'Delete account'
				};
			default:
				return null;
		}
	}, [action]);

	if (!isClient || !isOpen || !copy) return null;

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="mb-5 flex w-full items-center justify-center">
						<Image src="/otter.svg" alt="Mascot" height={80} width={80} />
					</div>
					<DialogTitle className="text-center text-4xl font-bold">{copy.title}</DialogTitle>
					<DialogDescription className="text-center text-base">
						{copy.description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<div className="flex w-full flex-row gap-x-4">
						<Button
							variant="outline"
							className="flex-1"
							size="lg"
							disabled={isPending}
							onClick={close}
						>
							Cancel
						</Button>

						<Button
							variant={action === 'delete_account' ? 'destructive' : 'sage'}
							className="flex-1"
							size="lg"
							disabled={isPending}
							onClick={() => {
								startTransition(async () => {
									// TODO: call your server action here based on `action`
									// await runDangerAction(action)

									close();
								});
							}}
						>
							{copy.confirmText}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
