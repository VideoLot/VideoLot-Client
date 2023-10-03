'use client'

import { ReactNode, useState } from 'react';
import ViPopup from '../popup';
import Overlay from '../overlay';
import PanelSettings from './settings/panel-settings';
import { Panel } from '@videolot/videolot-prisma';

interface PanelOverlayProps {
    children: ReactNode
    panel: Panel
}

export default function PanelOverlay(props: PanelOverlayProps) {
    const [settingsOpened, setSettingsOpened] = useState(false);

    const editButton = () => {
        return (
            <button className='w-8 h-8 bg-settings-texture bg-contain bg-center z-50' 
                onClickCapture={()=>{setSettingsOpened(true)}}>
            </button>);
    }

    const panelHeader = () => {
        return <div className='flex px-2 items-center'>
            <h1>Panel settings</h1>
        </div>
    }

    return <>
        <Overlay h='end' v='start' foreground={editButton()}>
            {props.children}
        </Overlay>
        <ViPopup title={panelHeader()} isOpen={settingsOpened} onClose={()=>{setSettingsOpened(false)}}>
            <div className='p-2 pt-0 md:w-85vw'>
                <PanelSettings panel={props.panel}></PanelSettings>
            </div>
        </ViPopup>
    </>
}