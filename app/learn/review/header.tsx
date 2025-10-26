import { X, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useExitModal } from '@/store/use-exit-modal';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
	percentage: number;
	correct: number;
	total: number;
	remaining: number;
};

export const Header = ({ percentage, correct, total, remaining }: Props) => {
	const { open } = useExitModal();

	return (
		<header className="relative mx-auto flex w-full max-w-[1200px] items-center justify-between px-10 pt-[20px] lg:pt-[50px]">
			<div className="gap-15 flex items-center">
				<X
					onClick={open}
					className="h-6 w-6 cursor-pointer text-slate-500 transition hover:opacity-75"
				/>
				<Settings
					onClick={open}
					className="h-6 w-6 cursor-pointer text-slate-500 transition hover:opacity-75"
				/>
			</div>

			<div className="absolute left-1/2 w-[600px] max-w-[80vw] -translate-x-1/2 -translate-y-1/2">
				<Progress value={percentage} />
			</div>

			<div className="ml-auto flex items-center gap-8">
				<div className="text-right">
					<div className="text-2xl font-semibold text-slate-800">
						{correct}/{total}
					</div>
				</div>
				<div className="flex items-center">
					<Image src="/inbox.svg" alt="Inbox" height={60} width={60} />
					<span className="text-2xl font-bold text-slate-700">{remaining}</span>
				</div>
			</div>
		</header>
	);
};
