import { Panel, PanelType } from '@videolot/videolot-prisma';
import { prisma } from './db';

export async function getRootPanelByPath(path: string): Promise<Panel | null> {
    const panel = await prisma.panel.findFirst({
        where: {
            type: PanelType.Root,
            path
        }
    });

    return panel;
}