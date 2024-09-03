import { BallProps, Ball } from "./ball_base";

export type MagicBallProps = BallProps & {
    vy?: number;
    vx?: number;
};

export class MagicBall extends Ball {
    vy: number;
    vx: number;
    direction?: string;
    raf?: number;

    constructor(props: MagicBallProps) {
        super(props);
        this.vy = props.vy || 0;
        this.vx = props.vx || 0;
    }

    randomizeDirection(): void {
        const randomNumber = Math.floor(Math.random() * 3);
        this.vy *= randomNumber - 1;
    }

    move(direction: string = ""): void {
        const canvas = <HTMLCanvasElement>document.querySelector(`#${this.container}`)!;

        if (!this.direction) {
            this.direction = direction;
        }

        this.cleanArea();

        const deltaX = this.direction === "left" ? -this.vx : this.vx;
        this.x += deltaX;
        this.y += this.vy;

        const hitVerticalBounds = this.y + this.vy > canvas.height - this.radius || this.y + this.vy < this.radius;
        const hitHorizontalBounds = this.x + deltaX > canvas.width - this.radius || this.x + deltaX < this.radius;

        if (hitVerticalBounds || hitHorizontalBounds) {
            window.cancelAnimationFrame(this.raf!);
            return;
        }

        this.draw();

        const damaged = this.renderedCallback(this.x, this.y, this.radius);
        if (!damaged) {
            this.raf = window.requestAnimationFrame(() => this.move(this.direction!));
        } else {
            this.cleanArea();
        }
    }
}