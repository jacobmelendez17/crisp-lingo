import { Button } from '@/components/ui/button';

type NumberStepperProps = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
};

export function NumberStepper({ value, onChange, min, max }: NumberStepperProps) {
	const clamp = (v: number) => {
		if (min !== undefined && v < min) return min;
		if (max !== undefined && v > max) return max;
		return v;
	};

	const decrement = () => onChange(clamp(value - 1));
	const increment = () => onChange(clamp(value + 1));

	return (
		<div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-2 py-1">
			<Button
				type="button"
				variant="leaf"
				size="icon"
				className="h-7 w-7 rounded-full border border-black/10"
				onClick={decrement}
			>
				-
			</Button>

			<input
				type="number"
				className="w-12 border-none bg-transparent text-center text-sm font-semibold text-neutral-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				value={value}
				onChange={(e) => {
					const raw = Number(e.target.value);
					if (Number.isNaN(raw)) {
						onChange(min ?? 0);
						return;
					}
					onChange(clamp(raw));
				}}
			/>

			<Button
				type="button"
				variant="leaf"
				size="icon"
				className="h-7 w-7 rounded-full border border-black/10"
				onClick={increment}
			>
				+
			</Button>
		</div>
	);
}
