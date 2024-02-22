const body = document.body;

class Mouse {
    constructor(canvas, context, x, y, radius) {
        this.canvas = canvas;
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.outerRadius = radius * 8;
        // color & style
        this.hue = 0;
        this.saturation = 80;
        this.brightness = 50;
        this.alpha = 1;
        this.cornerRadius = 5;
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
        // outer circle
        this.context.strokeStyle = `white`;
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.stroke();
        // inner circle
        this.context.fillStyle = `white`;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

class Player {
    constructor(x, y) {
        // canvases & contexts
        this.canvas;
        this.context;
        this.particleCanvas;
        this.particleContext;
        this.bulletCanvas;
        this.bulletContext;
        //movement, speed & size
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.velX = 0;
        this.velY = 0;
        this.angle = 0;
        this.up = 0;
        this.down = 0;
        this.left = 0;
        this.right = 0;
        this.directionX = 0;
        this.directionY = 0;
        // stats
        this.health = 10;
        this.damage = 1;
        this.speed = 0.4;
        this.decel = 0.05;
        // color & style
        this.hue = 45;
        this.saturation = 85;
        this.brightness = 50;
        this.cornerRadius = 5;
        // bullet variables
        this.bulletArr = [];
        this.bulletCounter = 0;
        this.bulletCounterLimit = 15;
        this.bulletX = this.x;
        this.bulletY = this.y;
        this.bulletRadius = this.radius * 0.5;
        this.isShooting = false;
        // particle variables
        this.particleArr = [];
        this.particlesPerFrame = 5;
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
        //initialize bullet canvas
        const bulletCanvas = document.createElement('canvas');
        const bulletctx = bulletCanvas.getContext('2d');
        bulletCanvas.width = window.innerWidth;
        bulletCanvas.height = window.innerHeight;
        bulletCanvas.id = 'canvas-bullets';
        document.body.appendChild(bulletCanvas);
        this.bulletCanvas = bulletCanvas;
        this.bulletContext = bulletctx;
        //initialize player canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = 'canvas-player';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.context = ctx;
    }
    update() {
        this.directionX = this.right - this.left;
        this.directionY = this.up - this.down;
        // this.angle += this.directionX * this.turnSpeed;
        this.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        this.velX += (this.directionX * this.speed) - (this.velX * this.decel);
        this.velY += -this.directionY * this.speed - this.velY * this.decel;
        this.x += this.velX;
        this.y += this.velY;
        this.bulletHandler(enemySpawner.enemyArr);
    }
    drawPlayer() {
        body.style.background = `radial-gradient(circle at ${this.x}px ${this.y}px, hsl(270, 13%, 12%), hsl(205, 15%, 1%))`;
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.fillStyle = `hsl(${this.hue},${this.saturation}%,${this.brightness}%)`;
        this.context.strokeStyle = `hsl(${this.hue},${this.saturation}%,${this.brightness * 0.1}%)`;
        this.context.lineWidth = 1;
        this.context.beginPath();
        //nose point
        this.context.moveTo(this.radius, 0);
        //bottom right point
        this.context.lineTo(-this.radius, this.radius);
        //bottom middle
        this.context.lineTo(-this.radius * 0.618, 0);
        //bottom left point
        this.context.lineTo(-this.radius, -this.radius);
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
        this.bulletArr.length != 0 && this.drawBullet();
        this.update();
        this.screenWrap();
    }
    createParticle() {
        for (let i = 0; i < this.particlesPerFrame; i++) {
            this.particleArr.push(
                new Particle(
                    this,
                    this.x,
                    this.y,
                    getRandomArbitrary(this.radius * 0.2, this.radius * 0.3),
                    getRandomArbitrary(this.radius * 0.15, this.radius * 0.2),
                    this.angle
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
    bulletHandler(enemyArr) {
        for (let i = 0; i < this.bulletArr.length; i++) {
            const bullet = this.bulletArr[i];
            if (
                bullet.x + bullet.radius < -bullet.radius ||
                bullet.x - bullet.radius > this.bulletCanvas.width + bullet.radius ||
                bullet.y + bullet.radius < -bullet.radius ||
                bullet.y - bullet.radius > this.bulletCanvas.height + bullet.radius
            ) {
                this.bulletArr.splice(bullet, 1);
            }
            for (let j = 0; j < enemyArr.length; j++) {
                const enemy = enemyArr[j];
                if (
                    bullet.x + bullet.radius >= enemy.x - enemy.radius &&
                    bullet.x - bullet.radius <= enemy.x + enemy.radius &&
                    bullet.y + bullet.radius >= enemy.y - enemy.radius &&
                    bullet.y - bullet.radius <= enemy.y + enemy.radius
                ) {
                    this.bulletArr.splice(bullet, 1);
                    enemy.takeDamage(this.damage);
                }
            }
            bullet.update();
        }
        if (this.isShooting) {
            if (this.bulletCounter >= this.bulletCounterLimit) {
                this.bulletCounter = 0;
            }
            if (this.bulletCounter === 0) {
                this.bulletArr.push(
                    new Bullet(
                        this,
                        this.bulletCanvas,
                        this.bulletContext,
                        this.x,
                        this.y,
                        this.bulletRadius,
                        this.angle,
                        1
                    )
                );
            }

            this.bulletCounter++;
        }
    }
    drawBullet() {
        this.bulletContext.clearRect(0, 0, this.bulletCanvas.width, this.bulletCanvas.height);

        for (let i = 0; i < this.bulletArr.length; i++) {
            const bullet = this.bulletArr[i];
            bullet.draw();
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
        this.bulletCanvas.width = width;
        this.bulletCanvas.height = height;
    }
}

class Bullet {
    constructor(player, canvas, context, x, y, radius, angle, damage) {
        this.player = player;
        this.canvas = canvas;
        this.context = context;
        this.damage = damage;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this.speed = 10;
        this.hue = 200;
        this.saturation = 100;
        this.brightness = 75;
        this.alpha = 1;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 1.01;
    }
    draw() {
        this.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        this.context.beginPath();
        this.context.arc(
            this.x + Math.cos(this.angle) * this.player.radius,
            this.y + Math.sin(this.angle) * this.player.radius,
            this.radius,
            0,
            Math.PI * 2
        );
        this.context.closePath();
        this.context.fill();
    }
}

class Particle {
    constructor(player, x, y, radius, accel, angle) {
        this.player = player;
        this.context = this.player.particleContext;
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.accel = accel;
        this.decel = this.accel * 3;
        this.jiggle = 1.2;
        this.radius = radius;
        this.hue = getRandomArbitrary(170, 240);
        this.saturation = getRandomArbitrary(90, 100);
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
                this.radius >= this.player.radius * 2 ? 0.5 : getRandomArbitrary(0.8, 0.99);
            this.saturation *= getRandomArbitrary(0.8, 0.99);
            this.brightness *= getRandomArbitrary(1.01, 1.05);
            this.accel *= getRandomArbitrary(0.97, 0.99);
        }
    }
    draw() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        this.context.beginPath();
        this.context.arc(-this.player.radius, 0, this.radius * 0.618, 0, Math.PI * 2);
        // this.context.rect(-this.radius * 3, -this.radius * 0.5, this.radius, this.radius);
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }
}

class EnemySpawner {
    constructor(player) {
        this.player = player;
        this.canvas;
        this.context;
        this.counter = 0;
        this.counterLimit = 100;
        this.enemyArr = [];
        this.enemyArrLimit = 40;
        this.enemyRadius = 10;
        this.initCanvas();
        this.create();
    }
    initCanvas() {
        const enemyCanvas = document.createElement('canvas');
        const enemyCtx = enemyCanvas.getContext('2d');
        enemyCanvas.width = window.innerWidth;
        enemyCanvas.height = window.innerHeight;
        enemyCanvas.id = 'canvas-enemy';
        document.body.appendChild(enemyCanvas);
        this.canvas = enemyCanvas;
        this.context = enemyCtx;
    }
    create() {
        // 0 = vertical || 1 = horizontal
        const axis = Math.random() <= 0.5 ? 0 : 1;
        // 0 = up/left side || 1 = down/right side
        const side = Math.random() < 0.5 ? 0 : 1;
        const x =
            axis === 0
                ? Math.random() * this.canvas.width
                : side === 0
                ? -this.enemyRadius * 3
                : this.canvas.width + this.enemyRadius * 3;
        const y =
            axis === 1
                ? Math.random() * this.canvas.height
                : side === 0
                ? -this.enemyRadius * 3
                : this.canvas.height + this.enemyRadius * 3;

        this.enemyArr.push(new Enemy(this.player, this, this.canvas, this.context, x, y, 3));
    }
    update() {
        if (this.counter >= this.counterLimit && this.enemyArr.length < this.enemyArrLimit) {
            this.create();
            this.counter = 0;
        }
        this.draw();
        this.counter++;
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.enemyArr.length; i++) {
            const enemy = this.enemyArr[i];
            enemy.draw();
            enemy.update();
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

class Enemy {
    constructor(player, spawner, canvas, context, x, y, health) {
        this.player = player;
        this.spawner = spawner;
        this.canvas = canvas;
        this.context = context;
        this.totalHealth = health;
        this.currentHealth = this.totalHealth;
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.radius = player.radius;
        this.angle = 0;
        this.speed = this.player.speed * 0.5;
        this.decel = this.speed * 0.4;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        // color and style
        this.hue = 0;
        this.saturation = 90;
        this.brightness = 50;
        this.alpha = 1;
        this.lineWidth = 2;
    }
    update() {
        this.dx = this.player.x - this.x;
        this.dy = this.player.y - this.y;
        this.angle = Math.atan2(this.dy, this.dx);
        this.velX += Math.cos(this.angle) * this.speed - this.velX * this.decel;
        this.velY += Math.sin(this.angle) * this.speed - this.velY * this.decel;
        this.x += this.velX;
        this.y += this.velY;
    }
    draw() {
        this.context.beginPath();
        this.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${
            this.alpha * 0.3
        })`;
        this.context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${
            this.brightness * 1.5
        }%, ${this.alpha})`;
        this.context.lineWidth = this.lineWidth;
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        this.context.fillText(this.currentHealth, this.x, this.y);
        this.context.closePath();
    }
    takeDamage(damage) {
        this.currentHealth -= damage;
        if (this.currentHealth <= 0) this.destroy();
    }
    destroy() {
        this.spawner.enemyArr.splice(this, 1);
    }
}

// EVENT LISTENERS
window.addEventListener('resize', () => {
    player.resize(window.innerWidth, window.innerHeight);
    mouse.resize(window.innerWidth, window.innerHeight);
    enemySpawner.resize(window.innerWidth, window.innerHeight);
});
// Mouse/Touch Events
window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    player.isShooting = true;
});
window.addEventListener('touchend', (e) => {
    e.preventDefault();
    player.isShooting = false;
});
window.addEventListener('mousedown', (e) => {
    // e.preventDefault();
    player.isShooting = true;
});
window.addEventListener('mouseup', (e) => {
    // e.preventDefault();
    player.isShooting = false;
});
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
// Key Events
window.addEventListener('keydown', (e) => {
    // e.preventDefault();
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
    e.preventDefault();
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

// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const player = new Player(window.innerWidth * 0.5, window.innerHeight * 0.5);
const enemySpawner = new EnemySpawner(player);
const mouse = new Mouse(
    player.bulletCanvas,
    player.bulletContext,
    window.innerWidth * 0.25,
    window.innerHeight * 0.25,
    1
);

// MAIN FUNCTION
function animate() {
    player.animate();
    mouse.draw();
    enemySpawner.update();
    requestAnimationFrame(animate);
}
animate();
