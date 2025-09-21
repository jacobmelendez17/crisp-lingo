'use client';

import { useEffect, useState } from 'react';

export const ScrollHint = () => {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const onScroll = () => setHidden(window.scrollY > 10);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<div
			className={[
				'fixed bottom-8 left-0 flex w-full justify-center',
				'transition-all duration-300',
				hidden ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100'
			].join(' ')}
		>
			<a
				href="#how-it-works"
				className="inline-flex items-center gap-2 text-xl font-medium underline underline-offset-4 opacity-90 hover:opacity-100 motion-safe:animate-bounce lg:text-2xl"
			>
				See how it works <span>↓</span>
			</a>
		</div>
	);
};
