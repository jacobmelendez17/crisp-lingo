import type { ReactNode } from 'react';
//import { SideNav } from '@/components/';

export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<main className="mx-auto w-full max-w-[1200px] px-4 py-8">
			<div className="grid gap-6 lg:grid-cols-[260px_1fr]">
				<aside className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm"></aside>
				<section className="min-h-[520px] rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
					{children}
				</section>
			</div>
		</main>
	);
}
