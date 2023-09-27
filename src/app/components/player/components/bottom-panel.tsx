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

    const formatTime = (time: number) => {
        let hours = 0;
        let minutes = 0;
        let seconds = Math.floor(time);
        
        if (time > 60) {
            minutes = Math.floor(time / 60);
            seconds = Math.round(time % 60);
        }
        if (minutes > 60) {
            hours = Math.floor(minutes / 60);
            minutes = Math.round(minutes % 60);
        }


        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
            <div className='flex flex-row h-full items-center'>
                <button onClick={playButtonClick} className={`h-full w-16 bg-contain bg-center ${background}`}></button>
                <div className='text-white font-thin'>{`${formatTime(currentTime)} | ${formatTime(duration)}`}</div>
            </div>
        </div>);
}
