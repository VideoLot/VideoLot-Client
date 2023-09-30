'use client';

import { useRef, useContext, useState } from "react";
import { PlayerContext, PlayerState } from "../player-context";
import { Volume } from './volume';

export function BottomPanel() {
    const timelineRef = useRef<HTMLInputElement>(null);
    const { 
        state, 
        duration, 
        currentTime, 
        isFullScreen, 
        volume,
        muted,
        setState, 
        setCurrentTime, 
        setFullscreen, 
        setVolume,
        setMuted,
    } = useContext(PlayerContext);
    const [timelineChanging, setTimelineChanging] = useState(false);
    
    let playbackBg;
    switch (state) {
        case PlayerState.Playing:
            playbackBg = 'bg-simple-pause-button-texture';
            break;
        case PlayerState.Paused:
            playbackBg = 'bg-simple-play-button-texture';
            break;
        case PlayerState.Loading:
            playbackBg = 'bg-loader-texture';
            break;
        case PlayerState.Finished:
            playbackBg = 'bg-loader-texture';
            break;
    }

    const fullscreenBg = isFullScreen ? 'bg-collapse-texture': 'bg-expand-texture';

    function handlePlayButtonClick() {
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

    function handleFullscreenClick() {
        if(!setFullscreen) {
            return;
        }

        setFullscreen(!isFullScreen);
    }

    function handleVolumeChange(val: number) {
        if (setVolume) {
            setVolume(val);
        }
    }

    function handleMutedChange(val: boolean) {
        if (setMuted) {
            setMuted(val);
        }
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
            <div className='flex flex-row h-full'>
                <div className='flex flex-row w-full h-full items-center'>
                    <button onClick={handlePlayButtonClick} className={`h-full w-16 bg-contain bg-center ${playbackBg}`}></button>
                    <Volume onValueChange={handleVolumeChange} onMutedChange={handleMutedChange} value={volume} isMuted={muted}></Volume>
                    <div className='text-white font-thin contents'>{`${formatTime(currentTime)} | ${formatTime(duration)}`}</div>
                </div>
                <div className='flex flex-row w-full h-full justify-end items-center'>
                    <button onClick={handleFullscreenClick} className={`h-full w-16 bg-contain bg-center ${fullscreenBg}`}></button>
                </div>
            </div>
        </div>);
}
