import { get } from "@/utils/fetch";
import { TrackInfo } from "@videolot/videolot-prisma";
import { SEGMENTS } from '@/app/constants'
import { TimeRange, isInRange } from './utils';

export type UpdateListener = ()=>void;

export class SourceLoader {
    private _trackInfo: TrackInfo;
    private _buffer: SourceBuffer;
    private _bufferedTime = 15;
    private _dataQueue: ArrayBuffer[] = [];
    private _listeners: UpdateListener[] = [];

    /**
     *
     */
    constructor(trackInfo: TrackInfo, buffer: SourceBuffer) {
        this._trackInfo = trackInfo;
        this._buffer = buffer;
        this._buffer.addEventListener("updateend", (event: Event) => {
            this._listeners.forEach(x => x());
            if (this._dataQueue.length > 0) {
                const segment = this._dataQueue.shift() as ArrayBuffer;
                this._buffer.appendBuffer(segment);
            }
        });
    }

    isReadyForPlaybackAtPosition(pos: number): boolean {
        const range = isInRange(pos, this._buffer.buffered);
        return !!range;
    }

    async setPlaybackPosition(pos: number) {
        let bufferedTime = 0;

        const range = isInRange(pos, this._buffer.buffered);
        let timeRangeEnd = pos;
        if (range) {
            bufferedTime = range.end - pos;
            timeRangeEnd = range.end;
        }

        if (bufferedTime < this._bufferedTime) {
            const desiredFragment = Math.floor(timeRangeEnd / 2);
            if (desiredFragment >= this._trackInfo.segmentsCount) {
                return;
            }
            const res = await this.loadSegment(desiredFragment);
            const data = await res.arrayBuffer();
            if (this._buffer.updating) {
                this._dataQueue.push(data);
            } else {
                this._buffer.appendBuffer(data);
            }
        }
    }

    getLoadedRanges() {
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

    description() {
        return this._trackInfo.trackPath;
    }

    addUpdateListener(listener: UpdateListener){
        this._listeners.push(listener);
    }

    private async loadSegment(segmentNumber: number) {
        return await get(SEGMENTS)
            .withParam('trackId', this._trackInfo.id)
            .withParam('segment', segmentNumber.toString())
            .send();
    }
}
