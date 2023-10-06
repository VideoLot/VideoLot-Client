'use client'

import { Panel } from '@videolot/videolot-prisma'
import { ReactNode, useEffect, useState } from 'react'
import PanelOverlay from './panel-overlay';
import ViButton from '../vi-button';
import ClientPanel from './client-panel';
import { THIS_PANEL } from '@/app/constants';
import { del, post, put } from '@/utils/fetch';
import { RootContextData, RootPanelContext } from './root-context';
import ClientGuard from '../client-guard';
import { PanelContentData, PanelFilterType } from '@/app/types';
import { useRouter } from 'next/navigation';

interface ClientRootPanelProps {
    children: ReactNode
    panel: Panel
}

export function ClientRootPanel({children, panel}: ClientRootPanelProps) {
    const [panelsDeleteOnSave, setPanelsDeleteOnSave] = useState<string[]>([]);
    const [panelsCreateOnSave, setPanelsCreateOnSave] = useState<Panel[]>([]);

    const [panelForDelete, setPanelForDelete] = useState<string | null>(null);
    const [panelForRestore, setPanelForRestore] = useState<string | null>(null);

    const [creatingPanel, setCreatingPanel] = useState(false);
    const [saving, setSaving] = useState(false);
    const [haveChanges, setHaveChanges] = useState(false);
    
    const [rootContext, setRootContext] = useState({
        deletePanel: setPanelForDelete,
        restorePanel: setPanelForRestore
    } as RootContextData);
    const router = useRouter();


    useEffect(() => {
        const changesStatus = panelsCreateOnSave.length > 0 || panelsDeleteOnSave.length > 0;
        if (haveChanges !== changesStatus) {
            setHaveChanges(changesStatus);
        }
    }, [panelsCreateOnSave, panelsDeleteOnSave]);

    useEffect(() => {
        if (!panelForDelete) {
            return;
        }

        if (panelsCreateOnSave.some(x=> x.id === panelForDelete)) {
            deletePanel(panelForDelete);
        } else {

            if (!panelsDeleteOnSave.includes(panelForDelete)) {
                setPanelsDeleteOnSave([...panelsDeleteOnSave, panelForDelete]);
            }
        }

    }, [panelForDelete]);

    useEffect(() => {
        if (!panelForRestore) {
            return;
        }

        const index = panelsDeleteOnSave.indexOf(panelForRestore);
        if (index >= 0) {
            const updated = panelsDeleteOnSave.slice(index, index);
            setPanelsDeleteOnSave(updated);
        }
    },[panelForRestore]);

    useEffect(() => {
        if (!creatingPanel) {
            return;
        }

        createPanel();
    }, [creatingPanel]);

    useEffect(() => {
        if (!saving) {
            return;
        }

        saveChanges();
    }, [saving]);

    async function createPanel() {
        const response = await requestCreatePanel();
        if (response.ok) {
            const panel = await response.json();
            setCreatingPanel(false);
            setPanelsCreateOnSave([...panelsCreateOnSave, panel]);
        }
    }

    async function deletePanel(id: string) {
        const response = await requestDeletePanel(id);
        if (response.ok) {
            const panelIndex = panelsCreateOnSave.findIndex(x=> x.id === id);
            const updated = panelsCreateOnSave.slice(panelIndex, panelIndex);
            setPanelsCreateOnSave(updated);
        }
    }

    async function requestCreatePanel(): Promise<Response> {
        const response = await post(THIS_PANEL('create')).withJsonBody({
            type: 'Horizontal',
            title: 'New Panel',
            content: {
                type: 1,
                filter: []
            }
        } as unknown as Panel).send();
        return response;
    }

    async function requestDeletePanel(id: string): Promise<Response> {
        return await del(THIS_PANEL(id)).send();
    }

    async function requestUpdatePanel(updatedPanel: Panel): Promise<Response> {
        const response = await put(THIS_PANEL(updatedPanel.id))
            .withJsonBody(updatedPanel)
            .send();
        return response;
    }

    async function saveChanges() {
        const data = panel.content as unknown as PanelContentData;
        const filter = data.filter as string[];
        if(!filter) {
            return;
        }

        const updatedFilter = filter.filter(x => !panelsDeleteOnSave.includes(x));
        updatedFilter.push(...panelsCreateOnSave.map(x => x.id));

        const updatedPanel = {...panel} as any;
        updatedPanel.content = {
            type: PanelFilterType.List,
            filter: updatedFilter
        } as PanelContentData;

        const promises: Promise<Response>[] = [];
        promises.push(requestUpdatePanel(updatedPanel));
        promises.push(...panelsDeleteOnSave.map(x => requestDeletePanel(x)));
        Promise.all(promises).then(()=>{
            setSaving(false);
            setPanelsCreateOnSave([]);
            setPanelsDeleteOnSave([]);
            router.refresh();
        });
    }

    return <>
        <RootPanelContext.Provider value={rootContext}>
            { children }
            {
                panelsCreateOnSave.map(x => 
                    <PanelOverlay key={`tmp_${x.id}`} Panel={ClientPanel} panel={x} pageSize={10} page={0} totalPages={0}/>
                )
            }
        </RootPanelContext.Provider>
        <ClientGuard minimalRole='Admin' restricted={null}>
            <div className=' flex flex-col space-y-1 place-self-center md:max-w-lg max-w-full'>
                <ViButton onClick={() => setCreatingPanel(true)}>
                    <div className='p-3'>
                        Add Content Panel
                    </div>
                </ViButton>
                {
                    haveChanges ?
                    <ViButton onClick={() => setSaving(true)}>
                        <div className='p-3'>
                            Save Layout Changes
                        </div>
                    </ViButton>
                    :
                    null
                }
            </div>
        </ClientGuard>
        
    </>
}