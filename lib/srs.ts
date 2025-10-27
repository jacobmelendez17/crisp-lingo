export const SRS_INTERVALS_MS= [
    0,
    4 * 60 * 60 * 1000,
    8 * 60 * 60 * 1000,
    24 * 60 * 60 * 1000,
    48 * 60 * 60 * 1000,
    7 * 24 * 60 * 60 * 1000,
    14 * 24 * 60 * 60 * 1000,
    30 * 24 * 60 * 60 * 1000,
    120 * 24 * 60 * 60 * 1000
];

export function nextReviewAtFor(level: number, now = new Date()) {
    const ms = SRS_INTERVALS_MS[Math.max(0, Math.min(level, 8))] ?? 0;
    return new Date(now.getTime() + ms);
}