const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');
canvas3.width = window.innerWidth;
canvas3.height = window.innerHeight;

const RAIN_COUNT = 200;

class Mouse {
    constructor() {
        this.context;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.x = this.width * 0.5;
        this.y = this.height * 0.5;
        this.radius = 10;
        this.arc = Math.PI * 2;
        this.normX = 0.5;
        this.normY = 0.5;
        this.init();
    }
    init() {
        const canvasMouse = document.createElement('canvas');
        canvasMouse.classList = 'canvas';
        document.body.appendChild(canvasMouse);
        canvasMouse.width = window.innerWidth;
        canvasMouse.height = window.innerHeight;
        this.context = canvasMouse.getContext('2d');
        this.width = canvasMouse.width;
        this.height = canvasMouse.height;
    }
    update(x, y) {
        this.x = x;
        this.y = y;
        this.normX = this.x / this.width;
        this.normY = this.y / this.height;
    }
    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = `white`;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, this.arc);
        this.context.fill();
        this.context.closePath();
    }
}

class Particle {
    constructor(effect, x, y, radiusX, radiusY) {
        this.effect = effect;
        this.x = x;
        this.y = y;
        this.normX = x / this.effect.width;
        this.normY = y / this.effect.height;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.normRadiusX =
            this.radiusX /
            Math.sqrt(
                this.effect.width * this.effect.width + this.effect.height * this.effect.height
            );
        this.normRadiusY =
            this.radiusY /
            Math.sqrt(
                this.effect.width * this.effect.width + this.effect.height * this.effect.height
            );
        this.velocityX = 0;
        this.velocityY = 0;
        this.hue = 210;
        this.saturation = 70;
        this.brightness = 55;
        this.alpha = 1;
        this.minAlpha = 0.1;
    }
    draw() {
        this.effect.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%,${this.alpha})`;
        // this.effect.context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%,${this.alpha})`;
        this.effect.context.beginPath();
        // this.effect.context.arc(x, y, radius, 0, Math.PI * 2);
        this.effect.context.rect(this.x, this.y, this.radiusX, this.radiusY);
        this.effect.context.fill();
        // this.effect.context.stroke();
        this.effect.context.closePath();
    }
    update(gravity) {
        // this.velocityX += this.effect.gravityX;
        // this.velocityY += this.effect.gravityY;
        // this.x += this.velocityX;
        this.y += gravity;
    }
}

class RainEffect {
    constructor(context, rainCount, gravityY = 1, gravityX = 0, radiusX = 1, radiusY = 1) {
        this.context = context;
        this.rainCount = rainCount;
        this.gravityX = gravityX;
        this.gravityY = gravityY;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.initWidth = this.context.canvas.width;
        this.initHeight = this.context.canvas.height;
        this.width = this.initWidth;
        this.height = this.initHeight;
        this.particleArr = [];
        this.padding = 500;
        this.init();
    }
    init() {
        for (let i = 0; i < this.rainCount; i++) {
            this.particleArr.push(
                new Particle(
                    this,
                    getRandomArbitrary(0, this.width),
                    getRandomArbitrary(0, this.height),
                    this.radiusX,
                    this.radiusY
                )
            );
        }
    }

    update() {
        for (let i = 0; i < this.particleArr.length; i++) {
            const particle = this.particleArr[i];
            if (particle.y > this.height) {
                this.particleArr.splice(i, 1);
                this.particleArr.push(
                    new Particle(
                        this,
                        getRandomArbitrary(-this.padding, this.width + this.padding),
                        getRandomArbitrary(-this.padding, -this.height),
                        this.radiusX,
                        this.radiusY
                    )
                );
            }
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.particleArr.length; i++) {
            const particle = this.particleArr[i];
            particle.draw(this.width, this.height);
            particle.update(this.gravityY);
        }
    }

    resize(width, height) {
        this.context.canvas.width = width;
        this.context.canvas.height = height;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
    }
}

// EVENT LISTENERS
window.addEventListener('resize', () => {
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    canvas3.width = window.innerWidth;
    canvas3.height = window.innerHeight;
    rainEffect1.resize(window.innerWidth, window.innerHeight);
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

const rainEffect1 = new RainEffect(
    ctx1,
    RAIN_COUNT,

    getRandomArbitrary(20, 25),
    getRandomArbitrary(0.008, 0.07),
    getRandomArbitrary(1.5, 2),
    getRandomArbitrary(1, 1.2) * 2
);
const rainEffect2 = new RainEffect(
    ctx2,
    RAIN_COUNT,

    getRandomArbitrary(25, 30),
    getRandomArbitrary(0.01, 0.07),
    getRandomArbitrary(2, 2.2),
    getRandomArbitrary(1, 1.2) * 5
);
const rainEffect3 = new RainEffect(
    ctx3,
    RAIN_COUNT,

    getRandomArbitrary(25, 35),
    getRandomArbitrary(0.03, 0.1),
    getRandomArbitrary(3, 3.5),
    getRandomArbitrary(1, 1.5) * 10
);
const mouse = new Mouse();

// MAIN FUNCTION
function animate() {
    rainEffect1.draw();
    rainEffect1.update();
    rainEffect2.draw();
    rainEffect2.update();
    rainEffect3.draw();
    rainEffect3.update();
    // mouse.draw();
    requestAnimationFrame(animate);
    console.log(
        rainEffect1.particleArr.length,
        rainEffect2.particleArr.length,
        rainEffect3.particleArr.length
    );
}

animate();
console.log(rainEffect1.particleArr);
