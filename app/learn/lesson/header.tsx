import Link from 'next/link';
import { X, ArrowLeft, Mail } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useExitModal } from '@/store/use-exit-modal';

export const Header = () => {
	const { open } = useExitModal();

	return (
		<header className="justify between mx-auto flex w-full max-w-[1130px] items-center gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
			<Link href="/dashboard">
				<ArrowLeft className="w06 h-6 cursor-pointer text-slate-600 transition hover:opacity-75" />
			</Link>
		</header>
	);
};
