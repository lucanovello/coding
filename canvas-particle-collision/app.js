const body = document.body;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get random number between 2 numbers
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    static mult(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }
    static div(vector, scalar) {
        return new Vector(vector.x / scalar, vector.y / scalar);
    }
    static sub(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    getTangent() {
        return new Vector(-this.y, this.x);
    }
    mag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    static random(minX, maxX, minY, maxY) {
        return new Vector(getRandomBetween(minX, maxX), getRandomBetween(minY, maxY));
    }
}

class Mouse {
    constructor(canvas, context, x, y, radius) {
        this.canvas = canvas;
        this.context = context;
        this.x = x;
        this.y = y;
        this.normX = x / window.innerWidth;
        this.normY = y / window.innerHeight;
        this.radius = radius;
        // color & style
        this.hue = 0;
        this.saturation = 70;
        this.brightness = 60;
        this.alpha = 0.7;
        this.fillColor = `hsla(${this.hue},${this.saturation * 0.8}%,${this.brightness * 0.8}%,${
            this.alpha * 0.8
        })`;
        this.strokeColor = `hsla(${this.hue},${this.saturation}%,${this.brightness}%,${this.alpha})`;
    }
    update(x, y) {
        this.x = x;
        this.y = y;
        this.normX = this.x / window.innerWidth;
        this.normY = this.y / window.innerHeight;
    }
    draw() {
        this.context.fillStyle = this.fillColor;
        this.context.strokeStyle = this.strokeColor;
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.x = this.normX * window.innerWidth;
        this.y = this.normY * window.innerHeight;
    }
}

class Particle {
    constructor(ctx, x, y, velVector = Vector.random(-4, 4, -4, 4)) {
        this.ctx = ctx;
        this.initVel = velVector;
        this.pos = new Vector(x, y);
        this.prevPos = Vector.sub(this.pos, this.initVel);
        this.vel = this.initVel;
        this.acc = new Vector(0, 0);
        this.radius = getRandomBetween(10, 20);
        this.bounce = new Vector(1, 1);
        this.gravity = new Vector(0, 0);
        // Color & Style
        this.hue = getRandomBetween(0, 360);
        this.saturation = getRandomBetween(70, 90);
        this.brightness = getRandomBetween(45, 55);
        this.alpha = 0.8;
        this.lineWidth = 2;
        this.fillColor = `hsla(${this.hue + 5},${this.saturation}%,${this.brightness}%,${
            this.alpha * 0.6
        })`;
        this.strokeColor = `hsla(${this.hue},${this.saturation}%,${this.brightness}%,${this.alpha})`;
    }
    update() {
        this.pos = Vector.add(this.pos, this.vel);
        this.vel = Vector.add(this.vel, this.acc);
        this.vel = Vector.add(this.vel, this.gravity);
        // this.acc = Vector.add(this.acc, this.gravity);
    }
    draw() {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
    checkCollision(particle) {
        const v = Vector.sub(this.pos, particle.pos);
        const dist = v.mag();

        if (dist <= this.radius + particle.radius) {
            const unitNormal = Vector.div(v, v.mag());
            const unitTangent = unitNormal.getTangent();

            const correction = Vector.mult(unitNormal, this.radius + particle.radius);
            const newV = Vector.add(particle.pos, correction);
            this.pos = newV;

            const a = this.vel;
            const b = particle.vel;

            const a_n = a.dot(unitNormal);
            const b_n = b.dot(unitNormal);
            const a_t = a.dot(unitTangent);
            const b_t = b.dot(unitTangent);

            const a_n_final =
                (a_n * (this.radius - particle.radius) + 2 * particle.radius * b_n) /
                (this.radius + particle.radius);
            const b_n_final =
                (b_n * (particle.radius - this.radius) + 2 * this.radius * a_n) /
                (this.radius + particle.radius);

            const a_n_after = Vector.mult(unitNormal, a_n_final);
            const b_n_after = Vector.mult(unitNormal, b_n_final);
            const a_t_after = Vector.mult(unitTangent, a_t);
            const b_t_after = Vector.mult(unitTangent, b_t);

            const a_after = Vector.add(a_n_after, a_t_after);
            const b_after = Vector.add(b_n_after, b_t_after);

            this.vel = a_after;
            particle.vel = b_after;
        }
    }
    handleEdges(width, height) {
        if (this.pos.x - this.radius <= 0) {
            this.pos.x = this.radius + this.lineWidth;
            this.vel.x = -this.vel.x * this.bounce.x;
        }
        if (this.pos.x + this.radius >= width) {
            this.pos.x = width - this.radius - this.lineWidth;
            this.vel.x = -this.vel.x * this.bounce.x;
        }

        if (this.pos.y - this.radius <= 0) {
            this.pos.y = this.radius + this.lineWidth;
            this.vel.y = -this.vel.y * this.bounce.y;
        }
        if (this.pos.y + this.radius >= height) {
            this.pos.y = height - this.radius - this.lineWidth;
            this.vel.y = -this.vel.y * this.bounce.y;
        }
    }
}

class Canvas {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setup();

        requestAnimationFrame(() => this.update());
    }
    setup() {
        const NUM_PARTICLES = 50;
        this.particlesArr = [];

        for (let i = 0; i < NUM_PARTICLES; i++) {
            this.particlesArr.push(
                new Particle(
                    this.ctx,
                    getRandomBetween(0, this.canvas.width),
                    getRandomBetween(0, this.canvas.height)
                )
            );
        }
    }
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.particlesArr.length; i++) {
            const current = this.particlesArr[i];
            const rest = this.particlesArr.slice(i + 1);

            for (let n = 0; n < 16; n++) {
                for (let p of rest) {
                    p.checkCollision(current);
                }
            }
        }

        for (let particle of this.particlesArr) {
            particle.update();
            particle.handleEdges(this.canvas.width, this.canvas.height);
            particle.draw();
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = `white`;
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.stroke();
        this.ctx.closePath();

        requestAnimationFrame(() => this.update());
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}
const scene = new Canvas();

window.addEventListener('resize', scene.resize(window.innerWidth, window.innerHeight));
