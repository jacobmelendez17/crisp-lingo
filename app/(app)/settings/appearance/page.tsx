'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NumberStepper } from '../components/NumberStepper'; // <-- if you move it to its own file, otherwise paste inline

type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high_contrast';
type ThemeMode = 'light' | 'dark' | 'system';
type FontFamily = 'system' | 'inter' | 'nunito' | 'serif';
type PaletteKey = 'sage' | 'mint' | 'ocean' | 'sunset' | 'mono';

const COLORBLIND_OPTIONS: { key: ColorBlindMode; label: string; description: string }[] = [
	{ key: 'none', label: 'Default', description: 'Standard colors.' },
	{ key: 'protanopia', label: 'Protanopia', description: 'Reduced red sensitivity.' },
	{ key: 'deuteranopia', label: 'Deuteranopia', description: 'Reduced green sensitivity.' },
	{ key: 'tritanopia', label: 'Tritanopia', description: 'Reduced blue sensitivity.' },
	{ key: 'high_contrast', label: 'High Contrast', description: 'Maximize contrast and clarity.' }
];

const FONT_OPTIONS: { key: FontFamily; label: string; css: string }[] = [
	{ key: 'system', label: 'System', css: 'system-ui, -apple-system, Segoe UI, Roboto, Arial' },
	{ key: 'inter', label: 'Inter', css: 'Inter, system-ui, sans-serif' },
	{ key: 'nunito', label: 'Nunito', css: 'Nunito, system-ui, sans-serif' },
	{ key: 'serif', label: 'Serif', css: 'ui-serif, Georgia, Cambria, "Times New Roman", Times' }
];

const PALETTES: Record<PaletteKey, { label: string; colors: { name: string; hex: string }[] }> = {
	sage: {
		label: 'Sage',
		colors: [
			{ name: 'Primary', hex: '#7fb069' },
			{ name: 'Accent', hex: '#b3d295' },
			{ name: 'Soft', hex: '#d6e7cc' },
			{ name: 'Ink', hex: '#1f2937' }
		]
	},
	mint: {
		label: 'Mint',
		colors: [
			{ name: 'Primary', hex: '#3bc6c4' },
			{ name: 'Accent', hex: '#7fe0df' },
			{ name: 'Soft', hex: '#d7f7f6' },
			{ name: 'Ink', hex: '#1f2937' }
		]
	},
	ocean: {
		label: 'Ocean',
		colors: [
			{ name: 'Primary', hex: '#2b6cb0' },
			{ name: 'Accent', hex: '#63b3ed' },
			{ name: 'Soft', hex: '#ebf8ff' },
			{ name: 'Ink', hex: '#0f172a' }
		]
	},
	sunset: {
		label: 'Sunset',
		colors: [
			{ name: 'Primary', hex: '#f97316' },
			{ name: 'Accent', hex: '#fb7185' },
			{ name: 'Soft', hex: '#fff7ed' },
			{ name: 'Ink', hex: '#1f2937' }
		]
	},
	mono: {
		label: 'Mono',
		colors: [
			{ name: 'Primary', hex: '#111827' },
			{ name: 'Accent', hex: '#6b7280' },
			{ name: 'Soft', hex: '#f3f4f6' },
			{ name: 'Ink', hex: '#111827' }
		]
	}
};

function SectionShell({
	title,
	description,
	left,
	right
}: {
	title: string;
	description?: string;
	left: React.ReactNode;
	right: React.ReactNode;
}) {
	return (
		<section className="rounded-xl border border-black/5 bg-[#fffdf9] p-4">
			<div className="mb-3">
				<h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
				{description ? <p className="mt-1 text-sm text-neutral-600">{description}</p> : null}
			</div>

			<div className="grid gap-4 md:grid-cols-[1fr_360px]">
				<div className="min-w-0">{left}</div>
				<div className="min-w-0">{right}</div>
			</div>
		</section>
	);
}

function RadioRow({
	checked,
	onClick,
	label,
	description
}: {
	checked: boolean;
	onClick: () => void;
	label: string;
	description?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition',
				checked ? 'border-black/20 bg-white' : 'border-black/10 bg-transparent hover:bg-white/60'
			)}
		>
			<div
				className={cn(
					'mt-1 h-4 w-4 rounded-full border',
					checked ? 'border-black bg-black' : 'border-black/30 bg-white'
				)}
			/>
			<div className="min-w-0">
				<p className="font-medium text-neutral-800">{label}</p>
				{description ? <p className="text-sm text-neutral-600">{description}</p> : null}
			</div>
		</button>
	);
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.06)]">
			<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-500">{title}</p>
			{children}
		</div>
	);
}

function PalettePreview({ paletteKey }: { paletteKey: PaletteKey }) {
	const palette = PALETTES[paletteKey];

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-2">
				{palette.colors.map((c) => (
					<div key={c.name} className="rounded-xl border border-black/10 bg-white p-2">
						<div
							className="mb-2 h-10 w-full rounded-lg border border-black/10"
							style={{ background: c.hex }}
						/>
						<div className="flex items-center justify-between gap-2">
							<p className="text-xs font-medium text-neutral-800">{c.name}</p>
							<p className="text-[10px] text-neutral-500">{c.hex}</p>
						</div>
					</div>
				))}
			</div>

			<div className="rounded-xl border border-black/10 bg-neutral-50 p-3">
				<p className="text-sm font-medium text-neutral-800">Preview buttons</p>
				<div className="mt-2 flex gap-2">
					<button
						type="button"
						className="rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.12)]"
						style={{ background: palette.colors[0].hex }}
					>
						Primary
					</button>
					<button
						type="button"
						className="rounded-xl px-3 py-2 text-sm font-semibold shadow-[0_2px_0_rgba(0,0,0,0.08)]"
						style={{ background: palette.colors[2].hex, color: palette.colors[3].hex }}
					>
						Soft
					</button>
				</div>
			</div>
		</div>
	);
}

export default function AppearanceSettingsPage() {
	const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('none');
	const [fontFamily, setFontFamily] = useState<FontFamily>('system');
	const [fontSize, setFontSize] = useState<number | ''>(16);

	const [themeMode, setThemeMode] = useState<ThemeMode>('system');
	const [paletteKey, setPaletteKey] = useState<PaletteKey>('sage');

	const fontCss = useMemo(
		() => FONT_OPTIONS.find((f) => f.key === fontFamily)?.css ?? FONT_OPTIONS[0].css,
		[fontFamily]
	);

	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-3xl font-bold text-neutral-900">Appearance</h1>
				<p className="mt-1 text-sm text-neutral-600">
					Customize Crisp Lingo to match your preferences.
				</p>
			</header>

			<div className="grid gap-4">
				{/* STYLING */}
				<SectionShell
					title="Styling"
					description="Adjust accessibility and text settings."
					left={
						<div className="space-y-4">
							<div className="space-y-2">
								<p className="text-sm font-semibold text-neutral-800">Color blindness</p>
								<div className="space-y-2">
									{COLORBLIND_OPTIONS.map((o) => (
										<RadioRow
											key={o.key}
											checked={colorBlindMode === o.key}
											onClick={() => setColorBlindMode(o.key)}
											label={o.label}
											description={o.description}
										/>
									))}
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<p className="text-sm font-semibold text-neutral-800">Font</p>
									<select
										value={fontFamily}
										onChange={(e) => setFontFamily(e.target.value as FontFamily)}
										className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-black/30"
									>
										{FONT_OPTIONS.map((f) => (
											<option key={f.key} value={f.key}>
												{f.label}
											</option>
										))}
									</select>
								</div>

								<div className="space-y-2">
									<p className="text-sm font-semibold text-neutral-800">Font size</p>
									<NumberStepper value={fontSize} onChange={setFontSize} min={12} max={28} />
								</div>
							</div>

							<div className="flex justify-end">
								<Button variant="sage">Save changes</Button>
							</div>
						</div>
					}
					right={
						<PreviewCard title="Preview">
							<div style={{ fontFamily: fontCss, fontSize: fontSize === '' ? 16 : fontSize }}>
								<p className="text-base font-semibold text-neutral-900">Crisp Lingo Preview</p>
								<p className="mt-1 text-sm text-neutral-600">
									The quick brown fox jumps over the lazy dog.
								</p>

								<div className="mt-4 rounded-xl border border-black/10 bg-neutral-50 p-3">
									<p className="text-sm font-medium text-neutral-800">Current mode</p>
									<p className="text-sm text-neutral-600">
										{COLORBLIND_OPTIONS.find((o) => o.key === colorBlindMode)?.label}
									</p>
								</div>
							</div>
						</PreviewCard>
					}
				/>

				{/* THEME */}
				<SectionShell
					title="Theme"
					description="Choose your theme mode and primary palette."
					left={
						<div className="space-y-4">
							<div className="space-y-2">
								<p className="text-sm font-semibold text-neutral-800">Theme mode</p>
								<div className="space-y-2">
									<RadioRow
										checked={themeMode === 'light'}
										onClick={() => setThemeMode('light')}
										label="Light"
										description="Always use the light theme."
									/>
									<RadioRow
										checked={themeMode === 'dark'}
										onClick={() => setThemeMode('dark')}
										label="Dark"
										description="Always use the dark theme."
									/>
									<RadioRow
										checked={themeMode === 'system'}
										onClick={() => setThemeMode('system')}
										label="Device sync"
										description="Match your system appearance."
									/>
								</div>
							</div>

							<div className="space-y-2">
								<p className="text-sm font-semibold text-neutral-800">Main color palette</p>
								<select
									value={paletteKey}
									onChange={(e) => setPaletteKey(e.target.value as PaletteKey)}
									className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-black/30"
								>
									{Object.entries(PALETTES).map(([k, v]) => (
										<option key={k} value={k}>
											{v.label}
										</option>
									))}
								</select>
							</div>

							<div className="flex justify-end">
								<Button variant="sage">Save changes</Button>
							</div>
						</div>
					}
					right={
						<PreviewCard title="Palette preview">
							<PalettePreview paletteKey={paletteKey} />
						</PreviewCard>
					}
				/>
			</div>
		</div>
	);
}
