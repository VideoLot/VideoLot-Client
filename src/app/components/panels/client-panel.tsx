'use client'

import { Panel, VideoData } from '@videolot/videolot-prisma';
import SettingsWrapper from '../settings-wrapper';
import { useEffect, useState } from 'react';
import PanelSettings from './panel-settings';
import Preview from '../preview';
import ArrowButton, { ArrowDirection } from '../arrow-button';

export interface ClientPanelProps {
    pageSize: number
    currentPage: number
    totalPages: number
    panel: Panel
    pageContent?: VideoData[]
}

export default function ClientPanel(props: ClientPanelProps) {
    const [videos, setVideos] = useState<VideoData[]>(props.pageContent || []);

    useEffect(() => {

    });

    const panelSettings = () => {
        return <div className='p-2 pt-0'>
            <PanelSettings panel={props.panel}></PanelSettings>
        </div>
         
    }

    const panelHeader = () => {
        return <div className='flex px-2 items-center'>
            <h1>Panel settings</h1>
        </div>
    }


    return (
        <SettingsWrapper popupTitle={panelHeader()} settings={panelSettings()}>
            <div>
                <div>
                    <h2>{props.panel.title}</h2>
                </div>
                <div className='relative flex flex-row items-center'>
                    <div className='absolute -left-10 h-1/3 aspect-square z-50'>
                        <ArrowButton direction={ArrowDirection.Left}></ArrowButton>
                    </div>
                    <div className='flex flex-nowrap space-x-1 md:space-x-2 overflow-x-auto'>
                        { 
                            videos.map((x)=> (
                            <Preview key={x.id} previewData={x}/>
                            ))
                        }
                    </div>
                    <div className='absolute -right-10 h-1/3 aspect-square z-50'>
                        <ArrowButton direction={ArrowDirection.Right}></ArrowButton>
                    </div>
                </div>
                
            </div>
        </SettingsWrapper> 
    )
}