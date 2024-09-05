# Duel Game

<img width="825" alt="Screenshot 2024-09-03 at 16 28 33" src="https://github.com/user-attachments/assets/0707b8be-a778-4db8-a8d5-8abe4bdda371">

## Overview

**Canvas Field:** A rectangular play area with two circles representing heroes engaged in battle.

**Hero Movement:**
- Heroes move vertically up and down on opposite sides of the screen, similar to paddles in Arkanoid.
- They bounce back upon reaching the edge of the field, changing direction.
**Combat Mechanics:**
- Heroes cast spells by shooting smaller balls at each other.
- Spells vanish upon hitting an enemy, and a hit is recorded on the scoreboard.
  
**Interactive Elements:**
- Heroes react to the mouse cursor by bouncing off it as if it were the field boundary.
- Right-click on a hero opens a React-based context menu to customize the color of their spells.

**Customization:**
Each hero has sliders to adjust their firing rate and movement speed.

## Implementation Details

- All game logic is located in the `game_core` folder. I used ES6 classes to implement hierarchy and logic.
- The main application contains the `GameComponent` component that initializes all game logic to make everything flexible.
- All UI elements Trackbars, ContextMenu are also separate React components 

## Known Issues

- Damage animation is not perfect. Hero balls won't be re-rendered if the game is stoped and damage appears
- No specific design \ theme style. Just basic CSS
- Typings are not defined everywhere
- Not all Game props can be changed via the React State
- Core classes (Game, Ball descendants ) don't use private fields
- No specific Style rules in code
- No tests 
  
