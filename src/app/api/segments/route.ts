import { SegmentRequestBody } from "@/app/types";
import { GetFtpClient } from "@/utils/ftp-utils";
import { NextResponse } from "next/server";
import { Writable } from 'stream';

export async function POST(req: Request) {
    const ftpData = new Array<Buffer>();
    let videoData = Buffer.alloc(0);
    const body = (await req.json()) as SegmentRequestBody;
    
    const ftpStream = new Writable({write: (chunk, encoding, callback) => {
        ftpData.push(chunk);
        callback();
    }, final(callback) {
        videoData = Buffer.concat(ftpData);
        callback();
    }});

    const ftpClient = await GetFtpClient();
    const ftpResponse = await ftpClient.downloadTo(ftpStream, 
        `/${body.video}/${body.contentType}/${body.quality}/part${body.segment}.webm`);

    const fetchData = new ReadableStream<Buffer>({
        type: 'bytes',
        start (controller: ReadableStreamDefaultController) {},
        pull (controller: ReadableStreamDefaultController) {
            controller.enqueue(videoData)
            controller.close();
        },
        cancel() {},
    } as unknown as UnderlyingDefaultSource);

    const responseHeaders = new Headers(req.headers);
    responseHeaders.set('Content-Type', 'video/webm');
    responseHeaders.set('Content-Length', videoData? videoData.length.toString(): '0');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return new NextResponse(fetchData, {headers: responseHeaders});
}