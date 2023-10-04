'use client'

import { ComponentType, ReactNode, useState } from 'react';
import ViPopup from '../popup';
import Overlay from '../overlay';
import PanelSettings from './settings/panel-settings';
import { Panel, UserRole } from '@videolot/videolot-prisma';
import ClientGuard from '../client-guard';
import { ClientPanelProps } from './client-panel';

interface PanelOverlayProps extends ClientPanelProps {
    Panel: ComponentType<ClientPanelProps>
    onPanelChange?: (value: Panel) => void
}

export default function PanelOverlay({panel, Panel, pageSize, page, pageContent, totalPages, onPanelChange}: PanelOverlayProps) {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const [panelData, setPanelData] = useState(panel);

    const panelForehead = () => {
        function ControlPanel() {
            return (
                <div className='flex flex-row h-8 space-x-1'>
                    <button className='aspect-square bg-settings-texture bg-contain bg-center' 
                        onClickCapture={()=>{setSettingsOpened(true)}}/>
                    <button className='aspect-square bg-closure-texture bg-contain bg-center'
                        onClickCapture={handleDeletePanel}/>
                </div>
                );
        }

        return (<ClientGuard minimalRole={UserRole.Admin} allowed={ControlPanel()} restricted={null}></ClientGuard>)
    }

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

    const handleDeletePanel = async () => {

    }

    return <>
        <Overlay h='end' v='start' foreground={panelForehead()}>
            <Panel pageSize={pageSize} page={page} pageContent={pageContent} totalPages={totalPages} panel={panelData}></Panel>
        </Overlay>
        <ViPopup title={panelHeader()} isOpen={settingsOpened} onClose={()=>{setSettingsOpened(false)}}>
            <div className='p-2 pt-0 md:w-85vw'>
                <PanelSettings onPanelChange={handlePanelSettingsChange} panel={panelData}></PanelSettings>
            </div>
        </ViPopup>
    </>
}