import { prisma } from '@/utils/db'
import { Panel, Prisma } from '@videolot/videolot-prisma'
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
    // const panels = await prisma.panel.findMany({
    //     where: {id: {in: panelIds}}
    // });
    // .map(x=>`'${x}'`)
    
    // const queryIds = panelIds.map(x=> `'${x}'`).join(', ')//
    const queryIds = Prisma.join(panelIds);
    const idsOrder = `{${panelIds.map(x=>`${x}`).join(', ')}}`
    const panels = await prisma.$queryRaw(Prisma.sql`
        SELECT * FROM public."Panel" 
        JOIN unnest(${idsOrder}::text[]) WITH ORDINALITY t(id, ord) using (id)
        WHERE id IN (${queryIds})
        ORDER BY t.ord
        ;`) as Panel[];

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