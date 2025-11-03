export const LEVEL_RANGES = ['1-10', '11-20', '21-30', '31-40', '41-50'] as const;
export type RangeKey = typeof LEVEL_RANGES[number];

export function parseRangeKey(r?: string): {start: number, end: number; key: RangeKey } {
    const key = (LEVEL_RANGES.includes(r as RangeKey) ? (r as RangeKey) : '1-10') as RangeKey;
    const [a, b] = key.split('-').map(Number);
    return { start: a, end: b, key };
}