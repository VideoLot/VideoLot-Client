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

export class SegmentBuffer {
    private _num: number;
    private _data: ArrayBuffer;

    constructor(num: number, data: ArrayBuffer) {
        this._num = num;
        this._data = data;
    }

    public get num() {
        return this._num;
    }

    public get data() {
        return this._data;
    }

    public toString() {
        return this._num.toString();
    }
}
