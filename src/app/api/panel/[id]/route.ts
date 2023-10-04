import { prisma } from '@/utils/db';
import { IdParam } from "../../_lib/types";
import { NextRequest, NextResponse } from 'next/server';
import { minimalRole } from '../../_lib/decorators';
import { UserRole } from '@videolot/videolot-prisma';


class ViPanelRoute {
    async GET(req: NextRequest, {params}: {params: IdParam}) {
        const panel = await prisma.panel.findUnique({where: {id: params.id}});
        if (!panel) {
            return new NextResponse(null, {status: 404});
        }
        return NextResponse.json(panel);
    }
    
    @minimalRole(UserRole.Admin)
    async PUT(req:NextRequest, {params}: {params: IdParam}) {
        const newData = await req.json();
        const panel = await prisma.panel.update({
            where: { id: params.id },
            data: newData
        })
    
        if (!panel) {
            return new NextResponse(null, {status: 404});
        }
        return NextResponse.json(panel);
    }

    @minimalRole(UserRole.Admin)
    async POST(req:NextRequest) {
        const newData = await req.json();
        newData.version = 1;
        const newPanel = await prisma.panel.create({data: newData});

        return NextResponse.json(newPanel);
    }
}

const route = new ViPanelRoute();
export const GET = route.GET;
export const PUT = route.PUT;
export const POST = route.POST;
