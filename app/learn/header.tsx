import { X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useExitModal } from '@/store/use-exit-modal';

type Props = {
	percentage: number;
};

export const Header = ({ percentage }: Props) => {
	const { open } = useExitModal();

	return (
		<header className="justify between mx-auto flex w-full max-w-[1140px] items-center gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
			<X onClick={open} className="cursor-pointer text-slate-500 transition hover:opacity-75" />
			<Progress value={percentage} />
		</header>
	);
};
