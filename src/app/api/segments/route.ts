import { SegmentRequestBody } from '@/app/types';
import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { createStorageApi, StorageApi } from '@videolot/videolot-cloud-wrapper';

const storage: StorageApi = createStorageApi();

class ViRoute {
    async GET(req: NextRequest) {
        const trackId = req.nextUrl.searchParams.get('trackId');
        const segment = req.nextUrl.searchParams.get('segment');
        if (!trackId || !segment) {
            return new Response(null, {status: 404});
        }
    
        const trackInfo = await prisma.trackInfo.findFirst({where: {id: trackId}});
        if (!trackInfo) {
            return new Response(null, {status: 404});
        }
    
        let extension = '';
        //TODO: move file information in to track
        if (trackInfo.codec.includes('video')) {
            extension = 'webm';
        } else if (trackInfo.codec.includes('audio')) {
            extension = 'mp3';
        }
    
        const filepath = `${trackInfo.trackPath}/part${segment}.${extension}`;
        const storageObject = await storage.getObject(filepath);
    
        const responseHeaders = new Headers(req.headers);
        responseHeaders.set('Content-Type', trackInfo.codec);
        responseHeaders.set('Content-Length', storageObject.contentLength.toString());
        return new NextResponse(storageObject.stream, {headers: responseHeaders});
    }
}

const route = new ViRoute();
export const GET = route.GET;