import { PanelContentData, PanelProps } from "@/app/types";
import Preview from "./preview";
import { GetVideosForPanel } from "@/utils/videos";
import { Panel } from "@videolot/videolot-prisma";

export default async function HorizontalVideoPanel(props: Panel) {
    const videos = await GetVideosForPanel();
    
    return (
        <div>
            <div>
                <h2>{props.title}</h2>
            </div>
            <div className='flex flex-nowrap space-x-1 md:space-x-2 overflow-x-auto'>
                { 
                    videos.map((x)=> (
                    <Preview key={x.id} previewData={x}/>
                    ))
                }
            </div>
        </div>
    );
} 