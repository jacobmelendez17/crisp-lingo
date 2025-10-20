'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useExitModal } from '@/store/use-exit-modal';

export const ExitModal = () => {
	const router = useRouter();
	const [isClient, setIsClient] = useState(false);
	const { isOpen, close } = useExitModal();

	useEffect(() => setIsClient(true), []);

	if (!isClient) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="mb-5 flex w-full items-center justify-center">
						<Image src="/otter.svg" alt="Mascot" height={80} width={80} />
					</div>
					<DialogTitle className="text-center text-5xl font-bold">Quit?</DialogTitle>
					<DialogDescription className="text-center text-2xl">
						Your progress won't save if you leave now!
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex w-full flex-row gap-x-4">
						<Button variant="outline" className="flex-1" size="lg" onClick={close}>
							Keep learning
						</Button>
						<Button
							variant="sage"
							className="flex-1"
							size="lg"
							onClick={() => {
								close();
								router.push('/dashboard');
							}}
						>
							Leave
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
