import { GetVideosForPanel } from "@/utils/videos";
import { ViewParams } from "../../types";
import Player, { PlayerProps } from "../../components/player/player";
import { prisma } from "@/utils/db";

export async function generateStaticParams() {
    const videos = await GetVideosForPanel();
        return videos.map((video) => ({
        view: video.id
    }));
}

export default async function View({params}: {params: ViewParams}) {
    const data = await prisma.videoData.findFirst({
        where: { id: params.view },
        include: {
            videoTrack: {
                include: {
                    trackInfo: true
                }
            }
        }
    });
    return (
        <div className="flex flex-col items-center justify-between">
            <PlayerConditional data={data as PlayerProps}></PlayerConditional>
            <h1>{data?.title}</h1>
        </div>
    );
}

function PlayerConditional({data}: {data: PlayerProps}) {
    if (!data) {
      return null;
    }
    return <Player id={data.id} previewURL={data.previewURL} videoTrack={data.videoTrack}></Player>;
  }