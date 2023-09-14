'use client';

import { CategoryFilter, NameValue, PanelRequestVariant } from '@/app/types';
import { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import ViButton, { ViButtonColor } from '../vi-button';
import { CATEGORIES } from '@/app/constants';
import { get } from '@/utils/fetch';
import { Category } from '@videolot/videolot-prisma';

type CategoryChangeValue = {action: 'removed' | 'edited', index: number, value?: CategoryFilter};
interface CategoryFilterProps {
    filter: PanelRequestVariant[]
    onChange: (filter: PanelRequestVariant[])=>void;
}

export function CategoryFilter(props: CategoryFilterProps) {
    const [options, setOptions] = useState<NameValue[]>([]);

    useEffect(() => {
        const getCategories = async() => {
            const response = await get(CATEGORIES).send();
            if (response.ok) {
                const cats = await response.json() as Category[]; // =^_^=
                const newOptions = cats.map(x => 
                    {
                        return {
                            name: x.name,
                            value: x.id
                        } as NameValue;
                    } 
                );
                setOptions(newOptions)
            }
        }
        getCategories();
    }, []);

    const handleAddClicked = () => {
        props.onChange([...props.filter, {categories: [], isStrict: false}]);
    }

    const handleVariantChange = (variant: PanelRequestVariant, i: number) => {
        const updated = [...props.filter];
        updated[i] = variant;
        props.onChange(updated);
    }

    const handleVariantDelete = (index: number) => {
        const updated = [...props.filter];
        updated.splice(index, 1);;
        props.onChange(updated);
    }

    return <>
        <div className='flex flex-col md:max-w-85vw md:w-85vw md gap-2'>
            {
                props.filter.map((x, i) => <div className='flex flex-row space-x-2'>
                    <Variant key={Math.random()} options={options} data={x} index={i} onChange={handleVariantChange}/>
                    <ViButton color={ViButtonColor.SemiRed} onClick={() => handleVariantDelete(i)}>
                        <div className='flex flex-row items-center h-10 p-1'>
                            <Image width={30} height={30} src='/closure-texture.svg' alt='delete sign'></Image>
                            Delete variant
                        </div>
                    </ViButton>
                </div>)
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
            <CategorySelector key={Math.random()} options={options} value={x} index={i} onChange={handleSelectorChange} />
        </>)}
        <AddButton text='Add category' onClick={handleAddCategory}></AddButton>
        <label>
            <input type='checkbox' checked={data.isStrict} onChange={handleStrictChanged}></input>
            Is Strict
        </label>
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
                    {options.map((x, i) => <option key={Math.random()} value={x.value}>{x.name}</option>)}
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
