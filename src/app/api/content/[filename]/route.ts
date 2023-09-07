import { updateHeaders } from "@/utils/http";
import { NextRequest, NextResponse } from "next/server";
import { createStorageApi } from 'videolot-cloud-wrapper';

const storage = createStorageApi();

interface ContentParams {
    filename: string
}

export async function GET(req: NextRequest, {params} : {params: ContentParams}) {
    const objectURI = storage.createPath('images', params.filename);
    const result = await storage.getObject(objectURI);

    const headers = updateHeaders(req.headers);
    headers.set('Content-Type', 'image/png');

    return new NextResponse(result.stream, { headers });
}

export async function POST(req: NextRequest, {params} : {params: ContentParams}) {
    const headers = updateHeaders(req.headers);
    headers.delete('Content-Type');
    headers.delete('Content-Length');
    const extension = params.filename.split('.')[1];
    const newFilename = `${Date.now()}.${extension}`;
    const objectURI = storage.createPath('images', newFilename);
    const data = await req.formData();
    const file = data.get('file') as File;
    const buffer = await file.arrayBuffer();

    const result = await storage.putObject(buffer, objectURI);
    if (result.status === 'OK') {
        const response = {
            address: `${process.env.NEXT_PUBLIC_API_URL}/api/content/${newFilename}`
        };
        return NextResponse.json(response, {headers, status: 200});
    } else {
        console.warn(`Failed putting object to media storage: ${newFilename}`, result.error);
        return NextResponse.error();
    }
}