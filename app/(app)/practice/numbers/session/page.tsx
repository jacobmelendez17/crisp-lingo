'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CardShell } from '@/components/card-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Mode = 'range99' | 'math' | 'money' | 'range1000' | 'big';
type Dir = 'es2num' | 'num2es';

type Question = {
	prompt: string;
	answerText: string;
	accept: (raw: string) => boolean;
};

function clamp(n: number, a: number, b: number) {
	return Math.max(a, Math.min(b, n));
}

function normalizeText(s: string) {
	return s
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[.,]/g, '')
		.replace(/\s+/g, ' ');
}

const UNITS: Record<number, string> = {
	0: 'cero',
	1: 'uno',
	2: 'dos',
	3: 'tres',
	4: 'cuatro',
	5: 'cinco',
	6: 'seis',
	7: 'siete',
	8: 'ocho',
	9: 'nueve'
};

const SPECIALS: Record<number, string> = {
	10: 'diez',
	11: 'once',
	12: 'doce',
	13: 'trece',
	14: 'catorce',
	15: 'quince',
	16: 'dieciseis',
	17: 'diecisiete',
	18: 'dieciocho',
	19: 'diecinueve',
	20: 'veinte',
	21: 'veintiuno',
	22: 'veintidos',
	23: 'veintitres',
	24: 'veinticuatro',
	25: 'veinticinco',
	26: 'veintiseis',
	27: 'veintisiete',
	28: 'veintiocho',
	29: 'veintinueve'
};

const TENS: Record<number, string> = {
	30: 'treinta',
	40: 'cuarenta',
	50: 'cincuenta',
	60: 'sesenta',
	70: 'setenta',
	80: 'ochenta',
	90: 'noventa'
};

const HUNDREDS: Record<number, string> = {
	100: 'cien',
	200: 'doscientos',
	300: 'trescientos',
	400: 'cuatrocientos',
	500: 'quinientos',
	600: 'seiscientos',
	700: 'setecientos',
	800: 'ochocientos',
	900: 'novecientos'
};

function toSpanish(n: number): string {
	if (!Number.isFinite(n)) return '';
	if (n < 0) return `menos ${toSpanish(-n)}`;
	if (n <= 9) return UNITS[n];
	if (n <= 29) return SPECIALS[n];
	if (n <= 99) {
		const ten = Math.floor(n / 10) * 10;
		const unit = n % 10;
		if (unit === 0) return TENS[ten];
		return `${TENS[ten]} y ${UNITS[unit]}`;
	}
	if (n <= 999) {
		if (n === 100) return 'cien';
		const hundred = Math.floor(n / 100) * 100;
		const rest = n % 100;
		const h =
			hundred === 100 ? 'ciento' : HUNDREDS[hundred as keyof typeof HUNDREDS];
		return rest === 0 ? h : `${h} ${toSpanish(rest)}`;
	}
	if (n <= 999999) {
		const thousands = Math.floor(n / 1000);
		const rest = n % 1000;
		const th = thousands === 1 ? 'mil' : `${toSpanish(thousands)} mil`;
		return rest === 0 ? th : `${th} ${toSpanish(rest)}`;
	}
	if (n === 1000000) return 'un millon';
	const millions = Math.floor(n / 1000000);
	const rest = n % 1000000;
	const m = millions === 1 ? 'un millon' : `${toSpanish(millions)} millones`;
	return rest === 0 ? m : `${m} ${toSpanish(rest)}`;
}

function parseSpanishNumber(input: string): number | null {
	const s = normalizeText(input);

	if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);

	const cleaned = s
		.replace(/\b(dolar(es)?|centavo(s)?|peso(s)?|usd)\b/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	if (!cleaned) return null;

	if (Object.values(SPECIALS).includes(cleaned)) {
		const found = Object.entries(SPECIALS).find(([, v]) => v === cleaned);
		return found ? Number(found[0]) : null;
	}

	const wordToValue: Record<string, number> = {
		cero: 0,
		uno: 1,
		un: 1,
		dos: 2,
		tres: 3,
		cuatro: 4,
		cinco: 5,
		seis: 6,
		siete: 7,
		ocho: 8,
		nueve: 9,
		diez: 10,
		once: 11,
		doce: 12,
		trece: 13,
		catorce: 14,
		quince: 15,
		dieciseis: 16,
		diecisiete: 17,
		dieciocho: 18,
		diecinueve: 19,
		veinte: 20,
		veintiuno: 21,
		veintidos: 22,
		veintitres: 23,
		veinticuatro: 24,
		veinticinco: 25,
		veintiseis: 26,
		veintisiete: 27,
		veintiocho: 28,
		veintinueve: 29,
		treinta: 30,
		cuarenta: 40,
		cincuenta: 50,
		sesenta: 60,
		setenta: 70,
		ochenta: 80,
		noventa: 90,
		cien: 100,
		ciento: 100,
		doscientos: 200,
		trescientos: 300,
		cuatrocientos: 400,
		quinientos: 500,
		seiscientos: 600,
		setecientos: 700,
		ochocientos: 800,
		novecientos: 900
	};

	const tokens = cleaned.split(' ').filter(Boolean).filter((t) => t !== 'y');

	let total = 0;
	let current = 0;

	for (const t of tokens) {
		if (t === 'mil') {
			if (current === 0) current = 1;
			total += current * 1000;
			current = 0;
			continue;
		}
		if (t === 'millon' || t === 'millones') {
			if (current === 0) current = 1;
			total += current * 1_000_000;
			current = 0;
			continue;
		}
		const v = wordToValue[t];
		if (v == null) return null;
		current += v;
	}

	return total + current;
}

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeQuestion(mode: Mode, dir: Dir): Question {
	if (mode === 'math') {
		const a = randomInt(1, 50);
		const b = randomInt(1, 50);
		const ops = ['+', '-'] as const;
		const op = ops[randomInt(0, ops.length - 1)];
		const value = op === '+' ? a + b : a - b;

		const prompt =
			dir === 'es2num'
				? `${toSpanish(a)} ${op === '+' ? 'mas' : 'menos'} ${toSpanish(b)}`
				: `${a} ${op} ${b}`;

		const answerText = dir === 'es2num' ? String(value) : toSpanish(value);

		return {
			prompt,
			answerText,
			accept: (raw) => {
				if (dir === 'es2num') {
					const got = Number(normalizeText(raw));
					return Number.isFinite(got) && got === value;
				}
				const got = parseSpanishNumber(raw);
				return got === value;
			}
		};
	}

	if (mode === 'money') {
		const dollars = randomInt(1, 99);
		const cents = randomInt(0, 99);
		const numeric = `${dollars}.${String(cents).padStart(2, '0')}`;
		const spanish = `${toSpanish(dollars)} dolares con ${toSpanish(cents)} centavos`;

		const prompt = dir === 'es2num' ? spanish : `$${numeric}`;
		const answerText = dir === 'es2num' ? numeric : spanish;

		return {
			prompt,
			answerText,
			accept: (raw) => {
				if (dir === 'es2num') {
					const s = normalizeText(raw).replace('$', '');
					return s === normalizeText(numeric);
				}
				return normalizeText(raw) === normalizeText(spanish);
			}
		};
	}

	let min = 1;
	let max = 99;

	if (mode === 'range1000') {
		min = 100;
		max = 1000;
	} else if (mode === 'big') {
		min = 1000;
		max = 1_000_000;
	}

	const value = randomInt(min, max);
	const prompt = dir === 'es2num' ? toSpanish(value) : String(value);
	const answerText = dir === 'es2num' ? String(value) : toSpanish(value);

	return {
		prompt,
		answerText,
		accept: (raw) => {
			if (dir === 'es2num') {
				const got = Number(normalizeText(raw));
				return Number.isFinite(got) && got === value;
			}
			const got = parseSpanishNumber(raw);
			return got === value;
		}
	};
}

function makeBatch(mode: Mode, dir: Dir, count: number): Question[] {
	return Array.from({ length: count }, () => makeQuestion(mode, dir));
}

export default function NumbersPracticeSessionPage() {
	const sp = useSearchParams();

	const mode = (sp.get('mode') as Mode) ?? 'range99';
	const dir = (sp.get('dir') as Dir) ?? 'es2num';
	const count = clamp(Number(sp.get('count') ?? 20), 5, 30);

	const [batch, setBatch] = useState<Question[]>([]);
	const [i, setI] = useState(0);
	const [value, setValue] = useState('');
	const [status, setStatus] = useState<'idle' | 'right' | 'wrong'>('idle');
	const [showAnswer, setShowAnswer] = useState<string | null>(null);

	useEffect(() => {
		setBatch(makeBatch(mode, dir, count));
		setI(0);
		setValue('');
		setStatus('idle');
		setShowAnswer(null);
	}, [mode, dir, count]);

	const q = batch[i];
	const done = batch.length > 0 && i >= batch.length;

	const submit = () => {
		if (!q) return;
		const ok = q.accept(value);
		setStatus(ok ? 'right' : 'wrong');
		setShowAnswer(ok ? null : q.answerText);
	};

	const next = () => {
		setStatus('idle');
		setShowAnswer(null);
		setValue('');
		setI((x) => x + 1);
	};

	if (done) {
		return (
			<main className="min-h-[calc(100vh-80px)] bg-[#fde7e1]">
				<div className="mx-auto w-full max-w-[720px] px-4 py-10 lg:px-6">
					<CardShell title="Done" className="bg-white">
						<div className="mt-4 flex flex-wrap gap-3">
							<Button
								onClick={() => {
									setBatch(makeBatch(mode, dir, count));
									setI(0);
									setValue('');
									setStatus('idle');
									setShowAnswer(null);
								}}
								className="rounded-2xl"
							>
								Practice again
							</Button>
							<Link href="/practice/numbers">
								<Button variant="outline" className="rounded-2xl">
									Back to setup
								</Button>
							</Link>
						</div>
					</CardShell>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#fde7e1]">
			<div className="mx-auto w-full max-w-[720px] px-4 py-10 lg:px-6">
				<div className="mb-6 flex items-center justify-between">
					<Link
						href="/practice/numbers"
						className="text-sm font-medium text-neutral-700 underline"
					>
						← Setup
					</Link>

					<div className="text-sm text-neutral-700">
						<span className="font-semibold">{i + 1}</span> / {batch.length}
					</div>
				</div>

				<CardShell title="" className="bg-white">
					<div className="flex min-h-[360px] flex-col items-center justify-center gap-6 py-6">
						{/* Prompt centered */}
						<div className="text-center">
							<div className="text-xs font-semibold text-neutral-500">
								{dir === 'es2num' ? 'Type the number' : 'Type it in Spanish'}
							</div>

							<div className="mt-3 text-4xl font-extrabold tracking-wide text-neutral-900">
								{q?.prompt ?? '...'}
							</div>
						</div>

						{/* Answer box */}
						<div className="w-full max-w-md space-y-3">
							<input
								value={value}
								onChange={(e) => setValue(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										if (status === 'idle') submit();
										else next();
									}
								}}
								placeholder={dir === 'es2num' ? 'e.g. 32' : 'e.g. treinta y dos'}
								className={cn(
									'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none',
									'text-center',
									'focus:ring-4 focus:ring-[var(--leaf)]/30'
								)}
								autoFocus
							/>

							{status === 'idle' ? (
								<Button
									onClick={submit}
									className="w-full rounded-2xl py-6 text-base"
								>
									Check
								</Button>
							) : (
								<Button
									onClick={next}
									className="w-full rounded-2xl py-6 text-base"
								>
									Next
								</Button>
							)}
						</div>

						{/* Feedback */}
						{status !== 'idle' && (
							<div
								className={cn(
									'w-full max-w-md rounded-2xl border p-4 text-center text-sm',
									status === 'right'
										? 'border-emerald-200 bg-emerald-50 text-emerald-900'
										: 'border-rose-200 bg-rose-50 text-rose-900'
								)}
							>
								{status === 'right' ? (
									<div className="font-semibold">Correct ✅</div>
								) : (
									<div className="space-y-1">
										<div className="font-semibold">Not quite ❌</div>
										{showAnswer && (
											<div>
												Correct answer:{' '}
												<span className="font-semibold">{showAnswer}</span>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</CardShell>
			</div>
		</main>
	);
}