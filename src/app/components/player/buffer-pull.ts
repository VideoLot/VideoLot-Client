import { TrackInfo } from '@videolot/videolot-prisma';
import { SourceLoader } from './source-loader';

export type ReadyForPlaybackHandler = (pos: number)=>void;

export class BufferPull {
    private _pull: SourceLoader[] = [];
    private _mediaSource: MediaSource;
    private _currentPosition: number;
    private _waitUntilUpdateDone: boolean;
    private _onReadyForPlayback: ReadyForPlaybackHandler;

    constructor(source: MediaSource, onReadyForPlayback: ReadyForPlaybackHandler) {
        this._waitUntilUpdateDone = false;
        this._currentPosition = 0
        this._mediaSource = source;
        this._onReadyForPlayback = onReadyForPlayback;
    }

    createSourceWithLoader(trackInfo: TrackInfo): SourceLoader {
        const sourceBuffer = this._mediaSource.addSourceBuffer(trackInfo.codec);
        const loader = new SourceLoader(trackInfo, sourceBuffer);
        loader.addUpdateListener(() => this.handleSourceUpdated(loader));
        this._pull.push(loader);
        return loader;
    }

    async setPlaybackPosition(pos: number) {
        this._currentPosition = pos;
        if (!this.isReadyForPlaybackAtPosition(pos)) {
            this._waitUntilUpdateDone = true;
        }
        const pullPromises = this._pull.map(x => x.setPlaybackPosition(pos));
        Promise.all(pullPromises);
    }

    isReadyForPlaybackAtPosition(pos: number): boolean {
        return this._pull.every(x=>x.isReadyForPlaybackAtPosition(pos));
    }

    private handleSourceUpdated(loader: SourceLoader) {
        if(this._waitUntilUpdateDone) {
            if (this.isReadyForPlaybackAtPosition(this._currentPosition)) {
                this._waitUntilUpdateDone = false;
                this._onReadyForPlayback(this._currentPosition);
            }
        }
    }
}

