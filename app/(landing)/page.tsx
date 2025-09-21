'use client';

import { Button } from '@/components/ui/button';
import {
	ClerkLoading,
	ClerkLoaded,
	SignedIn,
	SignedOut,
	SignUpButton,
	SignInButton
} from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<div className="mx-auto flex min-h-0 w-full max-w-[1200px] items-center justify-start px-8">
			<div className="flex flex-col items-start gap-y-10">
				<h1 className="max-w-[900px] text-left text-3xl font-bold text-neutral-700 lg:text-6xl">
					Learn, listen, lingo.
					<br />
					Master any language with Crisp Lingo
				</h1>
				<div className="flex flex-row items-center gap-x-4">
					<ClerkLoading>
						<Loader className="text-muted-foreground h-6 w-6 animate-spin" />
					</ClerkLoading>

					<ClerkLoaded>
						<SignedOut>
							<div className="flex gap-x-4">
								<SignUpButton mode="modal">
									<Button size="xl" variant="mint">
										Get Started
									</Button>
								</SignUpButton>
								<SignInButton mode="modal">
									<Button size="xl" variant="outline">
										I already have an account
									</Button>
								</SignInButton>
							</div>
						</SignedOut>

						<SignedIn>
							<Button size="xl" variant="secondary" asChild>
								<Link href="/learn">Continue Learning</Link>
							</Button>
						</SignedIn>
					</ClerkLoaded>
				</div>
			</div>
		</div>
	);
}
