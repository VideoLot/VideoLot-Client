import { get } from "@/utils/fetch";
import { TrackInfo } from "@videolot/videolot-prisma";
import { SEGMENTS } from '@/app/constants'
import { TimeRange, isInRange } from './utils';


const BUFFER_LENGTH = 15;
const SEGMENT_DURATION = 2;

export type UpdateHandler = ()=>void;
export type QueueUpdateHandler = ([])=>void;

class SegmentBuffer {
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
};

export class SourceLoader {
    private _trackInfo: TrackInfo;
    private _buffer: SourceBuffer;

    private _downloadQueue = new Queue<number>();
    private _bufferingQueue = new Queue<SegmentBuffer>();
    private _updateListeners: UpdateHandler[] = [];

    /**
     *
     */
    constructor(trackInfo: TrackInfo, buffer: SourceBuffer) {
        this._trackInfo = trackInfo;
        this._buffer = buffer;

        this._buffer.addEventListener("updateend", (event: Event) => {
            this._updateListeners.forEach(x => x());
            if (this._bufferingQueue.length > 0) {
                const segment = this._bufferingQueue.dequeue() as SegmentBuffer;
                this._buffer.appendBuffer(segment.data);
            }
        });
    }

    public isReadyForPlaybackAtPosition(pos: number): boolean {
        const range = isInRange(pos, this._buffer.buffered);
        return !!range;
    }

    public async setPlaybackPosition(pos: number) {
        let bufferedTime = 0;   

        const range = isInRange(pos, this._buffer.buffered);
        let timeRangeEnd = pos;
        if (range) {
            bufferedTime = range.end - pos;
            timeRangeEnd = range.end;
        }

        if (bufferedTime < BUFFER_LENGTH) {
            const segmentEnd = Math.min(this._trackInfo.duration / 1000, pos + BUFFER_LENGTH);
            const desiredSegments = this.convertRangesToSegments([{start: pos, end: segmentEnd}]);
            const bufferingSegments = this._bufferingQueue.records.map(x=> x.num);
            const bufferedSegments = this.convertRangesToSegments(this.getBufferedRanges());

            const normalizedSegments = this.removeIntersection(desiredSegments, [...bufferedSegments, ...bufferingSegments]);
            
            if (this._downloadQueue.length === 0) {
                this._downloadQueue.records = normalizedSegments;
                await this.startUploadQueue();
            } else {
                this._downloadQueue.records = normalizedSegments;
            }
            
        }
    }

    public getBufferedRanges() {
        const buffered = this._buffer.buffered;
        const result : TimeRange[] = [];
        for (let i = 0;i < buffered.length; i++) {
            result.push({
                start:  buffered.start(i),
                end: buffered.end(i)
            });
        }
        return result;
    }

    public get downloadQueue() {
        return this._downloadQueue;
    }

    public get bufferQueue() {
        return this._bufferingQueue;
    }

    public get description() {
        return this._trackInfo.trackPath;
    }

    public addUpdateListener(listener: UpdateHandler){
        this._updateListeners.push(listener);
    }

    private async startUploadQueue() {
        while(this._downloadQueue.length > 0) {
            const segmentNumber = this._downloadQueue.dequeue() as number;
            const res = await this.loadSegment(segmentNumber);
            if (res.ok) {
                const data = await res.arrayBuffer();
                if (this._buffer.updating) {
                    this._bufferingQueue.enqueue(new SegmentBuffer(segmentNumber, data));
                } else {
                    this._buffer.appendBuffer(data);
                }   
            }
        }
    }
    
    private async loadSegment(segmentNumber: number) {
        return await get(SEGMENTS)
            .withParam('trackId', this._trackInfo.id)
            .withParam('segment', segmentNumber.toString())
            .send();
    }

    private convertRangesToSegments(ranges: TimeRange[]): number[] {
        const result: number[] = [];
        for(const range of ranges) {
            const from = Math.floor(range.start / SEGMENT_DURATION);
            const to = Math.floor(range.end / SEGMENT_DURATION) - 1;
            for (let i = from; i <= to; i++) {
                result.push(i);
            }
        }
        
        return result;
    }

    private removeIntersection(from: number[], value: number[]) {
        const result = [];
        for(const el of from) {
            if (!value.includes(el)) {
                result.push(el);
            }
        }
        return result;
    }
}

export class Queue<T> {
    private _records: T[] = [];
    private _listeners: ((queue: T[])=>void)[] = [];

    public enqueue(...records: T[]) {
        this._records.push(...records);
        this.fireQueueUpdate();
    }

    public dequeue(): T | undefined {
        const element = this._records.shift();
        this.fireQueueUpdate();
        return element;
    }

    public get records() {
        return this._records;
    }

    public set records(value: T[]) {
        this._records = value;
        this.fireQueueUpdate();
    }

    public get length(): number {
        return this._records.length;
    }

    public addListener(listener: (queue: T[])=>void) {
        this._listeners.push(listener);
    }

    private fireQueueUpdate() {
        for(const listener of this._listeners) {
            listener(this._records);
        }
    }

}
