import { CardShell } from '@/components/card-shell';

export function ProgressCard() {
	const levels = [
		{ title: 'Beginner Pup', color: 'bg-[#d7f7d2]' },
		{ title: 'Pond Treader', color: 'bg-[#bdeeb1]' },
		{ title: 'River Rider', color: 'bg-[#a1e192]' },
		{ title: 'Expert Swimmer', color: 'bg-[#7ccf70]' },
		{ title: 'Pro Diver', color: 'bg-[#5dbf52]' }
	];

	return (
		<CardShell title="Progress">
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
				{levels.map((lvl) => (
					<CardShell
						key={lvl.title}
						title={lvl.title}
						className={`${lvl.color} text-center`}
						headerClassName="justify-center"
						titleClassName="text-base font-semibold, text-center"
					>
						<div className="mx-auto w-full max-w-[220px] rounded-lg border border-black/5 bg-white text-neutral-700 shadow-sm">
							<div className="grid divide-y divide-gray-200">
								<div className="flex items-center justify-between px-4 py-3 text-sm font-medium">
									<span>Vocabulary</span>
								</div>
								<div className="flex items-center justify-between px-4 py-3 text-sm font-medium">
									<span>Grammar</span>
								</div>
								<div className="flex items-center justify-between px-4 py-3 text-sm font-medium">
									<span>Listening</span>
								</div>
							</div>
						</div>
					</CardShell>
				))}
				;
			</div>
		</CardShell>
	);
}
