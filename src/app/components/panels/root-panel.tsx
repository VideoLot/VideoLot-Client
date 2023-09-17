import { prisma } from '@/utils/db'
import { PanelType } from '@videolot/videolot-prisma'
import { PanelContentData } from '../../types';
import ServerPanel from './server-panel';

interface RootPanelProps {
    path: string
}

export default async function RootPanel( props: RootPanelProps) {
    const rootConfig = await prisma.panel.findFirst({
        where: {
            type: PanelType.Root,
            path: props.path
        }
    });
    const data = rootConfig?.content as unknown as PanelContentData;

    if (!rootConfig || !data) {
        return <h1> ERROR </h1>
    }
    
    const panelIds = data.filter as string[];
    const panels = await prisma.panel.findMany({
        where: {id: {in: panelIds}}
    });
    return <>
        {
            panels.map(x=> (<ServerPanel id={x.id}
                type={x.type}
                path={x.path} 
                content={x.content} 
                title={x.title} 
                version={x.version} 
                createdAt={x.createdAt} 
                updatedAt={x.updatedAt}></ServerPanel>))
        }
    </>
}