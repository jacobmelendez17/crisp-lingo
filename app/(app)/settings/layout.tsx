import type { ReactNode } from 'react';
import { SettingsSidebar } from './components/SettingsSidebar';

export default function SettingsLayout({ children }: { children: ReactNode }) {
	return (
		<main className="mx-auto flex w-full max-w-[1200px] gap-8 px-4 py-8 lg:px-6">
			<aside className="">{/*<SettingsSidebar />*/}</aside>

			<section className="rounded-2x1 flex-1 border border-black/5 bg-white/80 p-6 shadow-sm">
				{children}
			</section>
		</main>
	);
}
