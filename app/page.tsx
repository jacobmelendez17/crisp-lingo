// app/page.tsx (or app/buttons/page.tsx)
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#fffceb]">
			<div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-3">
				<Button variant="leaf" size="xl" rounded="2xl">
					Default (Leaf)
				</Button>
				<Button variant="mint" size="xl" rounded="2xl">
					Mint
				</Button>
				<Button variant="sprout" size="xl" rounded="2xl">
					Sprout
				</Button>
				<Button variant="custard" size="xl" rounded="2xl">
					Custard
				</Button>
				<Button variant="sand" size="xl" rounded="2xl">
					Sand
				</Button>
				<Button variant="sage" size="xl" rounded="2xl">
					Sage
				</Button>

				<Button variant="secondary" size="xl" rounded="xl">
					Secondary
				</Button>
				<Button variant="ghost" size="xl" rounded="xl">
					Ghost
				</Button>
				<Button variant="black" size="xl" rounded="xl">
					Black
				</Button>

				<Button variant="leaf" size="xl" rounded="2xl" disabled>
					Disabled
				</Button>
			</div>
		</main>
	);
}
