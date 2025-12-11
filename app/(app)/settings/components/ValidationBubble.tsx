type ValidationBubbleProps = {
	message: string;
};

export function ValidationBubble({ message }: ValidationBubbleProps) {
	if (!message) return null;

	return (
		<div className="mt-3 flex justify-center">
			<div className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-lg">
				{message}
			</div>
		</div>
	);
}
