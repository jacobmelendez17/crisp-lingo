import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { useExitModal } from '@/store/use-exit-modal';

export const Header = () => {
	const { open } = useExitModal();

	return (
		<header className="mx-auto flex w-full max-w-[1130px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
			<Link href="/dashboard">
				<ArrowLeft className="h-6 w-6 cursor-pointer text-slate-600 transition hover:opacity-75" />
			</Link>
		</header>
	);
};
