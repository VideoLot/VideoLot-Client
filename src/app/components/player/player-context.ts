import { createContext } from "react";

export enum PlayerState {
    Playing,
    Paused,
    Loading,
    Finished
}
export type SetStateCallback = ((state: PlayerState) => void) | undefined;

export type SetFullscreenCallback = ((isFullscreen: boolean) => void) | undefined;

export type SetCurrentTimeCallback = ((currentTime: number) => void) | undefined;

export interface PlayerContextData {
    state: PlayerState,
    isFullScreen: boolean,
    duration: number,
    currentTime: number,
    setState: SetStateCallback,
    setFullscreen: SetFullscreenCallback,
    setCurrentTime: SetCurrentTimeCallback
}

export const PlayerContext = createContext({
    state: PlayerState.Paused,
    isFullScreen: false,
    duration: 0,
    currentTime: 0
} as PlayerContextData); 