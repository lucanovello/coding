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
    constructor(effect, index) {
        this.effect = effect;
        this.index = index;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.scale = 1;
        this.speed = 1;
        this.velX = 0;
        this.velY = 0;
        this.velModifier = getRandomArbitrary(1, 5);
        this.history = [{ x: this.x, y: this.y }];
        this.maxHistoryLengthInitial = getRandomArbitrary(10, 210);
        this.maxHistoryLength = this.maxHistoryLengthInitial;
        this.historyTimer = this.maxHistoryLength;
        this.angle = 0;
        this.hue = getRandomArbitrary(0, 10);
        this.saturation = getRandomArbitrary(70, 100);
        this.brightness = getRandomArbitrary(35, 90);
        this.alpha = getRandomArbitrary(0.4, 1);
        this.colorChangeRate = 0.1;
        this.lineWidth = 1;
    }
    draw(context) {
        context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        context.lineWidth = this.lineWidth;
        context.beginPath();
        context.fillRect(
            this.x - context.lineWidth * this.scale * 0.5,
            this.y - context.lineWidth * this.scale * 0.5,
            context.lineWidth * this.scale,
            context.lineWidth * this.scale
        );
        // context.arc(this.x, this.y, this.scale, 0, Math.PI * 2);
        if (this.history.length > 1) {
            context.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 0; i < this.history.length; i++) {
                context.lineTo(this.history[i].x, this.history[i].y);
            }
        }
        context.stroke();
        context.closePath();
        this.hue += this.colorChangeRate;
        // this.alpha -= 0.01;
    }
    update() {
        if (this.historyTimer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.columns + x;
            this.angle = this.effect.flowField[index];
            const dx = (mouse.x - this.x) / this.effect.width;
            const dy = (mouse.y - this.y) / this.effect.height;
            const distance = dx * dx + dy * dy;

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

    reset() {
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.history = [{ x: this.x, y: this.y }];
        this.historyTimer = this.maxHistoryLength * 2;
        this.alpha = 1;
    }
    resize(width, height) {
        this.x = Math.floor(Math.random() * width);
        this.y = Math.floor(Math.random() * height);
    }
}

class Effect {
    constructor(cellsize) {
        this.canvas;
        this.ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.flowField - [];
        this.cellSize = cellsize > 1 ? cellsize : 1;
        this.normCellSize = this.cellSize / Math.hypot(this.width, this.height);
        this.rows = Math.ceil(this.height / this.cellSize);
        this.columns = Math.ceil(this.width / this.cellSize);
        this.particleArr = [];
        this.particleCount = 600;
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
        this.flowField = [];
        this.cellSize = this.normCellSize * Math.hypot(this.width, this.height);
        this.rows = Math.ceil(this.height / this.cellSize);
        this.columns = Math.ceil(this.width / this.cellSize);

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                let angle = Math.cos(x * this.zoom) / Math.sin(y * this.zoom) + this.curve;
                this.flowField.push(angle);
            }
        }
        // create particles
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
        this.particleArr.forEach((particle) => {
            particle.draw(this.ctx);
        });
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cellSize = this.normCellSize * Math.hypot(width, height);
        this.particleArr.forEach((particle) => {
            particle.resize(this.width, this.height);
        });
    }
}

// EVENT LISTENERS
window.addEventListener('resize', () => {
    effect.resize(window.innerWidth, window.innerHeight);
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
    effect.draw();
    effect.update();
    // mouse.draw(ctx);
    requestAnimationFrame(animate);
}

const effect = new Effect(1);
const mouse = new Mouse(effect);
console.log(effect);

animate();
