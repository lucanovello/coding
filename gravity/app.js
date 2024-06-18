const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const MAX_MASS = 10000;
const SPEED = 0.0005;
const GRAVITY = 0.2;
const BODY_COUNT = 5;
const WALL_BOUNCE = 0.7;
const DISTANCE_SCALE = 0.1;
const MIN_DISTANCE = 200;
const BASE_MASS = getRandomArbitrary(2, 4);

const sun = {
    position: {
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 2,
    },
    radius: 50,
    mass: 1000,
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'gold',
};

const bodyArr = [];

function initBodies(array, count) {
    for (let i = 0; i < count; i++) {
        array.push({
            position: {
                x:
                    ctx.canvas.width *
                    getRandomArbitrary(
                        BASE_MASS / ctx.canvas.width,
                        (ctx.canvas.width - BASE_MASS) / ctx.canvas.width
                    ),
                y:
                    ctx.canvas.height *
                    getRandomArbitrary(
                        BASE_MASS / ctx.canvas.height,
                        (ctx.canvas.height - BASE_MASS) / ctx.canvas.height
                    ),
            },
            radius: BASE_MASS * 5,
            mass: BASE_MASS * 100,
            velocity: {
                x: getRandomArbitrary(-1.5, 1.5) * 10,
                y: getRandomArbitrary(-1.5, 1.5) * 10,
            },
            // velocity: {
            //     x: 0,
            //     y: 0,
            // },
            color: `hsl(${Math.random() * 359}, 80%, 45%)`,
        });
    }
}
initBodies(bodyArr, BODY_COUNT);

// Getting a random number between two values
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Window Handlers
function onResizeHandler() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

// EVENT LISTENERS
window.addEventListener('resize', onResizeHandler);

// CALCULATE BALL PHYSIC
function calculateBallPhysics(objArr) {
    for (let i = 0; i < objArr.length; i++) {
        const currentBody = objArr[i];
        const acceleration = { x: 0, y: 0 };
        for (let j = 0; j < objArr.length; j++) {
            if (i != j) {
                const otherBody = objArr[j];

                // Calculate distance of each axis
                const distance =
                    Math.sqrt(
                        Math.pow(otherBody.position.x - currentBody.position.x, 2) +
                            Math.pow(otherBody.position.y - currentBody.position.y, 2)
                    ) > MIN_DISTANCE
                        ? Math.sqrt(
                              Math.pow(otherBody.position.x - currentBody.position.x, 2) +
                                  Math.pow(otherBody.position.y - currentBody.position.y, 2)
                          )
                        : MIN_DISTANCE;

                const direction = {
                    x: Math.sign(otherBody.position.x - currentBody.position.x),
                    y: Math.sign(otherBody.position.y - currentBody.position.y),
                };

                const accNormalize = Math.pow(
                    (GRAVITY * otherBody.mass) / Math.pow(MIN_DISTANCE * DISTANCE_SCALE, 2),
                    objArr.length
                );
                acceleration.x +=
                    ((GRAVITY * otherBody.mass) /
                        Math.pow(distance * DISTANCE_SCALE, 2) /
                        accNormalize) *
                    direction.x;

                acceleration.y +=
                    ((GRAVITY * otherBody.mass) /
                        Math.pow(distance * DISTANCE_SCALE, 2) /
                        accNormalize) *
                    direction.y;
            }

            currentBody.velocity.x += acceleration.x * SPEED;
            currentBody.velocity.y += acceleration.y * SPEED;
            currentBody.position.x += currentBody.velocity.x * SPEED;
            currentBody.position.y += currentBody.velocity.y * SPEED;
        }
        checkCollision(currentBody);
    }
}

// Check Collision
function checkCollision(body) {
    if (body.position.x - body.radius <= 0) {
        body.position.x = body.radius;
        body.velocity.x = -body.velocity.x * WALL_BOUNCE;
    }
    if (body.position.x + body.radius >= ctx.canvas.width) {
        body.position.x = ctx.canvas.width - body.radius;
        body.velocity.x = -body.velocity.x * WALL_BOUNCE;
    }
    if (body.position.y - body.radius <= 0) {
        body.position.y = body.radius;
        body.velocity.y = -body.velocity.y * WALL_BOUNCE;
    }
    if (body.position.y + body.radius >= ctx.canvas.height) {
        body.position.y = ctx.canvas.height - body.radius;
        body.velocity.y = -body.velocity.y * WALL_BOUNCE;
    }
}

function drawBody(bodyArray) {
    for (let i = 0; i < bodyArray.length; i++) {
        const body = bodyArray[i];
        ctx.beginPath();
        ctx.fillStyle = body.color;
        // ctx.strokeStyle = body.color;
        ctx.arc(body.position.x, body.position.y, body.radius, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.stroke();
        ctx.closePath();
    }
}

//MAIN FUNCTION
function drawApp() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw Bodys
    drawBody(bodyArr);
    calculateBallPhysics(bodyArr);
    // recall function
    window.requestAnimationFrame(drawApp);
}
drawApp();
