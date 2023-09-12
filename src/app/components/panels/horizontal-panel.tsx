import Preview from "../preview";
import { GetVideosForPanel } from "@/utils/videos";
import { Panel } from "@videolot/videolot-prisma";
import SettingsWrapper from "../settings-wrapper";
import PanelSettings from "./panel-settings";

export default async function HorizontalVideoPanel(props: Panel) {
    const videos = await GetVideosForPanel();
    
    const panelSettings = () => {
        return <div className='p-2'>
            <PanelSettings panel={props}></PanelSettings>
        </div>
         
    }

    return (
        <SettingsWrapper settings={panelSettings()}>
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
                {/* <PanelSettings panel={props}></PanelSettings> */}
            </div>
        </SettingsWrapper> 
    );
} 

