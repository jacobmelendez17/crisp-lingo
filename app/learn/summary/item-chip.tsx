'use client';

import Image from 'next/image';
import React from 'react';

type ItemChipProps = {
	word: string;
	imageUrl?: string | null;
	tooltip?: string;
};

export function ItemChip({ word, imageUrl, tooltip }: ItemChipProps) {
	const label = tooltip || word;

	return (
		<div className="group relative inline-block">
			{/* Chip */}
			<div className="flex h-14 w-14 select-none items-center justify-center rounded-2xl bg-[#5ec3c6] text-neutral-900">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={word}
						width={48}
						height={48}
						className="h-10 w-10 object-contain"
					/>
				) : (
					<span className="px-1 text-center text-sm font-semibold text-neutral-900">{word}</span>
				)}
			</div>

			{/* Tooltip */}
			<div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2 opacity-0 transition-all duration-150 group-hover:-translate-y-3 group-hover:opacity-100">
				{/* little arrow */}
				<div className="mb-1 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-[#221b29]" />

				{/* bubble */}
				<div className="whitespace-nowrap rounded-full bg-[#221b29] px-2.5 py-1 text-xs font-semibold text-white">
					{label}
				</div>
			</div>
		</div>
	);
}
