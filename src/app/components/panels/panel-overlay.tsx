'use client'

import { ComponentType, ReactNode, useContext, useState } from 'react';
import ViPopup from '../popup';
import Overlay from '../overlay';
import PanelSettings from './settings/panel-settings';
import { Panel, UserRole } from '@videolot/videolot-prisma';
import ClientGuard from '../client-guard';
import { ClientPanelProps } from './client-panel';
import { RootPanelContext } from './root-context';

interface PanelOverlayProps extends ClientPanelProps {
    Panel: ComponentType<ClientPanelProps>
    onPanelChange?: (value: Panel) => void
}

export default function PanelOverlay({panel, Panel, pageSize, page, pageContent, totalPages, onPanelChange}: PanelOverlayProps) {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const [panelData, setPanelData] = useState(panel);
    const [marked, setMarked] = useState(false);

    const panelHeader = () => {
        return <div className='flex px-2 items-center'>
            <h1>Panel settings</h1>
        </div>
    }

    const handlePanelSettingsChange = (value: Panel) => {
        setPanelData(value);
        if (onPanelChange) {
            onPanelChange(value);
        }
    }

    return <>
        <Overlay h='end' v='start' 
            foreground={
                <ClientGuard minimalRole={UserRole.Admin} restricted={null}>
                    <ControlPanel panelId={panelData.id} marked={marked} onMarkChange={setMarked} setSettingsOpened={setSettingsOpened}/>
                </ClientGuard>
                }>
                <Panel pageSize={pageSize} page={page} pageContent={pageContent} totalPages={totalPages} panel={panelData}></Panel>
        </Overlay>
        <ViPopup title={panelHeader()} isOpen={settingsOpened} onClose={()=>{setSettingsOpened(false)}}>
            <div className='p-2 pt-0 md:w-85vw'>
                <PanelSettings onPanelChange={handlePanelSettingsChange} panel={panelData}></PanelSettings>
            </div>
        </ViPopup>
    </>
}

function ControlPanel({panelId, marked, onMarkChange, setSettingsOpened}: {panelId: string, marked: boolean, onMarkChange: (val: boolean)=>void, setSettingsOpened:(val: boolean)=>void}) {
    const {deletePanel, restorePanel} = useContext(RootPanelContext);

    const handleMark = () => {
        if (marked) {
            if (restorePanel) {
                restorePanel(panelId);
            }
        } else {
            if (deletePanel) {
                deletePanel(panelId);
            }
        }
        onMarkChange(!marked);
    }

    const markStyle = marked ? 'bg-restore-texture' : 'bg-closure-texture';

    return (
        <div className='flex flex-row h-8 space-x-1'>
            <button className='aspect-square bg-settings-texture bg-contain bg-center' 
                onClickCapture={()=>{setSettingsOpened(true)}}/>
            <button className={`aspect-square ${markStyle} bg-contain bg-center`}
                onClickCapture={handleMark}/>
        </div>
        );
}