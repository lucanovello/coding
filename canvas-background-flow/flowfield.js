class Mouse {
    constructor(effect) {
        this.effect = effect;
        this.x = effect.width * 0.5;
        this.y = effect.height * 0.5;
        this.radius = 15;
        this.normX = this.x / this.effect.width;
        this.normY = this.y / this.effect.height;
    }
    update(x, y) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = x;
        this.y = y;
        this.normX = this.x / this.effect.width;
        this.normY = this.y / this.effect.height;
    }
    draw(context) {
        context.strokeStyle = `white`;
        context.fillStyle = `white`;
        context.lineWidth = Math.floor(this.radius * 0.1);
        context.beginPath();
        // context.rect(this.x, this.y, this.radius, this.radius);
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.arc(this.x, this.y, this.radius * 0.382, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }
}

class Particle {
    constructor(field, index) {
        this.field = field;
        this.ctx = this.field.ctx;
        // particle physics
        this.x = Math.floor(Math.random() * this.field.width);
        this.y = Math.floor(Math.random() * this.field.height);
        this.index =
            Math.floor(this.y / this.field.width) * this.field.columns +
            Math.floor(this.x / this.field.height);
        this.scale = 1;
        this.speed = 1;
        this.velX = 0;
        this.velY = 0;
        this.velModifier = getRandomArbitrary(1, 5);
        this.angle = this.field.flowFieldArr[this.index].angle;
        // history array to draw lines
        this.history = [{ x: this.x, y: this.y }];
        this.maxHistoryLengthInitial = getRandomArbitrary(10, 210);
        this.maxHistoryLength = this.maxHistoryLengthInitial;
        this.historyTimer = this.maxHistoryLength;
        // style & color
        this.hue = getRandomArbitrary(0, 10);
        this.saturation = getRandomArbitrary(70, 100);
        this.brightness = getRandomArbitrary(35, 90);
        this.alpha = getRandomArbitrary(0.4, 1);
        this.colorChangeRate = 0.1;
        this.lineWidth = 1;
    }
    update() {
        if (this.historyTimer >= 1) {
            let x = Math.ceil(this.x / this.field.width);
            let y = Math.ceil(this.y / this.field.height);
            let index = y * this.field.columns + x;
            this.angle = this.field.flowFieldArr[index].angle;
            // const dx = (mouse.x - this.x) / this.field.width;
            // const dy = (mouse.y - this.y) / this.field.height;
            // const distance = dx * dx + dy * dy;

            this.velX = Math.cos(this.angle) * this.speed;
            this.velY = Math.sin(this.angle) * this.speed;

            this.x += this.velX * this.velModifier;
            this.y += this.velY * this.velModifier;

            this.maxHistoryLength = this.maxHistoryLengthInitial;
            if (this.history.length > this.maxHistoryLength) {
                this.history.shift();
            } else {
                this.history.push({ x: this.x, y: this.y });
            }
        } else if (this.history.length > 1) {
            this.history.shift();
        } else {
            this.reset();
        }

        this.historyTimer--;
    }
    draw() {
        this.ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        this.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.fillRect(
            this.x - this.ctx.lineWidth * this.scale * 0.5,
            this.y - this.ctx.lineWidth * this.scale * 0.5,
            this.ctx.lineWidth * this.scale,
            this.ctx.lineWidth * this.scale
        );
        // this.ctx.arc(this.x, this.y, this.scale, 0, Math.PI * 2);
        if (this.history.length > 1) {
            this.ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 0; i < this.history.length; i++) {
                this.ctx.lineTo(this.history[i].x, this.history[i].y);
            }
        }
        this.ctx.stroke();
        this.ctx.closePath();
        this.hue += this.colorChangeRate;
        // this.alpha -= 0.01;
    }
    reset() {
        this.x = Math.floor(Math.random() * this.field.width);
        this.y = Math.floor(Math.random() * this.field.height);
        this.history = [{ x: this.x, y: this.y }];
        this.historyTimer = this.maxHistoryLength;
        this.alpha = getRandomArbitrary(0.4, 1);
    }
    resize(width, height) {
        this.x = Math.floor(Math.random() * width);
        this.y = Math.floor(Math.random() * height);
    }
}

class Cell {
    constructor(field, x, y, size, angle) {
        this.field = field;
        this.ctx = this.field.ctx;
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = angle;
        this.hue = 0;
        this.saturation = getRandomArbitrary(90, 100);
        this.brightness = getRandomArbitrary(40, 60);
        this.alpha = 1;
    }
    draw(index) {
        const x = this.x * this.size;
        const y = this.y * this.size;
        const centerX = this.x * this.size + this.size * 0.5;
        const centerY = this.y * this.size + this.size * 0.5;
        const prevX =
            index - 1 >= 0 ? this.field.flowFieldArr[index - 1].x * this.size + this.size * 0.5 : 0;
        const prevY =
            index - 1 >= 0 ? this.field.flowFieldArr[index - 1].y * this.size + this.size * 0.5 : 0;
        const prevAngle = index - 1 >= 0 ? this.field.flowFieldArr[index - 1].angle : 0;
        const size = this.size * 0.4;
        this.ctx.fillStyle = `white`;
        this.ctx.strokeStyle = `hsla(${this.angle * 50 + 220}, ${this.saturation}%,${
            this.brightness
        }%,${this.alpha})`;
        this.ctx.beginPath();
        // this.ctx.rect(x, y, this.size, this.size);
        // this.ctx.fillText(
        //     Math.round(index),
        //     centerX + Math.cos(this.angle) * size - 6,
        //     centerY + Math.sin(this.angle) * size + 15
        // );
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.beginPath();
        index - 1 >= 0 && this.field.flowFieldArr[index - 1].y === this.y
            ? this.ctx.moveTo(
                  prevX + Math.cos(prevAngle) * size,
                  prevY + Math.sin(prevAngle) * size
              )
            : this.ctx.moveTo(
                  centerX + Math.cos(this.angle) * size,
                  centerY + Math.sin(this.angle) * size
              );
        this.ctx.lineTo(
            centerX + Math.cos(this.angle) * size,
            centerY + Math.sin(this.angle) * size
        );
        this.ctx.stroke();
        this.ctx.closePath();
        // this.ctx.beginPath();
        // this.ctx.arc(
        //     centerX + Math.cos(this.angle) * size,
        //     centerY + Math.sin(this.angle) * size,
        //     4,
        //     0,
        //     Math.PI * 2
        // );
        // this.ctx.fill();
        // this.ctx.closePath();
    }
    resize(size) {
        this.size = size;
    }
}

class FlowField {
    constructor(columns, rows = 0) {
        this.canvas;
        this.ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.initialColumns = columns;
        this.maxColumns = 100;
        this.columns =
            this.initialColumns < this.maxColumns ? this.initialColumns : this.maxColumns;
        this.cellSize = this.width / this.columns;
        this.rows = rows === 0 ? Math.ceil(window.innerHeight / this.cellSize) : rows;
        this.flowFieldArr = [];
        this.particleArr = [];
        this.particleCount = 400;
        this.curve = Math.PI * 1.5;
        this.zoom = 0.01;
        this.initCanvas();
        this.init();
    }
    initCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.classList = 'canvas-effect';
        canvas.id = 'canvas-effect';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = ctx;
    }
    init() {
        this.columns =
            this.initialColumns < this.maxColumns ? this.initialColumns : this.maxColumns;
        this.cellSize = this.width / this.columns;
        this.rows = Math.ceil(window.innerHeight / this.cellSize);

        // create flowFieldArr
        this.flowFieldArr = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                let angle = Math.cos(x * this.zoom) + Math.sin(y * this.zoom) + this.curve;
                this.flowFieldArr.push(new Cell(this, x, y, this.cellSize, angle));
            }
        }
        // create particleArr
        this.particleArr = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particleArr.push(new Particle(this, i));
        }
    }
    update() {
        this.particleArr.forEach((particle) => {
            particle.update();
        });
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // draw flow field
        // for (let i = 0; i < this.flowFieldArr.length; i++) {
        //     const cell = this.flowFieldArr[i];
        //     cell.draw(i);
        // }
        // draw particles
        for (let i = 0; i < this.particleArr.length; i++) {
            const particle = this.particleArr[i];
            particle.draw(i);
        }
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cellSize = this.width / this.columns;
        this.init();
        // for (let i = 0; i < this.flowFieldArr.length; i++) {
        //     const cell = this.flowFieldArr[i];
        //     cell.resize(this.cellSize);
        // }
    }
}

// EVENT LISTENERS
window.addEventListener('resize', () => {
    flowField.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});

// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// ANIMATION FUNCTION
function animate() {
    flowField.update();
    flowField.draw();
    // mouse.draw(ctx);
    requestAnimationFrame(animate);
}

const flowField = new FlowField(60);
const mouse = new Mouse(flowField);

animate();
