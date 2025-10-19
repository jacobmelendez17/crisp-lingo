import Image from 'next/image';
import Link from 'next/link';
import db from '@/db/drizzle';
import { and, eq, asc } from 'drizzle-orm';
import { cn } from '@/libs/utils';
import { CardShell } from '@/components/card-shell';

export default async function PracticePage() {
	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<div className="grid gap-6 pt-10 lg:grid-cols-[1fr_360px]">Practice Page</div>
		</main>
	);
}
