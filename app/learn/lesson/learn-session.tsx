'use client';

import { useState, useTransition } from 'react';
import { Header } from '../header';

type Props = {
	initialPercentage: number;
	initialLessonId?: number;
};

export const LearnSession = ({ initialPercentage, initialLessonId }: Props) => {
	const [percentage, setPercentage] = useState(() =>
		initialPercentage === 100 ? 0 : initialPercentage
	);

	return (
		<>
			<Header percentage={percentage} />
		</>
	);
};
