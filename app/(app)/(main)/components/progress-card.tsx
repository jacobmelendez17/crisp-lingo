import { CardShell } from '../../../../components/card-shell';

export function ProgressCard() {
	return (
		<CardShell title="Progress">
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
				<CardShell title="Beginner Pup" className="bg-white">
					<div> </div>
				</CardShell>
				<CardShell title="Pond Treader" className="bg-white">
					<div> </div>
				</CardShell>
				<CardShell title="River Rider" className="bg-white">
					<div> </div>
				</CardShell>
				<CardShell title="Expert Swimmer" className="bg-white">
					<div> </div>
				</CardShell>
				<CardShell title="Pro Diver" className="bg-white">
					<div> </div>
				</CardShell>
			</div>
		</CardShell>
	);
}
