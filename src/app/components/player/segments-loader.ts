import { SegmentRequestBody, VideoDataSequence as SegmentsSequence } from "@/app/types";

export type SegmentReadyCallback = (segmentNumber: number, data: ArrayBuffer)=> void;

enum SegmentStatus {
    Loading,
    Ready
}

interface Segment {
    status: SegmentStatus
    data?: ArrayBuffer
}

export class SegmentsLoader {
    private _fragmentEndpoint = new URL('api/segments', process.env.NEXT_PUBLIC_API_URL as string);
    private _videoSegments: Map<number, Segment> = new Map<number, Segment>();
    private _bufferSizeSegments = 3;
    private _segmentDuration = 2000;
    private _segmentsCount: number;
    private _videoId: string;
    private _segmentReady: SegmentReadyCallback;

    constructor(videoId: string, segmentsCount: number, segmentReady: SegmentReadyCallback) {
        this._videoId = videoId; 
        this._segmentsCount = segmentsCount;       
        this._segmentReady = segmentReady;
    }

    async getAllSegments() : Promise<SegmentsSequence> {
        for(let i = 0; i < this._segmentsCount; i++) {
            const response = await this.loadSegment(i);
            const data = await response.arrayBuffer()
            this._videoSegments.set(i, {status: SegmentStatus.Ready, data});
        }
        return Array.from(this._videoSegments.values()).map(x=>x.data as ArrayBuffer);
    }

    async setPlaybackPosition(newPosition: number) {
        console.log('SetPlaybackPosition');
        const newSegmentNumber = Math.floor(newPosition / this._segmentDuration);
        const desiredLoadedSegment = newSegmentNumber + this._bufferSizeSegments;
        const lastLoadedSegment = desiredLoadedSegment >= this._segmentsCount ? 
            this._segmentsCount - 1:
            desiredLoadedSegment;
            
        for(let i = newSegmentNumber; i <= lastLoadedSegment; i++) {
            if (this._videoSegments.has(i)) {
                const segment = this._videoSegments.get(i);
                if (segment?.status === SegmentStatus.Ready) {
                    this._segmentReady(i, this._videoSegments.get(i)?.data as ArrayBuffer);
                } else {
                    return;
                }
            } else {
                const segment = {status: SegmentStatus.Loading} as Segment;
                this._videoSegments.set(i, segment);
                const segmentRes = await this.loadSegment(i);
                if (segmentRes.ok) {
                    segment.data = await segmentRes.arrayBuffer();
                    segment.status = SegmentStatus.Ready
                    this._segmentReady(i, segment.data);
                } else {
                    this._videoSegments.delete(i)
                }
            }
        }
    }

    async loadSegment(segmentNumber: number) {
        const fragmentResponse = await fetch(this._fragmentEndpoint , {
            method: 'POST',
            body: JSON.stringify({
                video: this._videoId,
                quality: '1080',
                segment: segmentNumber,
                contentType: 'video'
            } as SegmentRequestBody)
        });
        
        return fragmentResponse;
    }
}