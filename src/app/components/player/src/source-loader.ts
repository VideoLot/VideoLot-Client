import { get } from "@/utils/fetch";
import { TrackInfo } from "@videolot/videolot-prisma";
import { SEGMENTS } from '@/app/constants'
import { TimeRange, isInRange, SegmentBuffer } from './utils';
import { Queue } from './queue';

export const BUFFER_LENGTH = 15;
export const SEGMENT_DURATION = 2;

export type UpdateHandler = ()=>void;
export type QueueUpdateHandler = ([])=>void;

export class SourceLoader {
    protected _trackInfo: TrackInfo;
    protected _buffer: SourceBuffer;

    protected _downloadQueue = new Queue<number>();
    protected _bufferingQueue = new Queue<SegmentBuffer>();
    protected _updateListeners: UpdateHandler[] = [];

    protected _downloadedSegment: number | null = null;
    

    /**
     *
     */
    constructor(trackInfo: TrackInfo, buffer: SourceBuffer) {
        this._trackInfo = trackInfo;
        this._buffer = buffer;

        this._buffer.addEventListener("updateend", this.handleBufferUpdate.bind(this));
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
            const bufferedRanges = this.getBufferedRanges();
            const bufferedSegments = this.convertRangesToSegments(bufferedRanges);

            const readySegments = [...bufferedSegments, ...bufferingSegments];
            if (this._downloadedSegment !== null) {
                readySegments.push(this._downloadedSegment);
            }
            const normalizedSegments = this.removeIntersection(desiredSegments, readySegments);
            
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

    public _segmentsInBuffer :number[] = [];
    protected handleBufferUpdate(event: Event) {
        this._updateListeners.forEach(x => x());
        if (this._bufferingQueue.length > 0) {
            this.consumeBufferingQueue();
        }
    }

    protected async startUploadQueue() {
        while(this._downloadQueue.length > 0) {
            const segmentNumber = this._downloadQueue.dequeue() as number;
            this._downloadedSegment = segmentNumber;
            const res = await this.loadSegment(segmentNumber);
            if (res.ok) {
                const data = await res.arrayBuffer();
                this._bufferingQueue.enqueue(new SegmentBuffer(segmentNumber, data));
                if (!this._buffer.updating) {
                    this.consumeBufferingQueue();
                }   
            }
            this._downloadedSegment = null;
        }
    }

    protected consumeBufferingQueue() {
        const segment = this._bufferingQueue.dequeue() as SegmentBuffer;
        this._segmentsInBuffer.push(segment.num);
        this._buffer.appendBuffer(segment.data);
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
            const to = Math.round(range.end / SEGMENT_DURATION) - 1;
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


