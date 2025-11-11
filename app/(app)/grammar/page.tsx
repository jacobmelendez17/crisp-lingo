// app/(app)/grammar/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/learn/ViewToggle';

import { BRAND, IMAGE } from '@/lib/constants';
import { LEVEL_RANGES, parseRangeKey } from '@/lib/learn/ranges';
import { groupByLevelId } from '@/lib/learn/group';
import { fetchLevels, sliceLevels, fetchGrammarForLevels } from '@/lib/learn/fetch';

// NEW: reuse the same list/grid pieces used on Vocabulary
import { LevelSection } from '@/components/learn/LevelSection';
import { LearnCardGrid } from '@/components/learn/LearnCardGrid';
import { LearnList } from '@/components/learn/LearnList';
import type { LearnItem } from '@/components/learn/types';

// NOTE: include 'view' in searchParams to match Vocabulary
type PageProps = { searchParams: Promise<{ range?: string; view?: 'cards' | 'list' }> };

export default async function GrammarPage({ searchParams }: PageProps) {
	const sp = await searchParams;
	const { userId } = await auth();

	const { start, end, key } = parseRangeKey(sp?.range);
	const view: 'cards' | 'list' = sp?.view === 'list' ? 'list' : 'cards';

	const all = await fetchLevels();
	const selected = await sliceLevels(all, start, end);
	const selectedIds = selected.map((l) => l.id);

	const rows = await fetchGrammarForLevels(selectedIds, userId);
	const groups = groupByLevelId(rows);

	// Build toggle hrefs just like Vocabulary
	const hrefCards = key === '1-10' ? '/grammar' : `/grammar?range=${key}`;
	const hrefList = key === '1-10' ? '/grammar?view=list' : `/grammar?range=${key}&view=list`;

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			<h1 className="pt-2 text-center text-5xl font-bold text-neutral-800">Grammar</h1>

			{/* Header row with range pills centered and toggle right, identical layout to Vocabulary */}
			<div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center">
				<div />
				<div className="flex flex-wrap items-center justify-center gap-2">
					{LEVEL_RANGES.map((r) => {
						const href =
							r === '1-10'
								? view === 'cards'
									? '/grammar'
									: '/grammar?view=list'
								: view === 'cards'
									? `/grammar?range=${r}`
									: `/grammar?range=${r}&view=list`;
						const isActive = r === key;
						return (
							<Link key={r} href={href}>
								<Button
									variant={isActive ? 'default' : 'secondary'}
									className={isActive ? 'bg-[#97ac82] text-white hover:opacity-90' : ''}
								>
									{r}
								</Button>
							</Link>
						);
					})}
				</div>
				<div className="justify-self-end">
					<ViewToggle active={view} hrefCards={hrefCards} hrefList={hrefList} />
				</div>
			</div>

			{selected.map((lvl, idx) => {
				const rowsForLevel = groups.get(lvl.id) ?? [];

				// Normalize grammar rows into LearnItem for both views
				const items: LearnItem[] = rowsForLevel.map((r) => ({
					id: r.id,
					href: `/grammar/${encodeURIComponent(r.title)}`,
					imageUrl:
						r.imageUrl && r.imageUrl.startsWith('/')
							? r.imageUrl
							: r.imageUrl
								? `/${r.imageUrl}`
								: undefined,
					primary: r.title,
					secondary: r.structure
				}));

				const isEmpty = items.length === 0;

				return (
					<LevelSection
						key={lvl.id}
						first={idx === 0}
						title={lvl.title || `Level ${start + idx}`}
						showEmpty={isEmpty}
						headerBg={BRAND.primary}
					>
						{isEmpty ? null : view === 'list' ? (
							<LearnList items={items} imageFallback={IMAGE.fallback} />
						) : (
							<LearnCardGrid items={items} imageFallback={IMAGE.fallback} />
						)}
					</LevelSection>
				);
			})}
		</main>
	);
}
