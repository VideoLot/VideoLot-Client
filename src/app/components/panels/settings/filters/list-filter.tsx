'use-client'

import { VideoData } from '@videolot/videolot-prisma';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import Preview from '@/app/components/preview';
import { VIDEOS_LIST } from '@/app/constants';
import { get } from '@/utils/fetch';

interface ListFilterProps {
    filter: string[]
    onChange: (filter: string[])=>void
}

export default function ListFilter(props: ListFilterProps) {
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

    const handleSelectionChanged = (id: string) => {
        let updated;
        if (props.filter.includes(id)) {
            updated = props.filter.filter(x=> x !== id);
        } else {
            updated = [...props.filter];
            updated.push(id);
        }
        props.onChange(updated);
    }

    return (
        <div className='space-y-2 w-85vw'>
            <input type='search' value={request} onChange={handleSearchRequestChange}></input>
            <div className='flex flex-row flex-wrap gap-2 space-y-2 max-w-full max-h-25vh overflow-y-scroll'>
                {
                    videos.map(x => <>
                        <AddWrapper key={`s_${x.id}`} isPicked={props.filter.includes(x.id)} onClick={() => handleSelectionChanged(x.id)}>
                            <Preview  previewData={x}/>
                        </AddWrapper>
                    </>)
                }
            </div>
        </div>
    );
}

function AddWrapper({children, isPicked, onClick} : {children: ReactNode, isPicked: boolean, onClick: ()=>void}) {
    const bgTexture = isPicked? 'bg-closure-texture' : 'bg-plus-button-texture'

    return <div className='relative'>
        <button onClick={onClick} className={`absolute -right-3 -top-3 w-12 h-12 ${bgTexture} bg-cover bg-center z-50`}/>
        
        {children}
    </div>
}