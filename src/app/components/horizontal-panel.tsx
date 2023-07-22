import { PanelProps } from "@/app/types";
import Preview from "./preview";
import { GetVideosForPanel } from "@/utils/videos";

export default async function HorizontalVideoPanel(props: PanelProps) {
    const videos = await GetVideosForPanel();
    
    return (
        <div>
            <div>
                <h2>{props.title}</h2>
            </div>
            <div className='flex flex-nowrap space-x-1 md:space-x-2 overflow-x-auto'>
                {/* { 
                    videos.map((x)=> (
                    <Preview key={x.id} previewData={x}/>
                    ))
                } */
                <>
                 <Preview key={videos[1].id} previewData={videos[1]}/>
                 <Preview key={videos[0].id} previewData={videos[0]}/>
                 <Preview key={videos[0].id} previewData={videos[0]}/>
                 <Preview key={videos[0].id} previewData={videos[0]}/>
                 <Preview key={videos[0].id} previewData={videos[0]}/>
                 <Preview key={videos[0].id} previewData={videos[0]}/>
                </>


                }
            </div>
        </div>
    );
} 