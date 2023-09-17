import { PageOfVideos, PanelContentData, PanelFilterType, PanelRequestVariant, PlayerData } from '@/app/types';
import { prisma } from './db';

export async function GetVideosForPanel() {
    const videos = await prisma.videoData.findMany();
    return videos;
}

export async function GetPageOfVideo(pageSize: number, page: number, content: PanelContentData): Promise<PageOfVideos> {
    const skip = page * pageSize;
    const take = pageSize;

    let whereRequest;
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
        
        whereRequest = {
            OR: variants
        }
    }

    if (content.type === PanelFilterType.List) {
        const list = content.filter as string[];
        whereRequest = {
                id: {in: list}
            }
    }

    const [total, videos] = await prisma.$transaction([
        prisma.videoData.count({
            where: whereRequest,
        }),
        prisma.videoData.findMany({
            where: whereRequest,
            skip: skip,
            take: take
        })
    ]);
    return { totalVideos: total, videos: videos};
}

export async function GetVideosIds() {
    const videos = await GetVideosForPanel();
    return videos.map((video) => ({
        view: video.id
    }));
}

export async function GetVideoData(id: string): Promise<PlayerData> {
    return await prisma.videoData.findFirst({
        where: { id: id},
        include: {
            videoTrack: {
                include: {
                    trackInfo: true
                }
            },
            audioTracks: {
                include: {
                    trackInfo: true
                }
            },
            avaliableForTiers: true
        }
    }) as unknown as PlayerData;
}