import { X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useExitModal } from '@/store/use-exit-modal';

type Props = {
	percentage: number;
	//correct: number;
	//total: number;
	//remaining: number;
};

export const Header = ({ percentage }: Props) => {
	const { open } = useExitModal();

	return (
		<header className="justify between max-w-100% mx-auto flex w-full items-center gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
			<X onClick={open} className="cursor-pointer text-slate-500 transition hover:opacity-75" />
			<Progress value={percentage} />
		</header>
	);
};
