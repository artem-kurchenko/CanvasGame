import react, { useEffect, useRef } from 'react';
import { DuelGame } from '../game_core/game';

export function GameComponent(): JSX.Element {
    const gameContainer = useRef<HTMLDivElement>(null)
    const gameInstance = useRef<DuelGame | null>(null);
    useEffect(() => {
        if (gameInstance.current)
            return
        gameInstance.current = new DuelGame({ container: gameContainer.current, width: 400, height: 300 });
        gameInstance.current.render({ radius: 15, color: 'green' }, { radius: 15, color: 'yellow' });
        gameInstance.current.start();
        setTimeout(() => {
            gameInstance.current?.stop();
        }, 20000)
    }, [gameContainer, gameInstance])

    return (<div ref={gameContainer}></div>)
}


