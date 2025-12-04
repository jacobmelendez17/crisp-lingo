export default function AccountSettingsPage() {
	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-3xl font-bold text-neutral-900">Personal Information</h1>
			</header>

			<div className="grid gap-4">
				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<h2 className="mb-2 text-lg font-semibold text-neutral-800">Name</h2>
				</section>

				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<h2 className="mb-2 text-lg font-semibold text-neutral-800">Email</h2>
				</section>

				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<h2 className="mb-2 text-lg font-semibold text-neutral-800">Username</h2>
				</section>

				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<h2 className="mb-2 text-lg font-semibold text-neutral-800">Password</h2>
				</section>

				<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
					<h2 className="mb-2 text-lg font-semibold text-neutral-800">Profile Picture</h2>
				</section>
			</div>
		</div>
	);
}
