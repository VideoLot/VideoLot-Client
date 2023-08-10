'use client'

import TextEditor from '@/app/components/editors/text-editor';
import { TiersEditor } from '@/app/components/editors/tiers-editor';
import { PlayerData, ViewProps } from '@/app/types';
import { useEffect, useState } from 'react';

export default function Editor(props: {params: ViewProps}) {
    const [videoData, setVideoData] = useState<PlayerData>();

    useEffect(() => {
        const getVideoData = async () => {
            const url = new URL(`/api/video/${props.params.view}`, process.env.NEXT_PUBLIC_API_URL);
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json()
                    setVideoData(data);
                }
            } catch (e) {
                console.log(e);
            }
            
        }
        getVideoData();
    }, []);

    const onTitleChange = (value: string) => { console.log('TITLE CHANGED: ',value)};

    return (
        <div>
            <label>Title:</label>
            <TextEditor text={videoData? videoData.title: ''} apply={onTitleChange}/>
            <label>This video will be available for tiers:</label>
            <TiersEditor activeTiersInit={videoData?.avaliableForTiers.map(x=>x.id) || []} 
                videoId={props.params.view}></TiersEditor>
        </div>
    )
}