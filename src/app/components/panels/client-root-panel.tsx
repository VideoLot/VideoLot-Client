'use client'

import { Panel } from '@videolot/videolot-prisma'
import { ReactNode, useState } from 'react'
import PanelOverlay from './panel-overlay';
import ViButton from '../vi-button';
import ClientPanel from './client-panel';
import { THIS_PANEL } from '@/app/constants';
import { post } from '@/utils/fetch';

interface ClientRootPanelProps {
    children: ReactNode
}

export function ClientRootPanel({children}: ClientRootPanelProps) {
    const [panels, setPanels] = useState<Panel[]>([]);

    const handleAddPanel =  async () => {
        const response = await post(THIS_PANEL('create')).withJsonBody({
            type: 'Horizontal',
            title: null,
            content: {
                type: 1,
                filter: []
            }
        } as unknown as Panel).send();
        if (response.ok) {
            const panel = await response.json();
            setPanels([...panels, panel]);
        }
    }

    const handlePanelChange = (newPanel: Panel) => {
        const updatedPanels = [...panels];
        const replacePanelIndex = updatedPanels.findIndex(x=> x.id === newPanel.id);
        updatedPanels[replacePanelIndex] = newPanel;
        setPanels(updatedPanels);
    }

    return <>
        { children }
        {
            panels.map(x => 
                <PanelOverlay key={`tmp_${x.id}`} Panel={ClientPanel} panel={x} pageSize={10} page={0} totalPages={0}/>
            )
        }
        <div className='place-self-center md:max-w-lg max-w-full'>
            <ViButton onClick={handleAddPanel}>
                <div className='p-3'>
                    Add Content Panel
                </div>
            </ViButton>
        </div>
    </>
}