import { prisma } from "@/utils/db";
import { GetVideoData } from "@/utils/videos";
import { NextResponse } from "next/server";
import { IdParam } from "../../_lib/types";
import { minimalRole } from '../../_lib/decorators';
import { UserRole } from '@videolot/videolot-prisma';

class ViVideoRoute {
    async GET(req: Request, {params}: {params: IdParam}) {
        const videoData = await GetVideoData(params.id);
    
        return NextResponse.json(videoData);
    }
    
    @minimalRole(UserRole.Admin)
    async PUT(req: Request, {params}: {params: IdParam}) {
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
    
        return new Response(null, {status:200});
    }
}

const route = new ViVideoRoute();
export const GET = route.GET;
export const PUT = route.PUT;
