export type Group<T> = Map<number, T[]>;

export function groupByLevelId<T extends { levelId: number }>(rows: T[]): Group<T> {
    const map = new Map<number, T[]>();
    for (const r of rows) {
        if (!map.has(r.levelId)) map.set(r.levelId, []);
        map.get(r.levelId)!.push(r);
    }
    return map;
}