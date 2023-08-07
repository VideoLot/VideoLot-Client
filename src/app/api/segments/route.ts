import { SegmentRequestBody } from '@/app/types';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import { StorageApi } from '../_lib/storage-api/storage-api';
import { SelectelStorageApi } from '../_lib/storage-api/selectel-api';

const storage: StorageApi = new SelectelStorageApi();

export async function POST(req: Request) {
    const body = (await req.json()) as SegmentRequestBody;
    const trackInfo = await prisma.trackInfo.findFirst({where: {id: body.trackId}});
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

    const filepath = `${trackInfo.trackPath}/part${body.segment}.${extension}`;
    const storageObject = await storage.getObject(filepath);
    // const ftpClient = await GetFtpClient();
    // const filepath = `${trackInfo.trackPath}/part${body.segment}.${extension}`;
    // console.log(filepath);
    // const ftpResponse = await ftpClient.downloadTo(ftpStream, filepath);

    // const fetchData = new ReadableStream<Buffer>({
    //     type: 'bytes',
    //     start (controller: ReadableStreamDefaultController) {},
    //     pull (controller: ReadableStreamDefaultController) {
    //         controller.enqueue(videoData)
    //         controller.close();
    //     },
    //     cancel() {},
    // } as unknown as UnderlyingDefaultSource);

    const responseHeaders = new Headers(req.headers);
    responseHeaders.set('Content-Type', trackInfo.codec);
    responseHeaders.set('Content-Length', storageObject.contentLength.toString());
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return new NextResponse(storageObject.stream, {headers: responseHeaders});
}