'use-client'

import { VideoData } from '@videolot/videolot-prisma';
import { ChangeEvent, useEffect, useState } from 'react';
import Preview from '../preview';
import { VIDEOS_LIST } from '@/app/constants';
import { get } from '@/utils/fetch';

export default function ListFilter() {
    const [request, setRequest] = useState('');
    const [videos, setVideos] = useState<VideoData[]>([]);

    useEffect(() => {
        const getVideos = async () => {
            const response = await get(VIDEOS_LIST).withParam('search', request).send();
            if (response.ok) {
                const newVideos = await response.json() as VideoData[];
                setVideos(newVideos);
            }
        };
        getVideos()
    }, [request]);

    const handleSearchRequestChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRequest(e.target.value);
    }

    return (
        <div className='space-y-2 w-85vw'>
            <input type='search' value={request} onChange={handleSearchRequestChange}></input>
            <div className='flex flex-row space-x-2'>
                {
                    videos.map(x => <Preview key={x.id} previewData={x}></Preview>)
                }
            </div>
        </div>
    );
}