'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CardShell } from '@/components/card-shell';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Mode =
	| 'range99'
	| 'math'
	| 'money'
	| 'range1000'
	| 'big';

type Dir = 'es2num' | 'num2es';

const MODES: { id: Mode; title: string; desc: string }[] = [
	{ id: 'range99', title: '1–99', desc: 'Core numbers + spelling patterns' },
	{ id: 'math', title: 'Math', desc: 'Quick arithmetic in Spanish' },
	{ id: 'money', title: 'Money', desc: 'Amounts like $12.50' },
	{ id: 'range1000', title: '100–1000', desc: 'Hundreds + “ciento …”' },
	{ id: 'big', title: 'Big numbers', desc: 'Thousands + millions (starter)' }
];

export default function NumbersPracticeSetupPage() {
	const [mode, setMode] = useState<Mode>('range99');
	const [dir, setDir] = useState<Dir>('es2num');
	const [count, setCount] = useState(20);

	const href = useMemo(() => {
		const sp = new URLSearchParams();
		sp.set('mode', mode);
		sp.set('dir', dir);
		sp.set('count', String(count));
		return `/practice/numbers/session?${sp.toString()}`;
	}, [mode, dir, count]);

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#fde7e1]">
			<div className="mx-auto w-full max-w-[900px] px-4 py-10 lg:px-6">
				<header className="mb-8 text-center">
					<h1 className="text-5xl font-extrabold tracking-wide text-neutral-800">
						Number Practice
					</h1>
					<p className="mt-3 text-neutral-700">
						Choose a mode and do a 20-question batch.
					</p>
				</header>

				<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
					<CardShell title="Mode" className="bg-white">
						<div className="grid gap-3 sm:grid-cols-2">
							{MODES.map((m) => {
								const selected = m.id === mode;
								return (
									<button
										key={m.id}
										type="button"
										onClick={() => setMode(m.id)}
										className={cn(
											'rounded-2xl border p-4 text-left transition',
											selected
												? 'border-neutral-900 bg-neutral-900 text-white'
												: 'border-black/10 bg-white hover:bg-neutral-50'
										)}
									>
										<div className="text-base font-semibold">{m.title}</div>
										<div className={cn('mt-1 text-sm', selected ? 'text-white/80' : 'text-neutral-600')}>
											{m.desc}
										</div>
									</button>
								);
							})}
						</div>
					</CardShell>

					<div className="grid gap-6">
						<CardShell title="Direction" className="bg-white">
							<div className="grid gap-2">
								<button
									type="button"
									onClick={() => setDir('es2num')}
									className={cn(
										'rounded-2xl border p-3 text-left transition',
										dir === 'es2num'
											? 'border-neutral-900 bg-neutral-900 text-white'
											: 'border-black/10 bg-white hover:bg-neutral-50'
									)}
								>
									<div className="font-semibold">Spanish → Number</div>
									<div className={cn('text-sm', dir === 'es2num' ? 'text-white/80' : 'text-neutral-600')}>
										You see “treinta y dos” and type 32
									</div>
								</button>

								<button
									type="button"
									onClick={() => setDir('num2es')}
									className={cn(
										'rounded-2xl border p-3 text-left transition',
										dir === 'num2es'
											? 'border-neutral-900 bg-neutral-900 text-white'
											: 'border-black/10 bg-white hover:bg-neutral-50'
									)}
								>
									<div className="font-semibold">Number → Spanish</div>
									<div className={cn('text-sm', dir === 'num2es' ? 'text-white/80' : 'text-neutral-600')}>
										You see 32 and type “treinta y dos”
									</div>
								</button>
							</div>
						</CardShell>

						<CardShell title="Batch size" className="bg-white">
							<div className="flex items-center gap-3">
								<input
									type="range"
									min={5}
									max={30}
									step={5}
									value={count}
									onChange={(e) => setCount(Number(e.target.value))}
									className="w-full"
								/>
								<div className="w-12 text-right text-sm font-semibold text-neutral-800">
									{count}
								</div>
							</div>
							<p className="mt-2 text-xs text-neutral-500">Default is 20.</p>
						</CardShell>

						<Link href={href} className="block">
							<Button className="w-full rounded-2xl py-6 text-base">
								Start session
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}