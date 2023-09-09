import { IdParam } from "@/app/api/_lib/types";
import { post } from "@/utils/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, {params}: {params: IdParam}) {
    const filename = req.nextUrl.searchParams.get('name') as string;
    const fullSize = req.nextUrl.searchParams.get('size') as string;
    const currentChunkIndex = req.nextUrl.searchParams.get('currentChunkIndex') as string;
    const totalChunks = req.nextUrl.searchParams.get('totalChunks') as string;

    let outputStream = null;
    if (req.body) {
        outputStream = await req.arrayBuffer();
    }
    
    const result = await post('/', process.env.PROCESSOR_URL)
        .withOctetBody(outputStream as ArrayBuffer)
        .withParam('id', params.id)
        .withParam('filename', filename)
        .withParam('currentChunkIndex', currentChunkIndex)
        .withParam('totalChunks', totalChunks)
        .send();
    return result;
}