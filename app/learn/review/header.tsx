import { X, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useExitModal } from '@/store/use-exit-modal';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
	percentage: number;
	//correct: number;
	//total: number;
	//remaining: number;
};

export const Header = ({ percentage }: Props) => {
	const { open } = useExitModal();

	return (
		<header className="max-w-100% mx-auto flex w-full items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
			<X onClick={open} className="cursor-pointer text-slate-500 transition hover:opacity-75" />
			<Progress value={percentage} />
			<Link href="/dashboard">
				<Image className="hover:opacity-75" src="/inbox.svg" alt="Inbox" height={70} width={70} />
			</Link>
			<Settings
				onClick={open}
				className="cursor-pointer text-slate-500 transition hover:opacity-75"
			/>
		</header>
	);
};
