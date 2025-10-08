'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LearnButtonProps {
	label: string;
	href: string;
}

export function LearnButton({ label, href }: LearnButtonProps) {
	return (
		<Button asChild className="bg-white">
			<Link href={href}>{label}</Link>
		</Button>
	);
}
