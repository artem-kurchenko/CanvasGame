import { HeroBall, HeroBallProps } from "./hero";
import { getMousePos, circleIntersect } from "./utils";

type DuelGameProps = {
    container: string | Element | null;
    width: number;
    height: number;
    changeScoreCallback?: () => void;
};
type GameHeroProps = Pick<HeroBallProps, "radius" | "speed" | "color">;
export class DuelGame {
    container: Element | null;
    width: number;
    height: number;
    h1Count: number;
    h2Count: number;
    changeScoreCallback?: () => void ;
    isStarted: boolean;
    canvas!: HTMLCanvasElement;
    h1!: HeroBall;
    h2!: HeroBall;

    constructor({ container, width, height, changeScoreCallback }: DuelGameProps) {
        if (typeof container === "string" || container instanceof String) {
            this.container = document.querySelector(container as string) ||
                document.querySelector(`#${container}`) ||
                document.querySelector(`.${container}`);
        } else if (container instanceof Element) {
            this.container = container;
        } else {
            throw new Error("Container is not valid");
        }

        this.width = width;
        this.height = height;
        this.h1Count = 0;
        this.h2Count = 0;
        this.changeScoreCallback = changeScoreCallback;
        this.isStarted = false;
    }

    private _renderCanvas(): void {
        const canvas = document.createElement("canvas");
        canvas.id = "duel_game_canvas";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.classList.add('game');
        this.container?.appendChild(canvas);
        this.canvas = canvas;
    }

    render(hero1Props: GameHeroProps, hero2Props: GameHeroProps): void {
        this._renderCanvas();
        this._addEventListeners();
        this._renderHeros(hero1Props, hero2Props);
    }

    private _renderHeros(hero1Props: GameHeroProps, hero2Props: GameHeroProps): void {
        const { radius: h1Radius, color: h1Color, speed: h1Speed } = hero1Props;
        const { radius: h2Radius, color: h2Color, speed: h2Speed } = hero2Props;

        this.h1 = new HeroBall({
            x: h1Radius,
            y: h1Radius,
            radius: h1Radius,
            color: h1Color,
            container: this.canvas.id,
            speed: h1Speed,
            renderedCallback: this.checkDamage
        });

        this.h2 = new HeroBall({
            x: this.canvas.clientWidth - h2Radius,
            y: this.canvas.clientHeight - h2Radius,
            radius: h2Radius,
            color: h2Color,
            container: this.canvas.id,
            speed: h2Speed,
            renderedCallback: this.checkDamage
        });

        this.h1.draw();
        this.h2.draw();
    }

    private _addEventListeners(): void {
        this.canvas.addEventListener("mousemove", (evt: MouseEvent) => {
            this.h1.mouseCoords = getMousePos(this.canvas, evt);
            this.h2.mouseCoords = getMousePos(this.canvas, evt);
        });

        this.canvas.addEventListener("mouseleave", () => {
            this.h1.mouseCoords = { x: 0, y: 0 };
            this.h2.mouseCoords = { x: 0, y: 0 };
        });
    }

    checkDamage = (spellX: number, spellY: number, spellRadius: number): boolean => {
        let result = false;
   
        if (circleIntersect(spellX, spellY, spellRadius, this.h1.x, this.h1.y, this.h1.radius)) {
            this.h2Count++;
            this.h1.draw("orange");
            result = true;
        }

        if (circleIntersect(spellX, spellY, spellRadius, this.h2.x, this.h2.y, this.h2.radius)) {
            this.h1Count++;
            this.h2.draw("orange");
            result = true;
        }

        if (result && this.changeScoreCallback) {
            this.changeScoreCallback();
        }

        return result;
    };

    start(): void {
        this.isStarted = true;
        this.h1.move("down");
        this.h2.move("up");
    }

    stop(): void {
        this.isStarted = false;
        window.cancelAnimationFrame(this.h1.raf!);
        window.cancelAnimationFrame(this.h2.raf!);
    }
}
