'use client'

import { useState, useRef, useEffect } from "react";
import { PlayerContextData, PlayerContext, PlayerState } from "./player-context";
import ControlsLayout from "./components/control-layout";
import { PlayerData } from "@/app/types";
import { BufferPull } from "./src/buffer-pull";
import { SourceLoader } from './src/source-loader';
import { Queue } from './src/queue';
import { isInRange } from './src/utils';

export default function Player(props: PlayerData) {
    const bufferPullRef = useRef<BufferPull>();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [playerContext, setPlayerContext] = useState({
        state: PlayerState.Paused,//getCurrentState(),
        isFullScreen: false,
        duration: props.videoTrack.trackInfo.duration / 1000,
        currentTime: 0,
        volume: 0.5,
        muted: false,
        setState: setPlayerState,
        setFullscreen: setFullscreen,
        setCurrentTime: setCurrentTime,
        setVolume: setVolume,
        setMuted: setMuted
    } as PlayerContextData);
    const [loaders, setLoaders] = useState<SourceLoader[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        const container = containerRef.current;
        if (!container) {
            return;
        }

        container.addEventListener('fullscreenchange', (e: Event) => {
            updateContext({isFullScreen: !!document.fullscreenElement});
        })

        if (!bufferPullRef.current) {
            const mediaSource = new MediaSource();
            bufferPullRef.current = new BufferPull(mediaSource, readyForPlaybackHandler);

            mediaSource.addEventListener('sourceopen', videoSourceOpen);
            const mediaURL = URL.createObjectURL(mediaSource);
            video.src = mediaURL; 
        }
    });

    function readyForPlaybackHandler(pos: number) {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        video.currentTime = pos;
    }

    async function videoSourceOpen(event: Event) {
        const pull = bufferPullRef.current;
        if (pull) {
            const newLoaders = [];
            newLoaders.push(pull.createSourceWithLoader(props.videoTrack.trackInfo));
            if (props.audioTracks.length > 0) {
                newLoaders.push(pull.createAudioSourceWithLoader(props.audioTracks[0].trackInfo));
            }
            setLoaders(newLoaders);
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
        const container = containerRef.current;
        if (!container) {
            return;
        }

        if (isFullScreen) {
            container.requestFullscreen({navigationUI:'hide'})
                .then(() => {
                    
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            document.exitFullscreen();
        }
        
    }

    function setVolume(val: number) {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        video.volume = val;
    }

    function setMuted(val: boolean) {
        const video =  videoRef.current;
        if (!video) {
            return;
        }

        if (val !== video.muted) {
            video.muted = val;
            updateContext({muted: val, state: getCurrentState()});
        }
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

    async function setCurrentTime(newTime: number) {
        const video = videoRef.current;
        const loader = bufferPullRef.current;
        if (!video || !loader) {
            return;
        }

        if (isInRange(newTime, video.seekable)) { //then ready to seek set time immediately
            video.currentTime = newTime;
        } else {
            await loader.setPlaybackPosition(newTime); // then is not ready load the data and wait until ready for playback
        }
    }

    async function handleTimeUpdated() {
        if (!videoRef.current || !bufferPullRef.current) {
            return;
        }

        const currentTime = videoRef.current.currentTime;
        const bufferLoaders = bufferPullRef.current;
        if (bufferLoaders) {
            await bufferLoaders.setPlaybackPosition(currentTime);
        }
        updateContext({currentTime});
    }

    function handleVolumeChange() {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        updateContext({volume: video.volume});
    }

    return <>
        <div ref={containerRef} className='relative w-full md:w-3/4'>
            <video ref={videoRef} 
                onPlay={() => updateContext({state: PlayerState.Playing})}
                onPause={() => updateContext({state: PlayerState.Paused})}
                onTimeUpdate={handleTimeUpdated}
                onVolumeChange={handleVolumeChange}
                poster='/PreviewPlaceholder.png'
                className='w-full aspect-video'
                >
            </video>
            <PlayerContext.Provider value={playerContext}>
                <ControlsLayout/>
            </PlayerContext.Provider>
        </div>
        {/* <div>
        {
            loaders.map(x=><LoaderState key={x.description} loader={x}></LoaderState>)
        }
        </div> */}
    </>
}

function LoaderState({loader} : {loader: SourceLoader}) {
    const [bufferedRanges, setBufferedRanges] = useState(loader.getBufferedRanges());
    const [segmentsInBuffer, setSegmentsInBuffer] = useState<number[]>(loader._segmentsInBuffer);
    
    useEffect(()=>{
        loader.addUpdateListener(() => {
            setBufferedRanges(loader.getBufferedRanges());
            setSegmentsInBuffer(loader._segmentsInBuffer);
        });
    }, []);

    return (
        <div className='flex flex-row w-85vw items-center'>
            <div>{`${loader.description}`}</div>
            <div className='flex flex-col'>
                <QueueState q={loader.downloadQueue}></QueueState>
                <QueueState q={loader.bufferQueue}></QueueState>
            </div>
            <div>
                {
                    segmentsInBuffer.join(' ')
                }
            </div>
            <div className='flex flex-row ml-auto space-x-1'>
                {
                    bufferedRanges.map((x, i)=> <div key={`${i}_${loader.description}`} className='bg-green-200 p-1 rounded-md'>{`${x.start}-${x.end}`}</div>)
                }
            </div>
        </div>
    )
}

function QueueState<T>({q}: {q: Queue<T>}) {
    const [queueElements, setQueueElements] = useState<string[]>([]);

    useEffect(() => {
        q.addListener((data: T[])=>{
            setQueueElements(data.map(x=>`${x}`));
        });
        setQueueElements(q.records.map(x=>`${x}`));
    }, []);
    return(
        <div className='flex flex-row bg-green-200 p-1 rounded-md'>
            {queueElements.join(' ')}
        </div>
    );
}