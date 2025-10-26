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
		<header className="mx-auto flex w-full max-w-[1000px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
			<X onClick={open} className="cursor-pointer text-slate-500 transition hover:opacity-75" />
			<Settings
				onClick={open}
				className="cursor-pointer text-slate-500 transition hover:opacity-75"
			/>

			<div className="flex flex-1 justify-center">
				<Progress value={percentage} className="w-[600px] max-w-full" />
			</div>

			<div className="ml-auto flex items-center gap-6">
				<div className="text-right">
					<div className="text-lg font-semibold text-slate-800">
						{correct}/{total}
					</div>
				</div>
				<div className="relative block">
					<Image className="hover:opacity-75" src="/inbox.svg" alt="Inbox" height={70} width={70} />
					<span className="absolute -right-2 -top-2 min-w-[20px] rounded-full bg-red-500 px-1.5 py-[1px] text-center text-xs font-bold text-white">
						{remaining}
					</span>
				</div>
			</div>
		</header>
	);
};
