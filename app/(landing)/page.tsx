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
import { ScrollHint } from './scroll_hint';

const testimonials = [
	{
		name: 'Ava M.',
		role: 'College Student',
		quote: 'Crisp Lingo made reviews fun. I finally stuck with Spanish!'
	},
	{
		name: 'Diego R.',
		role: 'Traveler',
		quote: 'The SRS timing is perfect. I remember way more on trips.'
	},
	{ name: 'Sam K.', role: 'Self-Learner', quote: 'Clean UI, great pacing, and the audio is 🔥.' }
];

export default function Home() {
	return (
		<>
			<div className="mx-auto mb-60 flex min-h-[70vh] w-full max-w-[1200px] items-center justify-start px-8">
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

			<ScrollHint />

			<section id="how-it-works" className="border-t border-black/5 bg-[#faf5e6] py-20">
				<div className="mx-auto w-full max-w-[1200px] px-8">
					<h2 className="mb-10 text-2xl font-bold text-neutral-800 lg:text-4xl">
						How Crisp Lingo Works
					</h2>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-2xl bg-white p-6 shadow-sm">
							<h3 className="mb-2 text-xl font-semibold">1. Pick your path</h3>
							<p className="text-neutral-600">
								Choose vocabulary, grammar, or listening tracks—built by frequency and difficulty.
							</p>
						</div>
						<div className="rounded-2xl bg-white p-6 shadow-sm">
							<h3 className="mb-2 text-xl font-semibold">2. Learn by doing</h3>
							<p className="text-neutral-600">
								Short interactive lessons with audio, hints, and spaced examples.
							</p>
						</div>
						<div className="rounded-2xl bg-white p-6 shadow-sm">
							<h3 className="mb-2 text-xl font-semibold">3. Review smart</h3>
							<p className="text-neutral-600">
								Our SRS schedules reviews right when you’re about to forget.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* TESTIMONIALS */}
			<section id="testimonials" className="border-t border-black/5 bg-[#fffceb] py-20">
				<div className="mx-auto w-full max-w-[1200px] px-8">
					<h2 className="mb-10 text-2xl font-bold text-neutral-800 lg:text-4xl">
						What learners say
					</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{testimonials.map((t) => (
							<figure key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
								<blockquote className="text-neutral-700">“{t.quote}”</blockquote>
								<figcaption className="mt-4 text-sm text-neutral-500">
									— {t.name}, {t.role}
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</section>

			{/* FINAL CTA */}
			<section id="get-started" className="border-t border-black/5 bg-[#faf5e6] py-20">
				<div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 px-8">
					<h2 className="text-2xl font-bold text-neutral-800 lg:text-4xl">Ready to start?</h2>
					<div className="flex gap-4">
						<SignUpButton mode="modal">
							<Button size="xl" variant="mint">
								Create free account
							</Button>
						</SignUpButton>
						<SignInButton mode="modal">
							<Button size="xl" variant="outline">
								Log in
							</Button>
						</SignInButton>
					</div>
				</div>
			</section>
		</>
	);
}
