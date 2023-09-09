'use client'

import { PanelContentData, PanelFilterType, PanelRequestVariant } from "@/app/types";
import { ChangeEvent, useState } from "react";
import { CategoryFilter } from './category-filter';
import { Panel } from '@videolot/videolot-prisma';
import ViButton, { ViButtonColor } from '../vi-button';
import { put } from '@/utils/fetch';
import { THIS_PANEL } from '@/app/constants';

interface PanelSettingsProps {
    panel: Panel
}

export default function PanelSettings(props: PanelSettingsProps) {
    const content = props.panel.content as unknown as PanelContentData;

    const [title, setTitle] = useState(props.panel.title);
    const [filterType, setFilterType] = useState<PanelFilterType>(content.type);
    const [filter, setFilter] = useState(content.filter);

    const handleFilterSelected = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterType(parseInt(e.target.value) as PanelFilterType);
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
            setTitle(newData.title);
            setFilterType(content.type);
            setFilter(content.filter);
        }
    }


    return (
        <div className='space-y-2'>
            <div className='space-x-2'>
                <label>
                    <input type='radio' name='filterType'  value={PanelFilterType.Categories} onChange={handleFilterSelected}></input>
                    Category filter
                </label>
                <label>
                    <input type='radio' name='filterType' value={PanelFilterType.List} onChange={handleFilterSelected}></input>
                    Predefined list
                </label>
            </div>
            <FilterSelector type={filterType} init={filter} onChange={handleFilterChanged}/>
            <ViButton onClick={handleSaveClick} color={ViButtonColor.Blue}>
                <h1 className='p-2'>Save</h1>              
            </ViButton>
        </div>
    );
}

export function FilterSelector({type, init, onChange}: {type: PanelFilterType | undefined, init: PanelRequestVariant[] | string[], onChange: (filter: PanelRequestVariant[] | string [])=>void}) {
    switch (type) {
        case PanelFilterType.Categories:
            const handleCategoryChanged = (filter: PanelRequestVariant[])=> {onChange(filter)}
            return <CategoryFilter filter={init as PanelRequestVariant[]} onChange={handleCategoryChanged}/>;
        case PanelFilterType.List:
            return <List/>;
        default:
            return <h1>Select a way how content will appear in this panel</h1>
    }
}

export function List() {
    return <h1>LIST FILTER</h1>
}