'use client';

import { useRef, useContext, useState } from "react";
import { PlayerContext, PlayerState } from "../player-context";

export function BottomPanel() {
    const timelineRef = useRef<HTMLInputElement>(null);
    const { state, duration, currentTime, setState, setCurrentTime } = useContext(PlayerContext);
    const [timelineChanging, setTimelineChanging] = useState(false);
    
    let background;
    switch (state) {
        case PlayerState.Playing:
            background = 'bg-simple-pause-button-texture';
            break;
        case PlayerState.Paused:
            background = 'bg-simple-play-button-texture';
            break;
        case PlayerState.Loading:
            background = 'bg-loader-texture';
            break;
        case PlayerState.Finished:
            background = 'bg-loader-texture';
            break;
    }

    function playButtonClick() {
        if (!setState) {
            return;
        }

        if (state === PlayerState.Paused) {
            setState(PlayerState.Playing);
        }
        if (state === PlayerState.Playing) {
            setState(PlayerState.Paused);
        }
    }

    function timelineValueChanged() {
        const timeline = timelineRef.current;
        if (!setCurrentTime || !timeline) {
            return;
        }

        const newTime = duration * Number(timeline.value);
        console.log('Time Changed: ', newTime);
    }

    function timeChangedApproved() {
        const timeline = timelineRef.current;
        if (!setCurrentTime || !timeline) {
            console.log('Time Change Declined');
            return;
        }

        const newTime = duration * Number(timeline.value);
        console.log('Time Change Approved: ', newTime);
        setTimelineChanging(false)
        setCurrentTime(newTime);   
    }

    const timeline = timelineRef.current;
    if (timeline) {
        if (!timelineChanging) {
            timeline.value = (currentTime / duration).toString();
        }
    }

    return (
        <div className='flex flex-col w-full h-20 bg-gradient-to-b from-transparent to-black'>
            <div className='px-3'>
                <input ref={timelineRef} 
                    onChange={timelineValueChanged}
                    onMouseDown={() => setTimelineChanging(true)}
                    onMouseUp={timeChangedApproved}
                    className='w-full'
                    type='range'
                    min='0' 
                    max='1'
                    step='any' 
                    defaultValue={0}/>
            </div>
            <div className='h-full'>
                <button onClick={playButtonClick} className={`h-full w-16 bg-contain bg-center ${background}`}></button>
            </div>
        </div>);
}
