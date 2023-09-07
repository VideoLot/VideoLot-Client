import Player from './player';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import { prisma } from '@/utils/db';
import { UserRole } from '@videolot/videolot-prisma';
import { PlayerData } from '@/app/types';

export const dynamic = 'force-dynamic';

export async function PlayerConditional({ data }: { data: PlayerData; }) {
    const session = await getServerSession(authOptions);

    const videoHasTiers = data.avaliableForTiers.length > 0;
    const userAuthenticated = session && session.user;
    let higherThanUser = false;
    let userTierMatch = false;

    if (userAuthenticated) {
        const castedUser = session.user as any; 
        higherThanUser = castedUser.role && castedUser.role !== UserRole.User;

        const userData = await prisma.user.findFirst({
            where: {email: castedUser.email},
            include: {
                history: true
            }
        });
        if (userData) {
            const activeSubscription = userData.history.findLast(x => x.expirationDate.getTime() > Date.now());
            if (activeSubscription) {
                userTierMatch = !!data.avaliableForTiers.find(x => x.id === activeSubscription.subscribtionTierId);
            }
        }
    }
    

    if (!data) {
        return null;
    }
    if (higherThanUser || userTierMatch) {
        return <Player id={data.id}
                    title={data.title} 
                    previewURL={data.previewURL} 
                    alt={data.alt}
                    tags={data.tags}
                    views={data.views}
                    updatedAt={data.updatedAt}
                    createdAt={data.createdAt}
                    uploadedDate={data.uploadedDate}
                    videoTrack={data.videoTrack} 
                    audioTracks={data.audioTracks}
                    avaliableForTiers={data.avaliableForTiers}></Player>;
    }
    return <p>Video unavailable</p>
}
