'use client'

import { ReactNode, useState } from 'react';
import ViPopup from './popup';
import ClientGuard from './client-guard';
import { UserRole } from '@videolot/videolot-prisma';

interface SettingsWrapperProps {
    children: ReactNode
    settings: ReactNode
    popupTitle?: ReactNode
}

export default function SettingsWrapper(props: SettingsWrapperProps) {
    const [settingsOpened, setSettingsOpened] = useState(false);

    const editButton = () => {
        return (
            <button className='absolute top-1 right-8 w-8 h-8 bg-settings-texture bg-contain bg-center z-50' 
                onClickCapture={()=>{setSettingsOpened(true)}}>
            </button>);
    }

    return (
        <div className='relative'>
            <ClientGuard minimalRole={UserRole.Admin} allowed={editButton()} restricted={<></>}/>
            
            {props.children}
            <ViPopup title={props.popupTitle} isOpen={settingsOpened} onClose={()=>{setSettingsOpened(false)}}>
                {props.settings}
            </ViPopup>
        </div>
    );
}