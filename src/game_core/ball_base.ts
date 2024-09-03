export type BallProps = {
    x: number;
    y: number;
    color: string;
    radius: number;
    container: string;
    renderedCallback: (x: number, y: number, radius: number) => boolean;
};

export class Ball {
    x: number;
    y: number;
    color: string;
    radius: number;
    container?: string;
    ctx: CanvasRenderingContext2D;
    renderedCallback: (x: number, y: number, radius: number) => boolean;

    constructor({ x, y, color, radius, container, renderedCallback }: BallProps) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.container = container;
        this.ctx = (<HTMLCanvasElement>document.querySelector(`#${container}`))!.getContext('2d')!;
        this.renderedCallback = renderedCallback;
    }

    draw(color?: string): void {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = color || this.color;
        this.ctx.fill();
    }

    cleanArea(): void {
        const clearX = this.x - this.radius - 1;
        const clearY = this.y - this.radius - 1;
        const clearWidth = this.radius * 2 + 2;
        const clearHeight = this.radius * 2 + 2;
        this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
    }

    move(): void {
        throw new Error("Not Implemented");
    }
}




