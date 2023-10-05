import { prisma } from '@/utils/db'
import { Panel } from '@videolot/videolot-prisma'
import { PanelContentData } from '../../types';
import ServerPanel from './server-panel';

interface RootPanelProps {
    panel: Panel
}

export default async function ServerRootPanel( {panel}: RootPanelProps) {
    const data = panel.content as unknown as PanelContentData;

    if (!panel || !data) {
        return <h1> ERROR </h1>
    }
    
    const panelIds = data.filter as string[];
    const panels = await prisma.panel.findMany({
        where: {id: {in: panelIds}}
    });

    return <>
    {
        panels.map(x=> (
            <ServerPanel id={x.id}
                type={x.type}
                path={x.path} 
                content={x.content} 
                title={x.title} 
                version={x.version} 
                createdAt={x.createdAt} 
                updatedAt={x.updatedAt}/>))
    }
    </>
}