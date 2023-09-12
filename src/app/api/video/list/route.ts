import { PanelContentData, PanelFilterType, PanelRequestVariant } from '@/app/types';
import { prisma } from '@/utils/db';
import { updateHeaders } from '@/utils/http';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const headers = updateHeaders(req.headers);
    const content = await req.json() as unknown as PanelContentData;

    if (!content) {
        return new NextResponse(null, {status: 400, headers})
    }

    if (content.type === PanelFilterType.Categories) {
        const filter = content.filter as PanelRequestVariant[];
        const request = [];
        for (const variant of filter) {
            const inCategories  = [];
            const outCategories = [];
            for (const category of variant.categories) {
                if (category.not) {
                    outCategories.push(category.id);
                } else {
                    inCategories.push(category.id);
                }
            }
            request.push({
                categories: {
                    every: {
                        AND: [
                            {id: {in: inCategories}},
                            {id: {notIn: outCategories}}
                        ]
                    }
                }
            });
        }
        
        const result = await prisma.videoData.findMany({
            include: { categories: true },
            where: {
                OR: request
            }
        });
        return NextResponse.json(result, {headers});
    }
    return NextResponse.json([], {headers});
}