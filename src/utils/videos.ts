import { prisma } from './db';

export async function GetVideosForPanel() {
    const videos = await prisma.videoData.findMany();
    return videos;
}