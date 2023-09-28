'use client'

import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { PlaybackButtons } from './playback-buttons';
import { BottomPanel } from './bottom-panel';
import { PlayerContext } from '../player-context';

export default function ControlsLayout() {
    const [isVisible, setIsVisible] = useState(true);
    const { isFullScreen } = useContext(PlayerContext);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isFullScreen) {
            document.addEventListener('mousemove', resetTimerHandler, true);
            document.addEventListener('mousedown', resetTimerHandler, true);
            document.addEventListener('keypress', resetTimerHandler, true);
            resetTimerHandler();
        } else {
            document.removeEventListener('mousemove', resetTimerHandler, true);
            document.removeEventListener('mousedown', resetTimerHandler, true);
            document.removeEventListener('keypress', resetTimerHandler, true);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    }, [isFullScreen]);

    const resetTimerHandler = useCallback(() => {
        setIsVisible(true);
        
        let timer = timerRef.current;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timerRef.current = null;
            setIsVisible(false);
        }, 2000);
        timerRef.current = timer;
    }, []);

    function mouseOverLayout() {
        if (!isFullScreen) {
            setIsVisible(true);
        }
    }

    function mouseLeaveLayout() {
        if (!isFullScreen) {
            setIsVisible(false);
        }
    }
     
    return (
        <div onMouseEnter={mouseOverLayout}
            onMouseLeave={mouseLeaveLayout} 
            className='flex absolute top-0 left-0 w-full h-full'>
                { isVisible? 
                    <>
                        <div className='flex absolute top-0 left-0 w-full h-full justify-center items-center pointer-events-none'>
                            <PlaybackButtons/>
                        </div>
                        <div className='place-self-end w-full'>
                            <BottomPanel></BottomPanel>
                        </div>
                    </>
                : 
                null}                
        </div>);
}

