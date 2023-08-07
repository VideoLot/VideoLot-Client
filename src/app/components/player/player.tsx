'use client'

import { useState, useRef, useEffect } from "react";
import { PlayerContextData, PlayerContext, PlayerState } from "./player-context";
import ControlsLayout from "./components/control-layout";
import { PlayerData } from "@/app/types";
import { BufferPull } from "./buffer-pull";

export default function Player(props: PlayerData) {
    const bufferPullRef = useRef<BufferPull>();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [playerContext, setPlayerContext] = useState({
        state: getCurrentState(),
        isFullScreen: false,
        duration: props.videoTrack.trackInfo.duration,
        currentTime: 0,
        setState: setPlayerState,
        setFullscreen: setFullscreen,
        setCurrentTime: setCurrentTime
    } as PlayerContextData);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        if (!bufferPullRef.current) {
            const mediaSource = new MediaSource();
            bufferPullRef.current = new BufferPull(mediaSource);

            mediaSource.addEventListener('sourceopen', videoSourceOpen);
            const mediaURL = URL.createObjectURL(mediaSource);
            video.src = mediaURL; 
        }
    });

    async function videoSourceOpen(event: Event) {
        const pull = bufferPullRef.current;
        if (pull) {
            pull.createSourceWithLoader(props.videoTrack.trackInfo);
            if (props.audioTracks.length > 0) {
                pull.createSourceWithLoader(props.audioTracks[0].trackInfo);
            }
            await pull.setPlaybackPosition(0);
        } 
    }

    function setPlayerState(newState: PlayerState) {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        if (newState === PlayerState.Playing) {
            video.play();
        }
        if (newState === PlayerState.Paused) {
            video.pause();
        }
    }

    function setFullscreen(isFullScreen: boolean) {

    }

    async function setCurrentTime(newTime: number) {
        const video = videoRef.current;
        const loader = bufferPullRef.current;
        if (!video || !loader) {
            return;
        }

        video.currentTime = newTime / 1000;
        await loader.setPlaybackPosition(newTime);
        const state = getCurrentState();
        updateContext({state, currentTime: newTime});
    }

    function updateContext(context: any) {
        const newContext = {} as PlayerContextData; 
        Object.assign(newContext, playerContext);
        Object.assign(newContext, context);
        setPlayerContext(newContext as PlayerContextData);
    }

    function getCurrentState(): PlayerState {
        const video = videoRef.current;
        if (!video) {
            return PlayerState.Paused;
        }

        if (video.played) {
            return PlayerState.Playing;
        }
        if (video.paused) {
            return PlayerState.Paused;
        }
        if (video.ended) {
            return PlayerState.Finished;
        }
        if (video.readyState !== 4) {
            return PlayerState.Loading;
        }
        return PlayerState.Loading;
    }

    async function playerTimeChanged() {
        if (!videoRef.current || !bufferPullRef.current) {
            return;
        }

        const currentTime = videoRef.current.currentTime * 1000;
        const bufferLoaders = bufferPullRef.current;
        if (bufferLoaders) {
            await bufferLoaders.setPlaybackPosition(currentTime);
        }
        updateContext({currentTime});
    }

    return (
        <div className='relative w-full md:w-3/4'>
            <video ref={videoRef} 
                onPlay={() => updateContext({state: PlayerState.Playing})}
                onPause={() => updateContext({state: PlayerState.Paused})}
                onTimeUpdate={playerTimeChanged}
                poster='/PreviewPlaceholder.png'
                className='w-full aspect-video'
                >
            </video>
            <PlayerContext.Provider value={playerContext}>
                <ControlsLayout/>
            </PlayerContext.Provider>

        </div>
        
    )
}