'use client'

import { ChangeEvent, useState } from 'react';

interface VolumeProps {
    value: number,
    onValueChange: (val: number) => void;
    isMuted: boolean,
    onMutedChange: (val: boolean) => void;
}

export function Volume(props: VolumeProps) {
    const [isMuted, setIsMuted] = useState<boolean>(props.isMuted);

    const handleMuteClick = () => {
        const newVal = !isMuted;
        setIsMuted(newVal);

        props.onMutedChange(newVal);
    }

    const handleValueChange = (e: ChangeEvent) => {
        const range = e.target as HTMLInputElement;
        if (!range || !props.onValueChange) {
            return;
        }

        props.onValueChange(range.valueAsNumber);
    }

    const bgTexture = isMuted? 'bg-volume-off-texture' : 'bg-volume-on-texture';

    return <div className='contents flex-row h-full '>
        <button onClick={handleMuteClick} className={`h-full aspect-square bg-center bg-cover ${bgTexture}`}></button>
        <input type='range' min={0} max={1} step='any' defaultValue={props.value} onChange={handleValueChange}></input>
    </div>
}