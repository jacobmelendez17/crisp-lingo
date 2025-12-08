import Image from 'next/image';

export type ReviewMode = 'standard' | 'lightning' | 'relaxed';

type Props = {
	value: ReviewMode;
	onChange: (value: ReviewMode) => void;
};

const OPTIONS: {
	id: ReviewMode;
	title: string;
	description: string;
	imageSrc: string;
}[] = [
	{
		id: 'standard',
		title: 'Standard mode',
		description: 'Balanced pacing with normal answer time and feedback.',
		imageSrc: '/settings/mode-standard.png'
	},
	{
		id: 'lightning',
		title: 'Lightning mode',
		description: 'Snappier sessions that hide feedback quickly to keep you moving.',
		imageSrc: '/settings/mode-lightning.png'
	},
	{
		id: 'relaxed',
		title: 'Relaxed mode',
		description: 'A slower, more forgiving pace with extra time to think.',
		imageSrc: '/settings/mode-relaxed.png'
	}
];

export function ReviewModeOptions({ value, onChange }: Props) {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			{OPTIONS.map((opt) => {
				const checked = value === opt.id;

				return (
					<label
						key={opt.id}
						className={[
							'group flex cursor-pointer flex-col gap-3 rounded-xl border border-black/5 bg-white/70 p-3',
							'transition-all hover:-translate-y-0.5 hover:shadow-sm',
							checked && 'border-[#c48757] bg-[#fff5eb] shadow-sm'
						].join(' ')}
					>
						<input
							type="radio"
							name="reviewMode"
							value={opt.id}
							checked={checked}
							onChange={() => onChange(opt.id)}
							className="sr-only"
						/>

						<div className="flex items-center gap-3">
							<div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f3e3d3]">
								<Image src={opt.imageSrc} alt={opt.title} fill className="object-cover" />
							</div>

							<div className="flex-1">
								<p className="text-sm font-semibold text-neutral-900">{opt.title}</p>
								<p className="text-xs text-neutral-500">{opt.description}</p>
							</div>

							<div
								className={[
									'flex h-5 w-5 items-center justify-center rounded-full border',
									checked ? 'border-[#c48757] bg-[#c48757]' : 'border-neutral-300 bg-white'
								].join(' ')}
							>
								{checked && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
							</div>
						</div>
					</label>
				);
			})}
		</div>
	);
}
