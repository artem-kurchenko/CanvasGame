export function circleIntersect(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
    return Math.hypot(x0 - x1, y0 - y1) <= r0 + r1;
}

export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}