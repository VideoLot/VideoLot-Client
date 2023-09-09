import { prisma } from "@/utils/db";
import { updateHeaders } from "@/utils/http";
import { GetVideoData } from "@/utils/videos";
import { NextResponse } from "next/server";
import { IdParam } from "../../_lib/types";


export async function GET(req: Request, {params}: {params: IdParam}) {
    const videoData = await GetVideoData(params.id);

    const responseHeaders = updateHeaders(req.headers);
    return NextResponse.json(videoData, {headers: responseHeaders});
}

export async function PUT(req: Request, {params}: {params: IdParam}) {
    const videoData = await GetVideoData(params.id);
    const reqData = await req.json();
    const data = {} as any;


    if (reqData.avaliableForTiers) {
        const requestTiers = reqData.avaliableForTiers as [string];
        const existingTiers = videoData.avaliableForTiers.map(x=>x.id); 

        const connectingTiers = requestTiers
            .filter( t => !existingTiers.includes(t))
            .map(x => {return {id: x}});
        const disconnectionTiers = existingTiers
            .filter(et => !requestTiers.includes(et))
            .map(x => {return {id: x}})
        
        data.avaliableForTiers = {
            connect: connectingTiers,
            disconnect: disconnectionTiers
        };
    }

    
    await prisma.videoData.update({
        where: {id: params.id},
        data: data
    });

    const headers = updateHeaders(req.headers);
    return new Response(null, {status:200, headers});
}