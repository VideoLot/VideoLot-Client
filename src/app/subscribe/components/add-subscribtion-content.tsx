'use client'

import { SubscribtionTier } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function AddSubscription() {
    const [editMode, setEditMode] = useState(false);

    const onAddClick = ()=> {
        setEditMode(true);
    }

    return (
        editMode? <EditMode></EditMode> : 
            <AddMode onClick={onAddClick}></AddMode>
    );
}

function AddMode({onClick}: {onClick: ()=>void}) {
    return (
        <button onClick={onClick} className='w-full h-full bg-plus-button-texture bg-contain bg-no-repeat bg-center'>  
        </button>
    );
}

function EditMode() {
    const url = new URL('/api/tier', process.env.NEXT_PUBLIC_API_URL);
    const router = useRouter();
    const [tierName, setTierName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(1);
    const [cost, setCost] = useState(0);

    const onAddClick = async () => {
        try {
            const response = await fetch(url, {
                cache: 'no-store',
                method: 'POST',
                body: JSON.stringify({
                    isActive: true,
                    name: tierName,
                    description: description,
                    durationDays: duration,
                    cost: cost
                })
            });
            if (response.ok) {
                router.refresh();
            }
        } catch (e) {

        }
    };

    return (<div className='flex flex-col h-full p-2 items-center justify-between'>
        <input onChange={(e) => setTierName(e.target.value)} 
            type='text' 
            placeholder='Enter tier name' 
            value={tierName}/>
        <textarea onChange={(e) => setDescription(e.target.value)} 
            className='w-full' 
            placeholder='Describe the benefits what user will get after subscription' 
            value={description}/>
        <div className='w-full justify-between'>
            <label>Duration in days:</label>
            <input onChange={(e) => setDuration(Number(e.target.value))}  type='number' value={duration}/>
        </div>
        <div  className='w-full justify-between'>
            <label>Cost:</label>
            <input onChange={(e) => setCost(Number(e.target.value))} type='number' value={cost}></input>
        </div>
        <button onClick={onAddClick} className='w-4/5 bg-blue-400 rounded-lg'>ADD</button>
    </div>);
}