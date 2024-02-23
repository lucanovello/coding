const body = document.body;
const nameText = document.getElementById("name")
const options = document.getElementById('options');
const accInput = document.getElementById('acc-input');
const turnSpeedInput = document.getElementById('turnspeed-input');
const accLabel = document.getElementById('acc-label');
const turnSpeedLabel = document.getElementById('turnspeed-label');

let nameTextHue = Math.random() * 360;

class Player {
    constructor(x, y) {
        // canvases & contexts
        this.canvas;
        this.context;
        this.particleCanvas;
        this.particleContext;
        //movement, speed & size
        this.x = x;
        this.y = y;
        this.radius = 9;
        this.velX = 0;
        this.velY = 0;
        this.angle = 0;
        this.up = 0;
        this.down = 0;
        this.left = 0;
        this.right = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.particleArr = [];
        this.particlesPerFrame = 7;
        // stats
        this.maxScreenWidth = 2880;
        this.health = 10;
        this.damage = 1;
        this.accDefaultValue = 0.4 + window.innerWidth / this.maxScreenWidth;
        this.turnSpeedDefaultValue = 0.5 + window.innerWidth / this.maxScreenWidth;
        this.decel = 0.1;
        // color & style
        this.hue = nameTextHue + 35
        this.saturation = 90;
        this.brightness = 50;
        this.cornerRadius = 5;
        // initialize canvases
        this.initCanvases();
    }
    initCanvases() {
        //initialize particle canvas
        const particleCanvas = document.createElement('canvas');
        const particlectx = particleCanvas.getContext('2d');
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        particleCanvas.id = 'canvas-particles';
        document.body.appendChild(particleCanvas);
        this.particleCanvas = particleCanvas;
        this.particleContext = particlectx;
        //initialize player canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = 'canvas-player';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.context = ctx;

        // Initialize Screen Options
        accInput.value = this.accDefaultValue;
        turnSpeedInput.value = this.turnSpeedDefaultValue;
    }
    update() {
        const newAcc = accInput.value;
        const newturnSpeed = turnSpeedInput.value * 0.1;
        if (mouse.isMobileControl === true) {
            mouse.touchDiffX < -mouse.touchDeadzoneX || mouse.touchDiffX > mouse.touchDeadzoneX
                ? (this.directionX = (mouse.touchDiffX / this.canvas.width) * 5)
                : (this.directionX = 0);

            mouse.touchDiffY < -mouse.touchDeadzoneY || mouse.touchDiffY > mouse.touchDeadzoneY
                ? (this.directionY = -mouse.touchDiffY / (this.canvas.height * 0.1))
                : (this.directionY = 0);

            this.directionX > 1 && (this.directionX = 1);
            this.directionX < -1 && (this.directionX = -1);
            this.directionY > 1 && (this.directionY = 1);
            this.directionY < -1 && (this.directionY = -1);
        } else {
            this.directionX = this.right - this.left;
            this.directionY = this.up - this.down;
        }
        this.angle += this.directionX * newturnSpeed;
        this.velX += Math.cos(this.angle) * this.directionY * newAcc - this.velX * this.decel;
        this.velY += Math.sin(this.angle) * this.directionY * newAcc - this.velY * this.decel;
        this.x += this.velX;
        this.y += this.velY;
    }
    drawPlayer() {
        const finalHue = nameTextHue + 35
        body.style.background = `radial-gradient(circle at ${this.x}px ${this.y}px, hsl(${nameTextHue-45}, 10%, 5%), hsl(205, 5%, 0%) 40%)`;
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.fillStyle = `hsl(${finalHue},${this.saturation}%,${this.brightness}%)`;
        this.context.strokeStyle = `hsl(${finalHue},${this.saturation}%,${this.brightness * 0.7}%)`;
        this.context.lineWidth = 0.5;
        this.context.beginPath();
        //nose point
        this.context.moveTo(this.radius, 0);
        //bottom right point
        this.context.lineTo(-this.radius, this.radius * 0.9);
        //bottom middle
        this.context.lineTo(-this.radius * 0.618, 0);
        //bottom left point
        this.context.lineTo(-this.radius, -this.radius * 0.9);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
        this.context.restore();
    }
    animate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particleContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.createParticle();
        this.drawParticles();
        this.drawPlayer();
        this.update();
        this.screenWrap();
    }
    createParticle() {
        const particlesPerFrameAdjust = window.innerWidth / 1920;
        
        for (
            let i = 0;
            i <
            this.particlesPerFrame +
                Math.floor(Math.abs(this.velX) + Math.abs(this.velY)) * particlesPerFrameAdjust;
            i++
        ) {
            this.particleArr.push(
                new Particle(
                    this,
                    this.x,
                    this.y,
                    getRandomArbitrary(this.radius * 0.2, this.radius * 0.45),
                    getRandomArbitrary(this.radius * 0.15, this.radius * 0.2),
                    this.angle,
                    this.velX,
                    this.velY
                )
            );
        }
    }
    drawParticles() {
        for (let i = 0; i < this.particleArr.length; i++) {
            const particle = this.particleArr[i];
            particle.draw();
            particle.update();
        }
    }
    screenWrap() {
        if (this.x + this.radius < 0) this.x = this.canvas.width + this.radius;
        if (this.x > this.canvas.width + this.radius) this.x = -this.radius;
        if (this.y + this.radius < 0) this.y = this.canvas.height + this.radius;
        if (this.y > this.canvas.height + this.radius) this.y = -this.radius;
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.particleCanvas.width = width;
        this.particleCanvas.height = height;
        this.x = width * 0.5;
        this.y = height * 0.5;
    }
}
class Particle {
    constructor(player, x, y, radius, accel, angle, velX, velY) {
        this.player = player;
        this.context = this.player.particleContext;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.normVel = this.velX * this.velX + this.velY * this.velY;
        this.accel = accel;
        this.decel = this.accel * 3;
        this.jiggle = 1.5;
        this.minThrottle = 0.1;
        this.radius = radius;
        this.hueAdjust = getRandomArbitrary(-20, 20);
        this.saturation = getRandomArbitrary(90, 100) ;
        this.brightness = getRandomArbitrary(40, 55);
        this.alpha = 1;
        this.angle = angle;
        this.angleAdjust = Math.PI;
    }
    update() {
        if (this.alpha <= 0.001 || this.radius < 0.001) {
            this.player.particleArr.splice(this, 1);
        } else {
            this.x +=
                Math.cos(this.angle + this.angleAdjust) * this.accel +
                getRandomArbitrary(-this.jiggle, this.jiggle);
            this.y +=
                Math.sin(this.angle + this.angleAdjust) * this.accel +
                getRandomArbitrary(-this.jiggle, this.jiggle);
            this.radius *=
                this.radius >= this.player.radius * 2 ? 1 : getRandomArbitrary(1.015, 1.025);
            this.alpha *=
                this.radius >= this.player.radius * 1.5
                    ? getRandomArbitrary(0.001, 0.99)
                    : getRandomArbitrary(0.8, 0.99);
            this.saturation *= getRandomArbitrary(0.8, 0.99);
            // this.brightness *= getRandomArbitrary(1.01, 1.05);
            this.accel *= getRandomArbitrary(0.97, 0.99);
        }
    }
    draw() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.fillStyle = `hsla(${nameTextHue + this.hueAdjust}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        this.context.beginPath();
        this.context.arc(-this.player.radius, 0, this.radius * 0.618, 0, Math.PI * 2);
        // this.context.rect(-this.radius * 3, -this.radius * 0.5, this.radius, this.radius);
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
}
class Star {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.normalizedX = (Math.random() * this.canvas.width) / this.canvas.width;
        this.normalizedY = (Math.random() * this.canvas.height) / this.canvas.height;
        this.radius = Math.random() > 0.5 ? getRandomArbitrary(0.4, 0.6) : getRandomArbitrary(0.3, 1.1);
        this.isShining = (Math.random() > 0.9) || (this.radius > 0.8) ? true : false
        this.hue = Math.random() > 0.6 ? getRandomArbitrary(0, 30) : getRandomArbitrary(190, 220)
        this.saturation = this.isShining ? getRandomArbitrary(30, 70) : getRandomArbitrary(10, 40)
        this.brightness = getRandomArbitrary(60, 90)
        this.alpha = getRandomArbitrary(0.4, 0.95)
        this.counter = Math.random() * 10
        this.counterIncrement = Math.random() * 0.05
}
draw() {
    const osc = (Math.sin(this.counter) * 0.7 )
    this.context.fillStyle = `hsla(${this.hue}, ${this.saturation + osc * 50}%, ${this.brightness}%, ${this.isShining ? 1 + osc: this.alpha})`;
    this.context.beginPath();
    this.context.rect(this.normalizedX * this.canvas.width, this.normalizedY * this.canvas.height, this.radius, this.radius);
    this.context.fill();
    this.context.closePath();
    this.counter += this.counterIncrement
}
resize(canvas) {
    this.canvas = canvas
}
}
class Stars {
    constructor() {
        this.canvas;
        this.context;
        this.starArr = []
        this.starCount;
        this.initCanvas();
        this.createStars();
}
initCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = 'canvas-stars';
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = ctx;
}
createStars() { 
    this.starArr = []
    this.starCount = this.canvas.width * 1.5
    for ( let i = 0; i < this.starCount; i++) {
        this.starArr.push(
            new Star(
                this.canvas,
                this.context
            )
        );
    }
    this.drawStars()
}
drawStars() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.starArr.length; i++) {
        const star = this.starArr[i];
        star.draw();
    }
}
resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.createStars();
}
}
class Mouse {
    constructor(x, y, radius) {
        this.canvas;
        this.context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.touchstartX;
        this.touchstartY;
        this.touchDiffX = 0;
        this.touchDiffY = 0;
        this.touchDeadzoneX = 30;
        this.touchDeadzoneY = 20;
        this.isMobileControl = false;
        // color & style
        this.hue = 0;
        this.saturation = 80;
        this.brightness = 50;
        this.alpha = 1;
        this.cornerRadius = 5;
        this.shouldDraw = true;
        this.initCanvas();
    }
    initCanvas() {
        const mouseCanvas = document.createElement('canvas');
        const mouseCtx = mouseCanvas.getContext('2d');
        mouseCanvas.width = window.innerWidth;
        mouseCanvas.height = window.innerHeight;
        mouseCanvas.id = 'canvas-mouse';
        document.body.appendChild(mouseCanvas);
        this.canvas = mouseCanvas;
        this.context = mouseCtx;
    }
    update(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // current position
        if (this.shouldDraw) {
            this.context.fillStyle = `hsla(180,0%,0%,0.5)`;
            this.context.strokeStyle = `hsla(180,0%,100%,0.5)`;
            this.context.lineWidth = 1.5;
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.context.stroke();
            this.context.fill();
            this.context.closePath();
        }
        // start position
        if (this.touchstartX != this.x || this.touchstartY != this.y) {
            this.context.fillStyle = `hsla(180,0%,100%,0.05)`;
            this.context.strokeStyle = `hsla(180,0%,100%,0.1)`;
            this.context.lineWidth = 1.5;
            this.context.beginPath();
            this.context.arc(this.touchstartX, this.touchstartY, this.radius * 1.1, 0, Math.PI * 2);
            this.context.stroke();
            this.context.fill();
            this.context.closePath();

            this.context.beginPath();
            this.context.moveTo(this.touchstartX, this.touchstartY);
            this.context.lineTo(this.x, this.y);
            this.context.stroke();
            this.context.closePath();
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}
// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
// Update Name Text Color
function nameColorHandler() {
    nameText.style.color = `hsl(${nameTextHue}, 100%, 50%)`
    nameTextHue += 0.05
}
// EVENT LISTENERS
window.addEventListener('resize', () => {
    player.resize(window.innerWidth, window.innerHeight);
    mouse.resize(window.innerWidth, window.innerHeight);
    stars.resize(window.innerWidth, window.innerHeight);
});
// Mouse Events
window.addEventListener('mousemove', (e) => {
    mouse.shouldDraw = true;
    if (e.target.dataset.group != 'options') {
        mouse.touchDiffX = e.clientX - mouse.touchstartX;
        mouse.touchDiffY = e.clientY - mouse.touchstartY;
        mouse.update(e.clientX, e.clientY);
    }
});
window.addEventListener('mousedown', (e) => {
    mouse.shouldDraw = true;
    if (e.target.dataset.group != 'options') {
    e.preventDefault();
    mouse.isMobileControl = window.innerWidth < 600 ? true : false;
        mouse.touchstartX = e.clientX;
        mouse.touchstartY = e.clientY;
        mouse.update(e.clientX, e.clientY);
    }
});
window.addEventListener('mouseup', (e) => {
    mouse.shouldDraw = true;
    e.preventDefault();
    mouse.isMobileControl = false;
    mouse.touchstartX = undefined;
    mouse.touchstartY = undefined;
    if (e.target.dataset.group != 'options') {
        mouse.touchDiffX = 0;
        mouse.touchDiffY = 0;
        mouse.update(e.clientX, e.clientY);
    }
});
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
// Touch Events
window.addEventListener('touchmove', (e) => {
    mouse.shouldDraw = true;
    mouse.isMobileControl = true;
    if (e.target.dataset.group != 'options') {
        mouse.touchDiffX = e.changedTouches[0].clientX - mouse.touchstartX;
        mouse.touchDiffY = e.changedTouches[0].clientY - mouse.touchstartY;
        mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
});
window.addEventListener('touchstart', (e) => {
    mouse.shouldDraw = true;
    mouse.isMobileControl = true;
    if (e.target.dataset.group != 'options') {
        mouse.touchstartX = e.changedTouches[0].clientX;
        mouse.touchstartY = e.changedTouches[0].clientY;
        mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
});
window.addEventListener('touchend', (e) => {
    mouse.shouldDraw = false;
    mouse.isMobileControl = false;
    mouse.touchstartX = undefined;
    mouse.touchstartY = undefined;
    if (e.target.dataset.group != 'options') {
        mouse.touchDiffX = 0;
        mouse.touchDiffY = 0;
        mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
});
// Key Events
window.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftLeft') player.acc = 1.618;
    if (e.code === 'Space') player.isShooting = true;
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            player.up = 1;
            break;
        case 'KeyS':
        case 'ArrowDown':
            player.down = 1;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            player.left = 1;
            break;
        case 'KeyD':
        case 'ArrowRight':
            player.right = 1;
            break;
        default:
            break;
    }
});
window.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft') player.acc = 1;
    if (e.code === 'Space') player.isShooting = false;
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            player.up = 0;
            break;
        case 'KeyS':
        case 'ArrowDown':
            player.down = 0;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            player.left = 0;
            break;
        case 'KeyD':
        case 'ArrowRight':
            player.right = 0;
            break;
        default:
            break;
    }
});
// Options Events
accInput.addEventListener('wheel', (e) => {
    if (e.wheelDeltaY > 0) accInput.value = (parseFloat(accInput.value) + 0.1).toFixed(1);
    if (e.wheelDeltaY < 0) accInput.value = (parseFloat(accInput.value) - 0.1).toFixed(1);
});
turnSpeedInput.addEventListener('wheel', (e) => {
    if (e.wheelDeltaY > 0)
        turnSpeedInput.value = (parseFloat(turnSpeedInput.value) + 0.01).toFixed(2);
    if (e.wheelDeltaY < 0)
        turnSpeedInput.value = (parseFloat(turnSpeedInput.value) - 0.01).toFixed(2);
});
// Instantiate objects
const stars = new Stars()
const player = new Player(window.innerWidth * 0.5, window.innerHeight * 0.5);
const mouse = new Mouse(
    0,
    0,
    10
);
// MAIN FUNCTION
function animate() {
    stars.drawStars()
    player.animate();
    // mouse.draw();
    accLabel.innerText = `Acceleration: ${accInput.value}`;
    turnSpeedLabel.innerText = `TurnSpeed: ${turnSpeedInput.value}`;
    nameColorHandler();
    requestAnimationFrame(animate);
}
animate();