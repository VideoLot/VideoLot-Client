import { TrackInfo } from "@prisma/client";
import { SourceLoader } from "./source-loader";
// import { BufferLoader } from "./buffer-loader";

export class BufferPull {
    private _pull: SourceLoader[] = [];
    private _mediaSource: MediaSource;

    constructor(source: MediaSource) {
        this._mediaSource = source;
    }

    createSourceWithLoader(trackInfo: TrackInfo): SourceLoader {
        const sourceBuffer = this._mediaSource.addSourceBuffer(trackInfo.codec);
        const loader = new SourceLoader(trackInfo, sourceBuffer);
        this._pull.push(loader);
        return loader;
    }

    async setPlaybackPosition(pos: number) {
        const pullPromises = this._pull.map(x => x.setPlaybackPosition(pos));
        Promise.all(pullPromises);
    }
}

