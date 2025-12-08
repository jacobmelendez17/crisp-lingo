export type ReviewOrder = 'mixed' | 'oldest' | 'newest';

type Props = {
	value: ReviewOrder;
	onChange: (value: ReviewOrder) => void;
};

const OPTIONS: {
	id: ReviewOrder;
	title: string;
	description: string;
}[] = [
	{
		id: 'mixed',
		title: 'Mixed',
		description: 'Shuffle items due for review to keep sessions varied.'
	},
	{
		id: 'oldest',
		title: 'Oldest first',
		description: 'Tackle the items that have been waiting the longest first.'
	},
	{
		id: 'newest',
		title: 'Newest first',
		description: 'Review your most recently learned items before older ones.'
	}
];

export function ReviewOrderOptions({ value, onChange }: Props) {
	return (
		<div className="space-y-2">
			<h3 className="text-sm font-semibold text-neutral-800">Review order</h3>

			<div className="grid gap-3 md:grid-cols-3">
				{OPTIONS.map((opt) => {
					const checked = value === opt.id;

					return (
						<label
							key={opt.id}
							className={[
								'flex cursor-pointer flex-col gap-1 rounded-lg border border-black/5 bg-white/70 p-3',
								'transition-all hover:-translate-y-0.5 hover:shadow-sm',
								checked && 'border-[#c48757] bg-[#fff5eb] shadow-sm'
							].join(' ')}
						>
							<input
								type="radio"
								name="reviewOrder"
								value={opt.id}
								checked={checked}
								onChange={() => onChange(opt.id)}
								className="sr-only"
							/>

							<div className="flex items-center justify-between gap-3">
								<div>
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
		</div>
	);
}
