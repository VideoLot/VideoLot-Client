'use client';

import { CategoryFilter, NameValue, PanelRequestVariant } from '@/app/types';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import ViButton, { ViButtonColor } from '../vi-button';

type CategoryChangeValue = {action: 'removed' | 'edited', index: number, value?: CategoryFilter};
interface CategoryFilterProps {
    filter: PanelRequestVariant[]
    onChange: (filter: PanelRequestVariant[])=>void;
}

export function CategoryFilter(props: CategoryFilterProps) {
    const options = [
        { name: 'One', value: 'one' },
        { name: 'Two', value: 'two' },
        { name: 'Three', value: 'three' }
    ];

    const handleAddClicked = () => {
        props.onChange([...props.filter, {categories: [], isStrict: false}]);
    }

    const handleVariantChange = (variant: PanelRequestVariant, i: number) => {
        const updated = [...props.filter];
        updated[i] = variant;
        props.onChange(updated);
    }

    return <>
        <h1>Category filter</h1>
        <div className='flex flex-col gap-2'>
            {
                props.filter.map((x, i) => <>
                    <Variant options={options} data={x} index={i} onChange={handleVariantChange}/>
                </>)
            }
            
            <div>
                <AddButton text='Add variant' onClick={handleAddClicked}></AddButton>
            </div>
        </div>
    </>;

}

function Variant({ data, options, index, onChange }: { data: PanelRequestVariant; options: NameValue[]; index: number, onChange: (v: PanelRequestVariant, i: number)=>void}) {
    const handleSelectorChange = (change: CategoryChangeValue) => {
        const updated = [...data.categories];
        switch(change.action) {
            case 'edited':
                if (!change.value) {
                    return;
                }

                updated[change.index] = change.value
                break;
            case 'removed':
                updated.splice(change.index, 1);
                break;
        }
        fireOnChange(updated, null);
    };

    const handleAddCategory = () => {
        fireOnChange([...data.categories, { id: options[0].value, not: false }], null);
    };

    const handleStrictChanged = (e: ChangeEvent<HTMLInputElement>) => {
        fireOnChange(null, e.target.checked);
    }

    function fireOnChange(categories: CategoryFilter[] | null, isStrict : boolean | null) {
        onChange({
            categories: categories || data.categories,
            isStrict: isStrict !== null ? isStrict : data.isStrict
        }, index);
    }

    return <div className='flex flex-row gap-x-2 items-center flex-wrap'>
        {data.categories.map((x, i) => 
        <>
            {i !== 0 ? <h1>and</h1> : null}
            <CategorySelector options={options} value={x} index={i} onChange={handleSelectorChange} />
        </>)}
        <label>
            <input type='checkbox' checked={data.isStrict} onChange={handleStrictChanged}></input>
            Is Strict
        </label>
        <AddButton text='Add category' onClick={handleAddCategory}></AddButton>
    </div>;
}

function CategorySelector({ options, value, index, onChange }: { options: NameValue[]; value: CategoryFilter; index: number; onChange: (value: CategoryChangeValue) => void; }) {

    const handleCategoryChangeValue = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange({
            action: 'edited',
            index: index,
            value: {
                id: e.target.value,
                not: value.not
            }
        });
    }

    const handleRemoveClicked = () => {
        onChange({
            action: 'removed',
            index: index
        });
    }

    const handleExcludeChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange({
            action: 'edited',
            index: index,
            value: {
                id: value.id,
                not: e.target.checked
            }
        });
    }

    const color = value.not ? 'bg-orange-100' : 'bg-blue-100';
    return (
        <div className={`flex flex-col ${color} p-2 rounded-md`}>
            <div className='flex flex-row'>
                <select className='bg-transparent' defaultValue={value.id} onChange={handleCategoryChangeValue}>
                    {options.map(x => <option value={x.value}>{x.name}</option>)}
                </select>
                <button className='bg-closure-texture bg-cover bg-center w-6 h-6' onClick={handleRemoveClicked}></button>
            </div>

            <label>
                <input type='checkbox' checked={value.not} onChange={handleExcludeChange}></input>
                Exclude
            </label>
        </div>

    );
}

function AddButton({text, onClick}: {text: string, onClick: ()=>void}) {
    return <ViButton color={ViButtonColor.SemiBlue} onClick={onClick}>
    <div className='flex items-center h-10 bg-blue-100 rounded-md p-1'>
        <Image width={30} height={30} src='/plus-texture.svg' alt='plus sign'></Image>
        {text}
    </div>
</ViButton>
}
