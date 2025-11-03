import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

import { LevelSection } from '@/components/learn/LevelSection';
import { LearnCardGrid } from '@/components/learn/LearnCardGrid';
import { LearnList } from '@/components/learn/LearnList';
import type { LearnItem } from '@/components/learn/types';
import { IMAGE, BRAND } from '@/lib/constants';
import { LEVEL_RANGES, parseRangeKey } from '@/lib/learn/ranges';
import { groupByLevelId } from '@/lib/learn/group';
import { fetchLevels, sliceLevels, fetchVocabForLevels } from '@/lib/learn/fetch';
import { ViewToggle } from '@/components/learn/ViewToggle';

type PageProps = { searchParams: Promise<{ range?: string; view?: 'cards' | 'list' }> };

export default async function VocabularyPage({ searchParams }: PageProps) {
	const sp = await searchParams;
	const { userId } = await auth();
	const { start, end, key } = parseRangeKey(sp?.range);
	const view = sp?.view === 'list' ? 'list' : 'cards';

	const all = await fetchLevels();
	const selected = await sliceLevels(all, start, end);
	const selectedIds = selected.map((l) => l.id);

	const rows = await fetchVocabForLevels(selectedIds, userId);
	const groups = groupByLevelId(rows);

	// Hrefs for the sliding toggle (preserve current range)
	const hrefCards = key === '1-10' ? '/vocabulary' : `/vocabulary?range=${key}`;
	const hrefList = key === '1-10' ? '/vocabulary?view=list' : `/vocabulary?range=${key}&view=list`;

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			{/* Title */}
			<div className="flex items-center justify-between gap-4">
				<h1 className="pt-2 text-5xl font-bold text-neutral-800">Vocabulary</h1>

				{/* Right-justified sliding toggle */}
				<ViewToggle active={view} hrefCards={hrefCards} hrefList={hrefList} />
			</div>

			{/* Level ranges centered beneath (or change to justify-start for left align) */}
			<div className="mt-4 flex w-full items-center justify-center">
				<div className="flex flex-wrap items-center justify-center gap-2">
					{LEVEL_RANGES.map((r) => {
						const href =
							r === '1-10'
								? view === 'cards'
									? '/vocabulary'
									: '/vocabulary?view=list'
								: view === 'cards'
									? `/vocabulary?range=${r}`
									: `/vocabulary?range=${r}&view=list`;
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
			</div>

			{/* Sections */}
			{selected.map((lvl, idx) => {
				const rowsForLevel = groups.get(lvl.id) ?? [];
				const items: LearnItem[] = rowsForLevel.map((r) => ({
					id: r.id,
					href: `/vocabulary/${encodeURIComponent(r.word)}`,
					imageUrl: r.imageUrl || undefined,
					primary: r.word, // RIGHT in list
					secondary: r.translation // LEFT in list
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
						{view === 'list' ? (
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
