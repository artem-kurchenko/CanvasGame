import { Ball, BallProps } from "./ball_base";
import { MagicBall } from "./spell";

export type HeroBallProps = BallProps & {
    speed?: number;
    spellColor?: string;
    spellSpeed?: number;
};

export class HeroBall extends Ball {
    vy: number;
    spellColor: string;
    spellSpeed: number;
    direction?: string;
    timeoutId?: number | null;
    raf?: number;
    mouseCoords?: { x: number; y: number };

    constructor({ speed, spellColor, spellSpeed, ...props }: HeroBallProps) {
        super(props);
        this.vy = speed || 2;
        this.spellColor = spellColor || "blue";
        this.spellSpeed = spellSpeed || 1;
    }

    getEdges(): { topEdge: number; bottomEdge: number } {
        const { radius, x, y, direction, mouseCoords } = this;
        const canvas = document.querySelector(`#${this.container}`)!;
        const mousePosition = mouseCoords || { x: -1, y: -1 };

        let topEdge = radius;
        let bottomEdge = canvas.clientHeight - radius;

        const isMouseInRangeX = x - radius <= mousePosition.x && mousePosition.x <= radius + x;
        if (isMouseInRangeX) {
            const isMouseAboveBall = mousePosition.y > topEdge && y > mousePosition.y && direction === "up";
            const isMouseBelowBall = mousePosition.y < bottomEdge && y < mousePosition.y && direction === "down";

            if (isMouseAboveBall) {
                topEdge = mousePosition.y + radius;
            }

            if (isMouseBelowBall) {
                bottomEdge = mousePosition.y - radius;
            }
        }
        return {
            topEdge,
            bottomEdge
        };
    }

    move(direction: string = ""): void {
        if (!this.direction) {
            this.direction = direction;
        }

        this.cleanArea();
        const { topEdge, bottomEdge } = this.getEdges();
        const delta = this.direction === "up" ? -this.vy : this.vy;
        this.y += delta;

        if (this.y + delta > bottomEdge || this.y + delta < topEdge) {
            this.direction = this.direction === "up" ? "down" : "up";
        }

        this.draw();
        this.fireSpell();
        this.raf = window.requestAnimationFrame(() => this.move(this.direction!));
    }

    createSpell(direction: string): void {
        const { x, y, radius } = this;
        const posX = direction === "right" ? x + 2 * radius + 1 : x - 2 * radius - 1;
        const canvas = document.querySelector(`#${this.container}`)!;
        const mb = new MagicBall({
            x: posX,
            y: y,
            radius: 5,
            color: this.spellColor,
            container: canvas.id,
            vy: 2 * this.spellSpeed,
            vx: 3 * this.spellSpeed,
            renderedCallback: this.renderedCallback
        });
        mb.draw();
        mb.randomizeDirection();
        mb.move(direction);
    }

    fireSpell(): void {
        if (this.timeoutId) return;

        this.timeoutId = setTimeout(() => {
            this.createSpell(this.x === 15 ? "right" : "left");
            clearTimeout(this.timeoutId!);
            this.timeoutId = null;
        }, 1000 / this.spellSpeed);
    }
}