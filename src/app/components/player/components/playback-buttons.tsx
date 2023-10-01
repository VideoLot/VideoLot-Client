'use client';
import { useContext } from 'react';
import { PlayerContext, PlayerState } from '../player-context';


export function PlaybackButtons() {
    const playerContext = useContext(PlayerContext);

    function playButtonClick() {
        if (!playerContext.setState) {
            return;
        }

        if (playerContext.state === PlayerState.Paused) {
            playerContext.setState(PlayerState.Playing);
        }
        if (playerContext.state === PlayerState.Playing) {
            playerContext.setState(PlayerState.Paused);
        }
    }

    const playButtonBg = playerContext.state === PlayerState.Playing ?
        'bg-pause-button-texture' :
        'bg-play-button-texture';
    return (
        <div className='flex h-1/4 pointer-events-auto space-x-2'>
            <button
                onClick={playButtonClick}
                className={`${playButtonBg} bg-no-repeat bg-cover aspect-square`} />
        </div>);
}
