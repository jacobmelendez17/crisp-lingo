import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResetSettingsPage() {
	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-3xl font-bold text-neutral-900">Danger Zone</h1>
				<p className="mt-1 text-sm text-neutral-600">
					These actions can’t be undone. Resetting will wipe progress and review history.
				</p>
			</header>

			<div className="grid gap-4">
				{/* RESET */}
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<h2 className="mb-1 text-lg font-semibold text-neutral-800">Reset</h2>
					<p className="mb-4 text-sm text-neutral-600">
						Clear study progress while keeping your account.
					</p>

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-4">
							<div className="min-w-0 flex-1">
								<p className="font-medium text-neutral-800">Reset vocabulary progress</p>
								<p className="text-sm text-neutral-600">
									Deletes vocab SRS history, due dates, and counts.
								</p>
							</div>

							<Button variant="outline" size="sm" asChild>
								<Link href="/settings/reset/vocabulary">Reset</Link>
							</Button>
						</div>

						<div className="flex items-center justify-between gap-4">
							<div className="min-w-0 flex-1">
								<p className="font-medium text-neutral-800">Reset grammar progress</p>
								<p className="text-sm text-neutral-600">
									Deletes grammar SRS history and review schedule.
								</p>
							</div>

							<Button variant="outline" size="sm" asChild>
								<Link href="/settings/reset/grammar">Reset</Link>
							</Button>
						</div>

						<div className="flex items-center justify-between gap-4">
							<div className="min-w-0 flex-1">
								<p className="font-medium text-neutral-800">Reset account progress</p>
								<p className="text-sm text-neutral-600">
									Resets vocab + grammar progress and your overall stats.
								</p>
							</div>

							<Button variant="outline" size="sm" asChild>
								<Link href="/settings/reset/account">Reset</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* DELETE */}
				<section className="rounded-xl border border-red-500/20 bg-[#fff7f7] p-4">
					<h2 className="mb-1 text-lg font-semibold text-red-700">Delete</h2>
					<p className="mb-4 text-sm text-red-700/80">
						Permanently delete your account and all associated data.
					</p>

					<div className="flex items-center justify-between gap-4">
						<div className="min-w-0 flex-1">
							<p className="font-medium text-red-800">Delete account</p>
							<p className="text-sm text-red-700/80">
								This will remove your progress and settings from Crisp Lingo.
							</p>
						</div>

						<Button variant="destructive" size="sm" asChild>
							<Link href="/settings/reset/delete-account">Delete</Link>
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
}
