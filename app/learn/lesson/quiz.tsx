'use client';

import { Header } from '../header';

import { useState, useTransition } from 'react';

type Props = {
	initialPercentage: number;
};

export const Quiz = ({ initialPercentage }: Props) => {
	const [percentage, setPercentage] = useState(() =>
		initialPercentage === 100 ? 0 : initialPercentage
	);

	return (
		<>
			<Header percentage={initialPercentage} />
			<main className="mx-auto max-w-screen-lg p-6">
				<div className="flex-1">Hello</div>
			</main>
		</>
	);
};
