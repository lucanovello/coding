// Set up the canvas and context
const canvas = document.getElementById('canvas ');
const ctx = canvas.getContext('2d');

// Set the canvas width and height to the width and height of the inner screen
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// Set up the resize handler
window.addEventListener('resize', () => {
    // Change the canvas width and height to the new width and height of the inner screen
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    // Draw a ball
    drawball(
        ball.normalizedX * window.innerWidth,
        ball.normalizedY * window.innerHeight,
        ball.size
    );
});

window.addEventListener('wheel', (e) => {
    console.log(e);
    e.shiftKey
        ? (ball.velocity.x += Math.sign(e.deltaY) * -20)
        : (ball.velocity.y += Math.sign(e.deltaY) * 20);

    // Draw a ball
    drawball(
        ball.normalizedX * window.innerWidth,
        ball.normalizedY * window.innerHeight,
        ball.size
    );
});

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
            ball.up = 1;
            break;
        case 'KeyA':
            ball.left = 1;
            break;
        case 'KeyS':
            ball.down = 1;
            break;
        case 'KeyD':
            ball.right = 1;
            break;
        default:
            break;
    }
});
window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW':
            ball.up = 0;
            break;
        case 'KeyA':
            ball.left = 0;
            break;
        case 'KeyS':
            ball.down = 0;
            break;
        case 'KeyD':
            ball.right = 0;
            break;
        default:
            break;
    }
});

//  Ball Constants
const ballSizeMin = 5;
const ballSizeMax = 50;
const ballSize = getRandomArbitrary(ballSizeMin, ballSizeMax);
const ballX = canvas.width / 2;
const ballY = getRandomArbitrary(ballSize, canvas.height - ballSize);

//  Ball Object
const ball = {
    x: ballX,
    y: ballY,
    normalizedX: ballX / window.innerWidth,
    normalizedY: ballY / window.innerHeight,
    size: ballSize,
    gravityMultiplier: 100,
    velocity: {
        x: 0,
        y: 0,
    },
    acceleration: {
        x: 20,
        y: 20,
    },
    deceleration: 0.2,
    bounce: 0.7,
    up: 0,
    left: 0,
    down: 0,
    right: 0,
    movementX: 0,
    movementY: 0,
    state: {
        isDown: false,
    },
};

let gravity = {
    x:
        (ball.normalizedX * window.innerWidth - window.innerWidth / 2) /
        (window.innerWidth - window.innerWidth / 2),

    y:
        (ball.normalizedY * window.innerHeight - window.innerHeight / 2) /
        (window.innerHeight - window.innerHeight / 2),
};

//  SCREEN WRAP BEHAVIOUR
function screenWrap(item) {
    if (item.x < -item.size) item.x = window.innerWidth + item.size;
    if (item.x > window.innerWidth + item.size) item.x = -item.size;
    if (item.y < -item.size) item.y = window.innerHeight + item.size;
    if (item.y > window.innerHeight + item.size) item.y = -item.size;
}
function screenBounce(item) {
    if (item.x + item.size >= window.innerWidth) {
        item.x = window.innerWidth - item.size;
        item.velocity.x = -item.velocity.x * ball.bounce;
    }
    if (item.x <= item.size) {
        item.x = item.size;
        item.velocity.x = -item.velocity.x * ball.bounce;
    }
    if (item.y + item.size >= window.innerHeight) {
        item.y = window.innerHeight - item.size;
        item.velocity.y = -item.velocity.y * ball.bounce;
    }
    if (item.y <= item.size) {
        item.y = item.size;
        item.velocity.y = -item.velocity.y * ball.bounce;
    }
}

// Getting a random integer between two values
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
// Calculate the distance between two points
function distanceBetween(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Draw ball
function drawball(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, false);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function calcGravity(ball) {
    gravity.x =
        (ball.normalizedX * window.innerWidth - window.innerWidth / 2) /
        (window.innerWidth - window.innerWidth / 2);
    gravity.y =
        (ball.normalizedY * window.innerHeight - window.innerHeight / 2) /
        (window.innerHeight - window.innerHeight / 2);
}

function calcVelocity(ball) {
    ball.movementX = ball.right - ball.left;
    ball.movementY = ball.down - ball.up;
    // Update the ball velocity
    ball.velocity.x +=
        ball.movementX * ball.acceleration.x -
        ball.velocity.x * ball.deceleration -
        gravity.x * ball.gravityMultiplier;
    ball.velocity.y +=
        ball.movementY * ball.acceleration.y -
        ball.velocity.y * ball.deceleration -
        gravity.y * ball.gravityMultiplier;
}

function calcPosition(ball) {
    // Update the ball position
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
}
function calcNormPosition(ball) {
    // Update the ball position
    ball.normalizedX = ball.x / canvas.width;
    ball.normalizedY = ball.y / canvas.height;
}

function animate() {
    // Set the canvas background to sky blue
    ctx.fillStyle = 'hsl(215, 60%, 6%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate the gravity of the ball
    calcGravity(ball);
    // Calculate the velocity of the ball
    calcVelocity(ball);
    // Calculate the position of the ball
    calcPosition(ball);
    // Calculate the normalized position of the ball
    calcNormPosition(ball);

    // Draw a ball
    drawball(
        ball.normalizedX * window.innerWidth,
        ball.normalizedY * window.innerHeight,
        ball.size
    );

    // Let the ball wrap around the edges of the screen
    screenBounce(ball);

    // Call the animate function again on the next frame
    requestAnimationFrame(animate);
}

// Start the animation
animate();
