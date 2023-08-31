import { get } from "@/utils/fetch";
import { TrackInfo } from "@prisma/client";
import { SEGMENTS } from '@/app/constants'


export class SourceLoader {
    private _fragmentEndpoint = new URL('api/segments', process.env.NEXT_PUBLIC_API_URL as string);
    private _trackInfo: TrackInfo;
    private _buffer: SourceBuffer;
    private _bufferedTime = 1000 * 15;
    private _rangesQueue: ArrayBuffer[] = [];

    /**
     *
     */
    constructor(trackInfo: TrackInfo, buffer: SourceBuffer) {
        this._trackInfo = trackInfo;
        this._buffer = buffer;
        this._buffer.addEventListener("updateend", (event: Event) => {
            if (this._rangesQueue.length > 0) {
                const segment = this._rangesQueue.shift() as ArrayBuffer;
                this._buffer.appendBuffer(segment);
            }
        });
    }

    async setPlaybackPosition(pos: number) {
        let bufferedTime = 0;
        let timeRangeEnd = 0;
        for (let i = 0; i < this._buffer.buffered.length; i++) {
            const start = this._buffer.buffered.start(i) * 1000;
            const end = this._buffer.buffered.end(i) * 1000;

            if (pos >= start && pos <= end) {
                bufferedTime = end - pos;
                timeRangeEnd = end;
                break;
            }
        }

        if (bufferedTime < this._bufferedTime) {
            const desiredFragment = Math.floor(timeRangeEnd / 2000);
            if (desiredFragment > this._trackInfo.segmentsCount) {
                return;
            }
            const res = await this.loadSegment(desiredFragment);
            const data = await res.arrayBuffer();
            if (this._buffer.updating) {
                this._rangesQueue.push(data);
            } else {
                this._buffer.appendBuffer(data);
            }
        }

    }

    async loadSegment(segmentNumber: number) {
        return await get(SEGMENTS)
            .withParam('trackId', this._trackInfo.id)
            .withParam('segment', segmentNumber.toString())
            .send();
    }
}
