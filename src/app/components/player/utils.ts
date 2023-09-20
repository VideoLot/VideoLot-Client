export type TimeRange = {
    start: number,
    end: number
}

export function isInRange(time: number, ranges: TimeRanges): TimeRange | null {
    for(let i = 0; i < ranges.length; i++) {
        if (ranges.start(i) <= time && ranges.end(i) >= time) {
            return { start: ranges.start(i), end: ranges.end(i) };
        }
    }
    return null;
}