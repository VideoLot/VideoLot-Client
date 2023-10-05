import { GetPageOfVideo } from '@/utils/videos';
import { Panel } from '@videolot/videolot-prisma';
import ClientPanel from './client-panel';
import { PanelContentData } from '@/app/types';
import PanelOverlay from './panel-overlay';

export default async function ServerPanel(props: Panel) {
    const pageSize = 10;
    const currentPage = 0;

    const content = props.content as unknown as PanelContentData;
    const page = await GetPageOfVideo(pageSize, currentPage, content);
    const totalPages = Math.ceil(page.totalVideos / pageSize);

    return (
        <PanelOverlay Panel={ClientPanel} panel={props} pageSize={pageSize} page={currentPage} totalPages={totalPages} pageContent={page.videos}/>
    );
} 

