'use client'

import { useState } from 'react';
import { PlaybackButtons } from './playback-buttons';
import { BottomPanel } from './bottom-panel';

export default function ControlsLayout() {
    const [isVisible, setIsVisible] = useState(true);

    function mouseOverLayout() {
        setIsVisible(true);
    }

    function mouseLeaveLayout() {
        setIsVisible(false);
    }
     
    return (
        <div onMouseEnter={mouseOverLayout}
            onMouseLeave={mouseLeaveLayout} 
            className='flex absolute top-0 left-0 w-full h-full'>
                {/* { isVisible?  */}
                    <>
                        <div className='flex absolute top-0 left-0 w-full h-full justify-center items-center pointer-events-none'>
                            <PlaybackButtons/>
                        </div>
                        <div className='place-self-end w-full'>
                            <BottomPanel></BottomPanel>
                        </div>
                    </>
                {/* // :  */}
                {/* //     null}     */}                
        </div>);
}

