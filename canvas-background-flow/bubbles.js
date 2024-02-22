const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Mouse {
    constructor(effect) {
        this.effect = effect;
        this.x = effect.width * 0.5;
        this.y = effect.height * 0.5;
        this.radius = effect.minCellCount;
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
        context.rect(
            this.x - this.radius * 0.5,
            this.y - this.radius * 0.5,
            this.radius,
            this.radius
        );
        // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // context.fill();
        context.stroke();
        context.closePath();
    }
}

class Particle {
    constructor(x, y, initRadius, effect) {
        this.effect = effect;
        this.x = x;
        this.y = y;
        this.initRadius = initRadius;
        this.radius = initRadius;
        this.radiusVel = 1;
        this.minRadius = initRadius * 0.01;
        this.maxRadius = initRadius * 1;
        this.radiusEase = this.effect.minCellCount * 0.45;
        this.minDistance = 0.1;
        this.normDistance = 1;
        this.screenDistance = Math.sqrt(
            this.effect.width * this.effect.width + this.effect.height * this.effect.height
        );
        this.hue = getRandomArbitrary(180, 220);
        this.hueChangeRate = getRandomArbitrary(0.1, 0.15);
        this.saturation = getRandomArbitrary(65, 75);
        this.brightness = getRandomArbitrary(55, 65);
        this.alpha = 1;
        this.minAlpha = 0.1;
        this.lineWidth = 1;
        this.shadow = this.maxRadius * 0.618;
    }
    draw(context) {
        // context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%,${this.alpha})`;
        context.lineWidth = this.lineWidth * this.normDistance + this.minAlpha;
        context.beginPath();
        context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%,${this.alpha})`;
        context.rect(
            this.x - this.radius * 0.5,
            this.y - this.radius * 0.5,
            this.radius,
            this.radius
        );
        // context.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        context.fill();
        // context.stroke();
        context.closePath();
        this.hue += this.hueChangeRate;
    }
    drawShadow(context) {
        // context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%,${this.alpha})`;
        context.lineWidth = this.lineWidth * this.normDistance + this.minAlpha;
        context.beginPath();
        context.fillStyle = `hsla(${this.hue}, ${this.saturation * 0.1}%, 15%,${this.alpha})`;
        context.rect(
            this.x - this.radius * 0.5 + this.shadow * (this.x / this.effect.width - 0.5),
            this.y - this.radius * 0.5 + this.shadow * (this.y / this.effect.height - 0.5),
            this.radius,
            this.radius
        );
        // context.arc(
        //     this.x + this.shadow * (this.x / this.effect.width - 0.5),
        //     this.y + this.shadow * (this.y / this.effect.height - 0.5),
        //     this.radius * 0.5,
        //     0,
        //     Math.PI * 2
        // );
        context.fill();
        context.closePath();

        this.hue += getRandomArbitrary(0.1, 0.15);
    }
    update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance =
            dx * dx + dy * dy > this.minDistance ? dx * dx + dy * dy : this.minDistance;
        this.normDistance = Math.sqrt(distance) / this.screenDistance;
        this.alpha = 1 - this.normDistance;
        this.radiusVel = this.normDistance * this.maxRadius * this.radiusEase;
        this.radius =
            this.maxRadius - this.radiusVel >= this.maxRadius
                ? this.maxRadius
                : this.maxRadius - this.radiusVel <= this.minRadius
                ? this.minRadius
                : this.maxRadius - this.radiusVel;
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particleArr = [];
        this.minCellCount = 15;
        this.cellSize =
            window.innerWidth > window.innerHeight
                ? window.innerWidth / this.minCellCount
                : window.innerHeight / this.minCellCount;
        this.rows = Math.ceil(this.height / this.cellSize);
        this.columns = Math.ceil(this.width / this.cellSize);
        this.grid - [];
        this.init();
    }

    init() {
        this.rows = Math.ceil(this.height / this.cellSize) + 1;
        this.columns = Math.ceil(this.width / this.cellSize) + 1;
        this.grid = [];

        for (let y = 0; y < this.rows; y++) {
            this.grid.push([]);
            for (let x = 0; x < this.columns; x++) {
                this.grid[y].push(
                    new Particle(x * this.cellSize, y * this.cellSize, this.cellSize, this)
                );
            }
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.init();
    }
    draw(context) {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const particle = this.grid[y][x];
                particle.drawShadow(context);
            }
        }
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const particle = this.grid[y][x];
                particle.draw(context);
                particle.update(mouse);
            }
        }
    }
}

// EVENT LISTENERS
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(effect.canvas.width, effect.canvas.height);
});

window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener('touchstart', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});

// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const effect = new Effect(canvas);
const mouse = new Mouse(effect);

// MAIN FUNCTION
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    // mouse.draw(ctx);
    requestAnimationFrame(animate);
}
animate();
