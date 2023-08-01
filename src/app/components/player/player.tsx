'use client'

import { useState, useRef, useEffect } from "react";
import { PlayerContextData, PlayerContext, PlayerState } from "./player-context";
import { SegmentsLoader } from "./segments-loader";
import ControlsLayout from "./components/control-layout";
import { PlayerData } from "@/app/types";

export default function Player(props: PlayerData) {
    const segmentsQueue = new Array<{num: number, data: ArrayBuffer}>();

    let mediaSourceRef = useRef<MediaSource>();
    let videoSourceRef = useRef<SourceBuffer>();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const segmentsLoaderRef = useRef<SegmentsLoader>();
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

        if (!segmentsLoaderRef.current){
            const segmentsLoader = new SegmentsLoader(props.id, 
                props.videoTrack.trackInfo.segmentsCount, 
                segmentReadyCallback);
            segmentsLoaderRef.current = segmentsLoader;
        }

        if (!mediaSourceRef.current) {
            const mediaSource = new MediaSource();
            mediaSourceRef.current = mediaSource;
            mediaSource.addEventListener('sourceopen', videoSourceOpen);
            mediaSource.addEventListener('sourceclose', () => {
                console.log('Source Closed');
            });
            const mediaURL = URL.createObjectURL(mediaSource);
            video.src = mediaURL; 
        }
    });

    function segmentReadyCallback(num: number, data: ArrayBuffer) {
        const mediaSource = mediaSourceRef.current;
        if (mediaSource) {
            mediaSource.sourceBuffers;
        }
        const videoSource = videoSourceRef.current;

        if (!videoSource || videoSource.updating) {
            const alreadyHas = segmentsQueue.find(x=>x.num === num);
            if (!alreadyHas) {
                segmentsQueue.push({num, data});
            }
        } else {
            videoSource.appendBuffer(data);
        }
    }

    async function videoSourceOpen(event: Event) {
        console.log('Source Open');
        const mediaSource = mediaSourceRef.current;
        if (!mediaSource) {return;}

        const loader = segmentsLoaderRef.current;
        if (!loader) {
            return;
        }

        mediaSource.duration = props.videoTrack.trackInfo.duration / 1000.0;
        const videoSource = mediaSource.addSourceBuffer('video/webm;codecs="vp8"');
        videoSourceRef.current = videoSource;
        videoSource.addEventListener("updateend", (event: Event) => {
            if (segmentsQueue.length > 0) {
                const segment = segmentsQueue.shift() as {data: ArrayBuffer};
                videoSource.appendBuffer(segment.data);
            }
        });
        await loader.setPlaybackPosition(0);
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

        // updateContext({state: newState});
    }

    function setFullscreen(isFullScreen: boolean) {

    }

    async function setCurrentTime(newTime: number) {
        const video = videoRef.current;
        const loader = segmentsLoaderRef.current;
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
        if (!videoRef.current || !segmentsLoaderRef.current) {
            return;
        }

        const currentTime = videoRef.current.currentTime * 1000;
        const segmentsLoader = segmentsLoaderRef.current;
        if (segmentsLoader) {
            await segmentsLoader.setPlaybackPosition(currentTime);
        }
        updateContext({currentTime});
        console.log(videoRef.current.buffered)
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