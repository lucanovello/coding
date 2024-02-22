const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    drawStuff();
});

const STEPS = 1;
const PARTICLE_MIN_RADIUS = 50;
const PARTICLE_MAX_RADIUS = 150;

const PARTICLE_COUNT = 200;
const PADDING = 0;

const particleArr = [];

initParticles();
drawStuff();

setInterval(drawStuff, STEPS);

function createParticle(particle) {
    particleArr.push(particle);
}
function destroyParticle(particle) {
    particleArr.pop(particle);
}
function initParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = getRandomArbitrary(PADDING, window.innerWidth - PADDING);
        const y = getRandomArbitrary(PADDING, window.innerHeight - PADDING);
        const radius = getRandomArbitrary(PARTICLE_MIN_RADIUS, PARTICLE_MAX_RADIUS);

        const particle = {
            x: x,
            y: y,
            normalizedX: x / window.innerWidth,
            normalizedY: y / window.innerHeight,
            radius: radius,
            normalizedRadius: radius / PARTICLE_MAX_RADIUS,
            fill: {
                h: getRandomArbitrary(0, 80),
                s: getRandomArbitrary(40, 80),
                l: getRandomArbitrary(15, 35),
                a: getRandomArbitrary(0.5, 1),
            },
            velocity: {
                x: 0,
                y: 0,
            },
        };
        particleArr.push(particle);
    }
}

function drawStuff() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    particleArr.forEach((particle) => {
        particle.fill.h += getRandomArbitrary(0.01, 1);
        context.beginPath();
        context.fillStyle = `hsla(${particle.fill.h},${particle.fill.s}%,${particle.fill.l}%,${particle.fill.a}`;
        context.lineWidth = (particle.radius / PARTICLE_MAX_RADIUS) * 2;
        context.strokeStyle = `hsla(0,0%,100%, ${1})`;
        context.arc(
            context.canvas.width * particle.normalizedX,
            context.canvas.height * particle.normalizedY,
            PARTICLE_MAX_RADIUS * particle.normalizedRadius,
            0,
            Math.PI * 2
        );
        context.fill();
        context.closePath();
        screenBounce(particle);
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
//  SCREEN WRAP BEHAVIOUR
function screenWrap(item) {
    if (item.x > window.innerWidth) item.x = item.x - window.innerWidth;
    if (item.x < 0) item.x = item.x + window.innerWidth;
    if (item.y < 0) item.y = item.y + window.innerHeight;
    if (item.y > window.innerHeight) item.y = item.y - window.innerHeight;
}
function screenBounce(item) {
    if (item.x + item.radius >= window.innerWidth) {
        item.x = window.innerWidth - item.radius;
        item.velocity.x = -item.velocity.x * 0.9;
    }
    if (item.x <= 0) {
        item.x = item.radius;
        item.velocity.x = -item.velocity.x * 0.9;
    }
    if (item.y + item.radius >= window.innerHeight) {
        item.y = window.innerHeight - item.radius;
        item.velocity.y = -item.velocity.y * 0.8;
    }
    if (item.y <= 0) {
        item.y = item.radius;
        item.velocity.y = -item.velocity.y * 0.8;
    }
}
