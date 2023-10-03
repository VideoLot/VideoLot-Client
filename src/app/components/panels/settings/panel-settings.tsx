'use client'

import { PageOfVideos, PanelContentData, PanelFilterType, PanelRequestVariant } from "@/app/types";
import { ChangeEvent,  useEffect, useRef, useState } from "react";
import { CategoryFilter } from './filters/category-filter';
import { Panel, VideoData } from '@videolot/videolot-prisma';
import ViButton, { ViButtonColor } from '../../vi-button';
import { post, put } from '@/utils/fetch';
import { THIS_PANEL, VIDEOS_LIST } from '@/app/constants';
import Preview from '../../preview';
import ListFilter from './filters/list-filter';

interface PanelSettingsProps {
    panel: Panel
}

export default function PanelSettings(props: PanelSettingsProps) {
    const content = props.panel.content as unknown as PanelContentData;

    const [title, setTitle] = useState(props.panel.title || '');
    const [filterType, setFilterType] = useState<PanelFilterType>(content.type);
    const [filter, setFilter] = useState(content.filter);
    const [videos, setVideos] = useState<VideoData[]>([]);
    const filtersStorage = useRef(new Map([[content.type, content.filter]]));

    useEffect(()=> {
        const getVideos = async () => {
            const response = await post(VIDEOS_LIST).withJsonBody({
                type: filterType,
                filter: filter
            }).withParams(
                {name: 'pageSize', value: '10'},
                {name: 'page', value: '0'}
            )
            .send();
            if (response.ok) {
                const newVideos = await response.json() as unknown as PageOfVideos;
                setVideos(newVideos.videos);
            }  
        }
        getVideos();
    }, [filter]);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const handleFilterTypeSelected = (type: PanelFilterType) => {
        const storage = filtersStorage.current;
        storage.set(filterType, filter);

        setFilterType(type);
        if(storage.has(type)) {
            setFilter(storage.get(type) as string[] | PanelRequestVariant[]);
        } else {
            setFilter([]);
        }
    }

    const handleFilterChanged = (filter: PanelRequestVariant[] | string[]) => {
        setFilter(filter);
    }

    const handleSaveClick = async () => {
        const tmp = await put(THIS_PANEL(props.panel.id))
            .withJsonBody({
                title,
                content: {
                    type: filterType,
                    filter: filter
                }
            })
            .send();
        if (tmp.ok) {
            const newData = await tmp.json() as Panel;
            const content = newData.content as unknown as PanelContentData;
            setTitle(newData.title || '');
            setFilterType(content.type);
            setFilter(content.filter);
        }
    }

    return (
        <div className='space-y-2'>
            <input type='text' value={title} onChange={handleTitleChange}></input>
            <div className='space-x-2'>
                <label>
                    <input type='radio' name='filterType' checked={filterType === PanelFilterType.Categories} onChange={(e)=>handleFilterTypeSelected(PanelFilterType.Categories)}></input>
                    Category filter
                </label>
                <label>
                    <input type='radio' name='filterType' checked={filterType === PanelFilterType.List} onChange={(e)=>handleFilterTypeSelected(PanelFilterType.List)}></input>
                    Predefined list
                </label>
            </div>
            <FilterSelector type={filterType} init={filter} onChange={handleFilterChanged}/>
            <div className='flex flex-nowrap space-x-1 md:space-x-2 overflow-x-auto'>
                { 
                    videos.map((x)=> (
                        <Preview key={x.id} previewData={x}/>
                    ))
                }
            </div>
            <ViButton onClick={handleSaveClick} color={ViButtonColor.Blue}>
                <h1 className='p-2'>Save</h1>              
            </ViButton>
        </div>
    );
}

export function FilterSelector({type, init, onChange}: {type: PanelFilterType | undefined, init: PanelRequestVariant[] | string[], onChange: (filter: PanelRequestVariant[] | string [])=>void}) {
    switch (type) {
        case PanelFilterType.Categories:
            const handleCategoryChanged = (filter: PanelRequestVariant[]) => {onChange(filter)}
            return <CategoryFilter filter={init as PanelRequestVariant[]} onChange={handleCategoryChanged}/>;
        case PanelFilterType.List:
            const handleListChanged = (filter: string[]) => {onChange(filter)}
            return <ListFilter filter={init as string[]} onChange={handleListChanged}/>;
        default:
            return <h1>Select a way how content will appear in this panel</h1>
    }
}