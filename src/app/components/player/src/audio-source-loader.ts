import { TrackInfo } from '@videolot/videolot-prisma';
import { SEGMENT_DURATION, SourceLoader } from './source-loader';
import { isInRange } from './utils';

export class AudioSourceLoader extends SourceLoader {
    constructor(trackInfo: TrackInfo, buffer: SourceBuffer) {
        super(trackInfo, buffer);
    }

    private counterAudio = 0; // TODO Delete Me
    public async setPlaybackPosition(pos: number): Promise<void> {
        this.counterAudio++;
        const inRange = isInRange(pos, this._buffer.buffered);
        if (!inRange && this._buffer.buffered.length > 0) {
            this._downloadQueue.records = [];
            this._bufferingQueue.records = [];
            if (this._buffer.updating) {
                this._buffer.abort();
            }
            this._buffer.timestampOffset = Math.floor(pos / SEGMENT_DURATION) * SEGMENT_DURATION;
            this._buffer.remove(0, this._trackInfo.duration / 1000);
        }
        await super.setPlaybackPosition(pos)
    }

    protected handleBufferUpdate(event: Event): void {
        super.handleBufferUpdate(event);
    }
} 