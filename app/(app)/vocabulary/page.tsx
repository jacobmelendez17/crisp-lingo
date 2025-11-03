// app/(app)/vocabulary/page.tsx  (only header area shown; rest of file unchanged)
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { LevelSection } from '@/components/learn/LevelSection';
import { LearnCardGrid } from '@/components/learn/LearnCardGrid';
import { LearnList } from '@/components/learn/LearnList';
import { ViewToggle } from '@/components/learn/ViewToggle';
import type { LearnItem } from '@/components/learn/types';
import { IMAGE, BRAND } from '@/lib/constants';
import { LEVEL_RANGES, parseRangeKey } from '@/lib/learn/ranges';
import { groupByLevelId } from '@/lib/learn/group';
import { fetchLevels, sliceLevels, fetchVocabForLevels } from '@/lib/learn/fetch';

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

	const hrefCards = key === '1-10' ? '/vocabulary' : `/vocabulary?range=${key}`;
	const hrefList = key === '1-10' ? '/vocabulary?view=list' : `/vocabulary?range=${key}&view=list`;

	return (
		<main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
			{/* Title */}
			<h1 className="pt-2 text-center text-5xl font-bold text-neutral-800">Vocabulary</h1>

			{/* Controls row: center range buttons, toggle on the right */}
			<div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center">
				<div /> {/* left spacer */}
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
				<div className="justify-self-end">
					<ViewToggle active={view} hrefCards={hrefCards} hrefList={hrefList} />
				</div>
			</div>

			{/* ...keep the rest of your sections rendering as-is... */}

			{/* Level Sections */}
			{selected.map((lvl, idx) => {
				const rowsForLevel = groups.get(lvl.id) ?? [];
				const items: LearnItem[] = rowsForLevel.map((r) => ({
					id: r.id,
					href: `/vocabulary/${encodeURIComponent(r.word)}`,
					imageUrl: r.imageUrl || undefined,
					primary: r.word,
					secondary: r.translation
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
