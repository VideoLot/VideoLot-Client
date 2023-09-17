import { GetPageOfVideo } from "@/utils/videos";
import { Panel } from "@videolot/videolot-prisma";
import ClientPanel from './client-panel';
import { PanelContentData } from '@/app/types';

export default async function ServerPanel(props: Panel) {
    const pageSize = 7;
    const currentPage = 0;

    const content = props.content as unknown as PanelContentData;
    const page = await GetPageOfVideo(pageSize, currentPage, content);
    const totalPages = Math.ceil(page.totalVideos / pageSize);

    return (
        <ClientPanel currentPage={currentPage} panel={props} totalPages={totalPages} pageSize={pageSize} pageContent={page.videos}></ClientPanel>
    );
} 

