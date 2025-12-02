import type { ReactNode } from 'react';
import { SettingsSidebar } from './components/SettingsSidebar';

export default function SettingsLayout({ children }: { children: ReactNode }) {
	return (
		<main className="mx-auto flex w-full max-w-[1400px] px-4 py-8 lg:px-6">
			<aside className="sticky top-24 w-[260px] shrink-0 self-start">
				<SettingsSidebar />
			</aside>

			<section className="rounded-2x1 flex-1 border border-black/5 bg-white/80 p-6 shadow-sm">
				<div className="rounded-2xl bg-[#fff9f5] p-6 shadow-sm">{children}</div>
			</section>
		</main>
	);
}
