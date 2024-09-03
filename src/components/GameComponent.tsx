import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { DuelGame } from '../game_core/game';
import './GameComponent.css';

interface GameComponentProps {
    handleContextMenu: (e: React.MouseEvent) => void;
    changeScoreCallback: ()=>void;
    width?: number;
    height?: number;
};

const GameComponent = forwardRef<DuelGame, GameComponentProps>((props, ref) => {
    const { handleContextMenu, changeScoreCallback, width, height } = props;
    const innerRef = useRef<DuelGame>();

    useImperativeHandle(ref, () => innerRef.current as DuelGame)

    const handleRef = (node: HTMLDivElement) => {
        if(innerRef.current)
             return;
        innerRef.current = new DuelGame({ container: node, width: width || 400,  height: height || 300, className :"game-container", changeScoreCallback  });
        innerRef.current.render({ radius: 15, color: 'green' }, { radius: 15, color: 'yellow' });
    };

    return (<div onContextMenu={handleContextMenu} ref={handleRef}></div>)
});

export default memo(GameComponent);


