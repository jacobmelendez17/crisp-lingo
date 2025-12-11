type NumberStepperProps = {
	value: number | '';
	onChange: (value: number | '') => void;
	min?: number;
	max?: number;
};

export function NumberStepper({ value, onChange, min, max }: NumberStepperProps) {
	const clamp = (v: number) => {
		if (min !== undefined && v < min) return min;
		if (max !== undefined && v > max) return max;
		return v;
	};

	const getCurrent = () => (value === '' ? (min ?? 0) : value);

	const decrement = () => {
		const current = getCurrent();
		onChange(clamp(current - 1));
	};

	const increment = () => {
		const current = getCurrent();
		onChange(clamp(current + 1));
	};

	return (
		<div className="flex flex-col items-center gap-2">
			{/* Up arrow */}
			<button
				type="button"
				onClick={increment}
				aria-label="Increase value"
				className="flex h-7 w-7 items-center justify-center rounded-full bg-transparent transition-transform duration-150 active:translate-y-[2px]"
			>
				<span className="block h-0 w-0 border-b-[12px] border-l-[10px] border-r-[10px] border-b-[#3bc6c4] border-l-transparent border-r-transparent" />
			</button>

			{/* Editable number box */}
			<input
				type="number"
				value={value === '' ? '' : value}
				onChange={(e) => {
					const str = e.target.value;

					// allow it to be fully cleared
					if (str === '') {
						onChange('');
						return;
					}

					const n = Number(str);
					if (Number.isNaN(n)) return;
					onChange(n);
				}}
				className="h-12 w-16 rounded-xl border-2 border-[#3bc6c4] bg-white text-center text-2xl font-semibold text-neutral-800 shadow-[0_2px_0_rgba(0,0,0,0.15)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>

			{/* Down arrow */}
			<button
				type="button"
				onClick={decrement}
				aria-label="Decrease value"
				className="flex h-7 w-7 items-center justify-center rounded-full bg-transparent transition-transform duration-150 active:translate-y-[2px]"
			>
				<span className="block h-0 w-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#3bc6c4]" />
			</button>
		</div>
	);
}
