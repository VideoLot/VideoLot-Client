import { prisma } from '@/utils/db';
import { IdParam } from "../../_lib/types";
import { NextRequest, NextResponse } from 'next/server';
import { updateHeaders } from '@/utils/http';

export async function GET(req: NextRequest, param: IdParam) {
    const headers = updateHeaders(req.headers);
    const panel = await prisma.panel.findUnique({where: {id: param.id}});
    if (!panel) {
        return new NextResponse(null, {status: 404, headers});
    }
    return NextResponse.json(panel, {headers: headers});
}

export async function PUT(req:NextRequest, params: IdParam) {
    const headers = updateHeaders(req.headers);
    const newData = await req.json();
    const panel = await prisma.panel.update({
        where: {id: params.id},
        data: newData
    })

    if (!panel) {
        return new NextResponse(null, {status: 404, headers});
    }
    return NextResponse.json(panel);
}