import { PanelContentData, PanelFilterType, PanelRequestVariant } from '@/app/types';
import { prisma } from '@/utils/db';
import { GetPageOfVideo } from '@/utils/videos';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const request = req.nextUrl.searchParams.get('search') || '';

    const result = await prisma.videoData.findMany({
        where: {
            title: {
                contains: request,
                mode: 'insensitive'
            }
        }
    });
    return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const pageSize = parseInt(params.get('pageSize') || '10');
    const pageNumber = parseInt(params.get('page') || '0');

    const content = await req.json() as unknown as PanelContentData;

    if (!content) {
        return new NextResponse(null, {status: 400})
    }

    const result = await GetPageOfVideo(pageSize, pageNumber, content);
    return NextResponse.json(result);
}