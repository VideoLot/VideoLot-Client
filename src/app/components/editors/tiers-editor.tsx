'use client'

import { SubscribtionTier } from "@prisma/client";
import { useEffect, useState } from "react";

export function TiersEditor({activeTiersInit, videoId} : {activeTiersInit: string[], videoId: string}) {
    const url = new URL(`/api/tier/list`, process.env.NEXT_PUBLIC_API_URL);
    const [tiers, setTiers] = useState<[SubscribtionTier]>();
    const [activeTiers, setActiveTiers] = useState(activeTiersInit);
    useEffect(() => {
        const getTiers = async () => {
            const response = await fetch(url);
            if (response.ok) {
                const tiersData = await response.json() as [SubscribtionTier];
                setTiers(tiersData);
            }
        }
        getTiers();
    }, []);

    const handleCheck = (id: string, isChecked: boolean) => {
        const hasTier = activeTiers.indexOf(id);
        if (!isChecked) {
            if (hasTier > -1) {
                activeTiers.splice(hasTier, 1);
                setActiveTiers([...activeTiers]);
            }
        } else {
            if (hasTier < 0) {
                setActiveTiers([...activeTiers, id]);
            }
        }
    };

    const handleApply = async () => {
        const url = new URL(`/api/video/${videoId}`, process.env.NEXT_PUBLIC_API_URL);

        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                avaliableForTiers: activeTiers
            })
        });
        if (response.ok) {
            console.log('Applied');
        }
    }

    return (
    <div>
        { tiers?.map(t => 
        <Tier key={t.id} 
            tier={t} 
            isEnabled={!!activeTiers.find(x => x === t.id)} 
            onCheckChanged={handleCheck}></Tier>)}
        <button onClick={handleApply}>Apply</button>
    </div>
    );
}

function Tier({tier, isEnabled, onCheckChanged}: 
    {tier: SubscribtionTier, isEnabled: boolean, onCheckChanged: (id: string, isChecked: boolean) => void}) {
    return(
        <div className='flex flex-row'>
            <div>{tier.name}</div>
            <input onChange={(e) => onCheckChanged(tier.id, e.target.checked)} 
                type='checkbox' 
                checked={isEnabled}></input>
        </div>
    );
}