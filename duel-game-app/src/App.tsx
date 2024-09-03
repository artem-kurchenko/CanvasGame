import { useCallback, useRef, useState } from 'react'

import './App.css'
import GameComponent from './components/GameComponent'
import ContextMenu from './components/ContextMenu'
import Trackbar from './components/TrackBar';

import { DuelGame } from './game_core/game';
import { getMousePos, isPointInCircle } from './game_core/utils';


type GameHeros = Extract<keyof DuelGame, 'h1' | 'h2'>;

function App() {

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [buttonText, setButtonText] = useState('Start');
  const [showMenu, setShowMenu] = useState(false);
  const [score, setScore] = useState([0, 0]);
  const [gameSettings, setGameSettings] = useState({
    h1Speed: 1,
    h1SpellSpeed: 1,
    h1Color: "",
    h2Color: "",
    h2Speed: 1,
    activeHero: "",
    h2SpellSpeed: 1
  });

  const gameRef = useRef<DuelGame | null>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    const instance = gameRef.current;
    const menuCoordinates = getMousePos(instance?.canvas!, event.nativeEvent)
    let heroName = ""
    if (isPointInCircle(menuCoordinates.x, menuCoordinates.y, instance?.h1.x!, instance?.h1.y!, instance?.h1.radius!))
      heroName = "h1"
    if (isPointInCircle(menuCoordinates.x, menuCoordinates.y, instance?.h2.x!, instance?.h2.y!, instance?.h2.radius!))
      heroName = "h2"
    setGameSettings((prev) => ({
      ...prev,
      activeHero: heroName
    }))
    if (heroName === "")
      return;
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setShowMenu(true);
  }, [setGameSettings, setMenuPosition, setShowMenu, gameRef.current]);

  const handleItemClick = useCallback((color: string) => {
    setShowMenu(false);
    if (!gameRef.current || gameSettings.activeHero === "")
      return;
    const hero = gameRef.current[gameSettings.activeHero as GameHeros]
    hero.color = color;
    hero.draw();
  }, [gameRef.current, gameSettings.activeHero]);

  const scoreChangeAction = useCallback(() => {
    if (!gameRef.current)
      return;
    const instance = gameRef.current;
    setScore([instance.h1Count, instance.h2Count]);
  }, [gameRef.current])


  const handleChange = useCallback((value: number, propName: string) => {
    if (!gameRef.current)
      return;
    const propPath = propName.split('_');
    const hero = gameRef.current[propPath[0] as GameHeros]
    if (propPath.length === 2)
      hero.vy = value;
    else
      hero.spellSpeed = value;
    setGameSettings((prev) => ({
      ...prev,
      [propPath.join("")]: value || 1
    }));
  }, [gameRef.current]);

  const clickHandler = useCallback(() => {
    if (!gameRef.current)
      return;
    const instance = gameRef.current;
    if (instance.isStarted)
      instance.stop()
    else {
      instance.start();
    }
    setButtonText(instance.isStarted ? 'Stop' : 'Start');
  }, [gameRef.current])

  return (
    <>
      <div className='game-layout'>
        <div className='row-score'>
          {`${score[0]} : ${score[1]}`}
        </div>
        <div className="row-game">
          <div className='hero-settings'>
            <Trackbar min={1} step={1} max={5} id='h1_Speed' title='Hero 1' handleChange={handleChange} initialValue={gameSettings.h1Speed} />
            <Trackbar min={1} step={1} max={5} id='h1_Spell_Speed' title='Spell' handleChange={handleChange} initialValue={gameSettings.h1SpellSpeed} />
          </div>
          <GameComponent ref={gameRef}
            width={300}
            height={300}
            changeScoreCallback={scoreChangeAction}
            handleContextMenu={handleContextMenu} />
          <div className='hero-settings'>
            <Trackbar min={1} step={1} max={5} id='h2_Speed' title='Hero 2' handleChange={handleChange} initialValue={gameSettings.h2Speed} />
            <Trackbar min={1} step={1} max={5} id='h2_Spell_Speed' title='Spell' handleChange={handleChange} initialValue={gameSettings.h2SpellSpeed} />
          </div >
        </div>
        <div className='row-button'>
          <button onClick={clickHandler}>{`${buttonText}`}</button>
        </div>
      </div>
      <ContextMenu setShowMenu={setShowMenu} showMenu={showMenu} menuPosition={menuPosition} menuClickHandler={handleItemClick} />
    </>
  )
}

export default App
