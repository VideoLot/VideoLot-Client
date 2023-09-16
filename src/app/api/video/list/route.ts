import { PanelContentData, PanelFilterType, PanelRequestVariant } from '@/app/types';
import { prisma } from '@/utils/db';
import { updateHeaders } from '@/utils/http';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const request = req.nextUrl.searchParams.get('search') || '';
    const headers = updateHeaders(req.headers);

    const result = await prisma.videoData.findMany({
        where: {
            title: {
                contains: request,
                mode: 'insensitive'
            }
        }
    });
    return NextResponse.json(result, {headers});
}

export async function POST(req: NextRequest) {
    const headers = updateHeaders(req.headers);
    const content = await req.json() as unknown as PanelContentData;

    if (!content) {
        return new NextResponse(null, {status: 400, headers})
    }

    if (content.type === PanelFilterType.Categories) {
        const filter = content.filter as PanelRequestVariant[];
        const variants = [];
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

            if(variant.isStrict) {
                variants.push({
                    categories: {
                        every: {id: {in: inCategories}}
                    }
                });
            } else {
                const requireEach = variant.categories.map(x => {
                    return {
                        categories: {
                            some: {id: x.id}
                        }
                    };
                });
                variants.push({
                    AND: [
                        ...requireEach,
                        {
                            categories: {
                                none: {
                                    id: {in: outCategories}
                                }
                            }
                        }
                    ]
                });
            }
        }
        
        const result = await prisma.videoData.findMany({
            include: { categories: true },
            where: {
                OR: variants
            }
        });
        return NextResponse.json(result, {headers});
    }

    if (content.type === PanelFilterType.List) {
        const list = content.filter as string[];
        const result = await prisma.videoData.findMany({
            where: {id: {in: list}}
        });
        return NextResponse.json(result, {headers});
    }
    return NextResponse.json([], {headers});
}