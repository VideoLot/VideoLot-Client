'use client'

import { ChangeEvent, useState } from 'react';

interface VolumeProps {
    value: number,
    onValueChange: (val: number)=>void;
}

export function Volume(props: VolumeProps) {
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const handleMuteClick = () => {
        setIsMuted(!isMuted);
    }

    const handleValueChange = (e: ChangeEvent) => {
        const range = e.target as HTMLInputElement;
        if (!range || !props.onValueChange) {
            return;
        }

        props.onValueChange(range.valueAsNumber);
    }

    const bgTexture = isMuted? 'bg-volume-off-texture' : 'bg-volume-on-texture';

    return <div className='flex flex-row h-full contents'>
        <button onClick={handleMuteClick} className={`h-full aspect-square bg-center bg-cover ${bgTexture}`}></button>
        <input type='range' min={0} max={1} step='any' defaultValue={props.value} onChange={handleValueChange}></input>
    </div>
}