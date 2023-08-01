import { GetVideosIds, GetVideoData } from '@/utils/videos';
import { ViewProps } from '../../types';
import { PlayerData } from '../../components/player/player';
import { prisma } from '@/utils/db';
import { PlayerConditional } from '../../components/player/player-conditional';

export async function generateStaticParams() {
    return await GetVideosIds();
}

export default async function View({params}: {params: ViewProps}) {
    const data = await GetVideoData(params.view);

    return (
        <div className="flex flex-col items-center justify-between">
            <PlayerConditional data={data as PlayerData}></PlayerConditional>
            <h1>{data?.title}</h1>
        </div>
    );
}

