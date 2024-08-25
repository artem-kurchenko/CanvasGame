function circleIntersect(x0, y0, r0, x1, y1, r1) {
    return Math.hypot(x0 - x1, y0 - y1) <= r0 + r1;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function createToggleButton() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    toggleButton.textContent = 'Start'; 
    document.body.appendChild(toggleButton);
    return toggleButton;
}
function createTrackbar(min, max, step, initialValue, id) {

    const label = document.createElement('label');
    label.textContent = 'Speed:';
    label.setAttribute('for', `${id}_trackbar_label`);
    const trackbar = document.createElement('input');
    trackbar.type = 'range';
    trackbar.id = `${id}_trackbar`;
    trackbar.min = min;
    trackbar.max = max;
    trackbar.step = step;
    trackbar.value = initialValue;
    const currentValue = document.createElement('span');
    currentValue.id = `${id}_trackbar_value`;
    currentValue.textContent = initialValue + 'x';
    document.body.appendChild(label);
    document.body.appendChild(trackbar);
    document.body.appendChild(currentValue);

    return trackbar;
}

class Ball {
    constructor({ x, y, color, radius, container, renderedCallback }) {
        this.x = x;
        this.y = y;
        this.container = container;
        this.ctx = document.querySelector(`#${container}`).getContext('2d');
        this.color = color;
        this.radius = radius;
        this.renderedCallback = renderedCallback;
    }
    draw(color) {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = color || this.color;
        this.ctx.fill();
    }
    cleanArea() {
        const ball = this;
        const clearX = ball.x - ball.radius - 1;
        const clearY = ball.y - ball.radius - 1;
        const clearWidth = ball.radius * 2 + 2;
        const clearHeight = ball.radius * 2 + 2;
        ball.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
    }
    move() {
        throw new Error("Not Implemented")
    }
}
class HeroBall extends Ball {
    constructor({ speed, spellColor, spellSpeed, ...props }) {
        super(props);
        this.vy = speed || 2;
        this.spellColor = spellColor || "blue";
        this.spellSpeed = spellSpeed || 1;
    }
    getEdges() {
        const { radius, x, y, direction, mouseCoords } = this;
        const canvas = document.querySelector(`#${this.container}`);
        const mousePosition = mouseCoords || { x: -1, y: -1 };

        let topEdge = radius;
        let bottomEdge = canvas.clientHeight - radius;

        const isMouseInRangeX = (x - radius <= mousePosition.x) && (mousePosition.x <= radius + x);
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
    move(direction) {
        const ball = this;

        if (!ball.direction) {
            ball.direction = direction;
        }

        const ctx = ball.ctx;
        ball.cleanArea(ball, ctx);
        const { topEdge, bottomEdge } = ball.getEdges();
        const delta = ball.direction === "up" ? -ball.vy : ball.vy;
        ball.y += delta;
        if (ball.y + delta > bottomEdge || ball.y + delta < topEdge) {
            ball.direction = ball.direction === "up" ? "down" : "up";
        }
        ball.draw();
        ball.fireSpell();
        ball.raf = window.requestAnimationFrame(() => ball.move(ball.direction));
    }
    createSpell(direction) {
        const { x, y, radius } = this;
        const posX = direction === "right" ? x + 2 * radius + 1 : x - 2 * radius - 1;
        const canvas = document.querySelector(`#${this.container}`);
        const mb = new MagicBall({
            x: posX, y: y,
            radius: 5,
            color: this.spellColor, container: canvas.id,
            vy: 2 * this.spellSpeed,
            vx: 3 * this.spellSpeed,
            renderedCallback: this.renderedCallback
        })
        mb.draw();
        mb.randomizeDirection();
        mb.move(direction);
    }
    fireSpell() {
        if (this.timeoutId)
            return;
        this.timeoutId = setTimeout(() => {
            this.createSpell(this.x === 15 ? "right" : "left")
            clearTimeout(this.timeoutId);
            this.timeoutId = null
        }, 1000 / this.spellSpeed)
    }

}
class MagicBall extends Ball {
    constructor(props) {
        super(props);
        this.vy = props.vy || this.vy;
        this.vx = props.vx || this.vy;
    }
    randomizeDirection() {
        const randomNumber = Math.floor(Math.random() * 3); 
        this.vy *= (randomNumber - 1);
    }
    move(direction) {
        const ball = this,
            canvas = document.querySelector(`#${this.container}`)

        if (!ball.direction) {
            ball.direction = direction;
        }
        ball.cleanArea();

        const deltaX = ball.direction === "left" ? -ball.vx : ball.vx;
        ball.x += deltaX;
        ball.y += ball.vy;

        const hitVerticalBounds = ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius;
        const hitHorizontalBounds = ball.x + deltaX > canvas.width - ball.radius || ball.x + deltaX < ball.radius;

        if (hitVerticalBounds || hitHorizontalBounds) {
            window.cancelAnimationFrame(ball.raf);
            return;
        }

        ball.draw();

        const damaged = ball.renderedCallback(ball.x, ball.y, ball.radius);
        if (!damaged) {
            ball.raf = window.requestAnimationFrame(() => ball.move(ball.direction));
        } else {
            ball.cleanArea();
        }
    }
}

class DuelGame {
    constructor({ container, width, height, changeScoreCallback = ()=>{ console.log('score_changed') } }) {
        if (typeof container === "string" || container instanceof String) {
            this.container = document.querySelector(container) ||
                document.querySelector(`#${container}`) ||
                document.querySelector(`.${container}`);
        } else if (container instanceof Element) {
            this.container = container;
        }

        if (!this.container) {
            throw new Error("Container is not valid");
        }
        this.width = width;
        this.height = height;
        this.h1Count = 0;
        this.h2Count = 0;
        this.changeScoreCallback = changeScoreCallback;
        this.isStarted = false;
    }
    _renderCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "test_canvas"
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.classList.add('game')
        this.container.appendChild(canvas)
        this.canvas = canvas;
    }

    render(hero1Props, hero2Props) {
        this._renderCanvas();
        this._addEventListeners();
        this._renderHeros(hero1Props, hero2Props);
    }
    _renderHeros(hero1Props, hero2Props) {
        const { radius: h1Radius, color: h1Color, speed: h1Speed } = hero1Props;
        const { radius: h2Radius, color: h2Color, speed: h2Speed } = hero2Props;
        this.h1 = new HeroBall({
            x: h1Radius,
            y: h1Radius, radius: h1Radius,
            color: h1Color,
            container: this.canvas.id,
            speed: h1Speed,
            renderedCallback: this.checkDamage
        });
        this.h2 = new HeroBall({
            x: this.canvas.clientWidth - h2Radius,
            y: this.canvas.clientHeight - h2Radius,
            radius: h2Radius, color: h2Color,
            container: this.canvas.id,
            speed: h2Speed,
            renderedCallback: this.checkDamage
        })
        this.h1.draw();
        this.h2.draw();
    }
    _addEventListeners() {
        this.canvas.addEventListener("mousemove", (evt) => {
            this.h1.mouseCoords = getMousePos(this.canvas, evt);
            this.h2.mouseCoords = getMousePos(this.canvas, evt)
        })
        this.canvas.addEventListener("mouseleave", () => {
            this.h1.mouseCoords = { x: 0, y: 0 };
            this.h2.mouseCoords = { x: 0, y: 0 };
        })
    }
    checkDamage = (spellX, spellY, spellRadius) => {
        let result = false;
        if (circleIntersect(spellX, spellY, spellRadius, this.h1.x, this.h1.y, this.h1.radius)) {
            this.h2Count++;
            this.h1.draw("orange");
            result = true;
        }
        if (circleIntersect(spellX, spellY, spellRadius, this.h2.x, this.h2.y, this.h2.radius)) {
            this.h1Count++;
            this.h2.draw("orange");
            result = true
        }
        if(result)
          this.changeScoreCallback();
        return result;
    }
    start() {
        this.isStarted = true;
        this.h1.move("down");
        this.h2.move("up")      
    }
    stop() {
        this.isStarted = false;
        window.cancelAnimationFrame(this.h1.raf);
        window.cancelAnimationFrame(this.h2.raf);
    }
}
window.addEventListener("DOMContentLoaded", () => {
    function changeScoreCallback(){
       const container =  document.getElementById("score");
       container.innerText =  `h1:${game.h1Count} h2:${game.h2Count}`;
    }
    const game = new DuelGame({ container: document.body, width: 400, height: 400, changeScoreCallback });
    game.render({ radius: 15, color: 'green' }, { radius: 15, color: 'yellow' });
    const setupTrackbar = (min, max, step, initial, id, onChange) => {
        let trackbar = createTrackbar(min, max, step, initial, id);
        trackbar.addEventListener("input", () => {
            const valueContainer = document.querySelector(`#${trackbar.id}_value`);
            valueContainer.textContent = trackbar.value + 'x';
            onChange(Number(trackbar.value));
        });
    };
    
    setupTrackbar(1, 5, 1, 1, 'h1', (value) => {
        game.h1.vy = value;
    });
    
    setupTrackbar(1, 5, 1, 1, 'h1_ball', (value) => {
        game.h1.spellSpeed = value;
    });
    
    setupTrackbar(1, 5, 1, 1, 'h2', (value) => {
        game.h2.vy = value;
    });
    
    setupTrackbar(1, 5, 1, 1, 'h2_ball', (value) => {
        game.h2.spellSpeed = value;
    });
    const toggleButton = createToggleButton();
    
    toggleButton.addEventListener('click', function () {
        if (game.isStarted) {
            toggleButton.textContent = 'Start'; // Change text to "Start"
            game.stop();
            // Add your stop action logic here
        } else {
            toggleButton.textContent = 'Stop'; // Change text to "Stop"
            game.start();         
            // Add your start action logic here
        }
    });
})