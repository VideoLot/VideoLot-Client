import { VideoDataExtended } from '@/app/types';
import { prisma } from './db';
import { VideoData } from '@prisma/client';

export async function GetVideosForPanel() {
    const videos = await prisma.videoData.findMany();
    return videos;
}

export async function GetVideosIds() {
    const videos = await GetVideosForPanel();
    return videos.map((video) => ({
        view: video.id
    }));
}

export async function GetVideoData(id: string): Promise<VideoDataExtended> {
    return await prisma.videoData.findFirst({
        where: { id: id},
        include: {
            videoTrack: {
                include: {
                    trackInfo: true
                }
            },
            avaliableForTiers: true
        }
    }) as unknown as VideoDataExtended;
}