import { PrismaClient, Prisma } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
    await prisma.videoData.deleteMany({});
    await prisma.trackInfo.deleteMany({});
    await prisma.videoTrack.deleteMany({});

    const bbbShort = {
        id: 'cljndf3ts00002pbgihgtbjyq',
        title: 'BigBuckBunny short video',
        tags: ['video', 'Заяц', 'blender', 'short', 'короткое'],
        previewURL: '/PreviewPlaceholder.png',
        alt: 'keyboard',
        views: 0,
        uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24)
    };
    const bbbLong = {
        id: 'cljndm54n00012pbg1ys0y40p',
        title: 'BigBuckBunny полное видео, с динным заголовком и разными символами',
        tags: ['video', 'Заяц', 'blender', 'полное', 'full'],
        previewURL: '/PreviewPlaceholder.png',
        alt: 'keyboard',
        views: 0,
        uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    };
    await prisma.videoData.createMany({data: [bbbShort, bbbLong]});

    const shortBbbVideoTrack = {
        videoData: {connect: {id: bbbShort.id}},
        trackInfo: { 
            create: {
                segmentsCount: 3,
                duration: 10000,
                codec:'vp8',
                trackPath: 'cljndf3ts00002pbgihgtbjyq\\video\\1080\\',
                quality: '1080'
            }
        }
    } as Prisma.VideoTrackCreateInput;
    const longBbbVideoTrack = {
        videoData: {connect: {id: bbbLong.id}},
        trackInfo: { 
            create: {
                segmentsCount: 318,
                duration: 636000,
                codec:'video/vp8',
                trackPath: 'cljndm54n00012pbg1ys0y40p\\video\\1080\\',
                quality: '1080'
            }
        }
    } as Prisma.VideoTrackCreateInput;
    const longBbbAudioTrack = {
        videoData: {connect: {id: bbbLong.id}},
        trackInfo: {
            create: {
                segmentsCount: 318,
                duration: 636000,
                codec:'audio/mpeg',
                trackPath: 'cljndm54n00012pbg1ys0y40p\\audio\\track1\\',
                quality: '1080'
            }
        }
    } as Prisma.AudioTrackCreateInput;
    await prisma.videoTrack.create({data: shortBbbVideoTrack});
    await prisma.videoTrack.create({data: longBbbVideoTrack});
    await prisma.audioTrack.create({data: longBbbAudioTrack});
}

main().then(async () => {
    await prisma.$disconnect();
}).catch (async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
});
