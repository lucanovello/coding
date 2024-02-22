const text = document.getElementById('text');

class Mouse {
    constructor() {
        this.x = window.innerWidth * 0.5;
        this.y = window.innerHeight * 0.5;
        this.normX = 1;
        this.normY = 1;
    }
    update(x, y) {
        this.x = x;
        this.y = y;
        this.normX = this.x / window.innerWidth;
        this.normY = this.y / window.innerHeight;
    }
}
const mouse = new Mouse();

class Cell {
    constructor(grid, x, y) {
        this.grid = grid;
        this.ctx = this.grid.context;
        this.x = x;
        this.y = y;
        this.width = this.grid.width / this.grid.columns;
        this.height = this.grid.height / this.grid.rows;
        this.dx = mouse ? mouse.x - this.x : window.innerWidth * 0.5;
        this.dy = mouse ? mouse.y - this.y : window.innerHeight * 0.5;
        this.distance = Math.hypot(this.dx, this.dy);
        this.normDistance =
            this.distance /
            (window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);
        this.angle = Math.atan2(this.dy, this.dx);
        // style
        this.hue = 160;
        this.hueAdjust = 720;
        this.saturation = 90;
        this.brightness = 45;
        this.alpha = 1;
        this.lineWidth = 1;
        this.lineLength =
            this.normDistance <= 0.2 ? this.width * this.normDistance : this.width * 0.2;
        this.minLineLength = 0.2;
        this.counter = Math.random() * 60;
    }
    update(object) {
        // const centerX = this.x * this.width + this.width * 0.5;
        // const centerY = this.y * this.height + this.height * 0.5;
        this.dx = object.x - this.x * this.width;
        this.dy = object.y - this.y * this.height;
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.normDistance =
            this.distance /
            Math.sqrt(
                window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight
            );
        this.angle = Math.atan2(this.dy, this.dx);
        this.lineLength =
            this.normDistance <= this.minLineLength
                ? this.width * this.normDistance
                : this.width * this.minLineLength;
        this.counter += 0.01;
    }
    draw() {
        const x = this.x * this.width + Math.cos(this.counter * 3) * 5;
        const y = this.y * this.height + Math.sin(this.counter) * 7;
        const centerX = this.x * this.width + Math.cos(this.counter * 3) * 5;
        const centerY = this.y * this.height + Math.sin(this.counter) * 7;
        const width = this.width * this.lineLength;
        const height = this.height * this.lineLength;

        //draw center dot
        this.ctx.beginPath();
        this.ctx.fillStyle = `hsla(${this.hue + this.hueAdjust * this.normDistance}, ${
            this.saturation * (1 - this.normDistance * this.normDistance)
        }%, ${this.brightness}%,${this.alpha - this.normDistance})`;
        this.ctx.strokeStyle = `hsla(${this.hue + this.hueAdjust * this.normDistance}, ${
            this.saturation - 30
        }%, ${this.brightness + 80}%,${this.alpha * 0.9 - this.normDistance})`;
        this.ctx.lineWidth = 1 - this.normDistance;
        this.ctx.arc(
            centerX + Math.cos(this.angle) * this.lineLength,
            centerY + Math.sin(this.angle) * this.lineLength,
            (1 - this.normDistance) * (1 / (this.normDistance > 0.1 ? this.normDistance : 0.1)),
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        // draw line
        // this.ctx.beginPath();
        // this.ctx.moveTo(centerX, centerY);
        // this.ctx.lineTo(
        //     centerX + Math.cos(this.angle) * this.lineLength,
        //     centerY + Math.sin(this.angle) * this.lineLength
        // );

        // this.ctx.stroke();
        // this.ctx.closePath();
    }
    resize(grid, width, height) {
        this.grid = grid;
        this.width = width / this.grid.columns;
        this.height = height / this.grid.rows;
    }
}

class Grid {
    constructor(cellWidth, cellHeight = cellWidth) {
        this.canvas;
        this.context;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.cellWidth = cellWidth < this.width * 0.05 ? cellWidth : this.width * 0.05;
        this.cellHeight = cellHeight < this.height * 0.05 ? cellWidth : this.height * 0.05;
        this.columns = Math.ceil(this.width / this.cellWidth);
        this.rows = Math.ceil(this.height / this.cellHeight);
        this.gridArr = [];
        this.init();
    }
    init() {
        this.gridArr = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.classList = 'canvas-grid';
        canvas.id = 'canvas-grid';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.context = ctx;
        this.columns = Math.ceil(this.canvas.width / this.cellWidth);
        this.rows = Math.ceil(this.canvas.height / this.cellHeight);
        for (let y = 0; y < this.rows + 1; y++) {
            for (let x = 0; x < this.columns + 1; x++) {
                this.gridArr.push(new Cell(this, x, y));
            }
        }
    }
    update() {
        for (let i = 0; i < this.gridArr.length; i++) {
            this.gridArr[i].update(mouse);
        }
    }
    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.gridArr.length; i++) {
            this.gridArr[i].draw();
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        for (let i = 0; i < this.gridArr.length; i++) {
            this.gridArr[i].resize(this, this.width, this.height);
        }
    }
}

// EVENT LISTENERS
window.addEventListener('resize', () => {
    grid.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
    mouse.update(
        e.changedTouches[0].clientX > 0 ? e.changedTouches[0].clientX : 0,
        e.changedTouches[0].clientY > 0 ? e.changedTouches[0].clientY : 0
    );
});
window.addEventListener('touchstart', (e) => {
    mouse.update(
        e.changedTouches[0].clientX > 0 ? e.changedTouches[0].clientX : 0,
        e.changedTouches[0].clientY > 0 ? e.changedTouches[0].clientY : 0
    );
});

let deviceText = `'deviceorientation' not found`;
window.addEventListener('devicemotion', handleOrientation);
window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(e) {
    console.log(e);
}

// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const grid = new Grid(this.width * 0.01);

// MAIN FUNCTION
function animate() {
    text.innerText = `(${mouse.x.toFixed(1)}, ${mouse.y.toFixed(1)})`;
    grid.update();
    grid.draw();

    requestAnimationFrame(animate);
}
animate();
