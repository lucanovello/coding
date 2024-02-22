const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const MOUSE_COUNT = 20;
const BASE_RADIUS = 5;
const SPEED = 1;
const TERMINAL_VEL = 0.1;
const TAIL_LENGTH = 1;
const ACCELERATION = 1;

const mouse = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
};

const mouseArr = [];

//Window Handlers
function onResizeHandler() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}
//Mouse Handlers
function onMousemoveHandler(e) {
    mouse.x = e.x;
    mouse.y = e.y;
}
function onTouchmoveHandler(e) {
    e.preventDefault();
    mouse.x = e.touches[0].screenX;
    mouse.y = e.touches[0].screenY;
}

// EVENT LISTENERS
window.addEventListener('resize', onResizeHandler);
window.addEventListener('mousemove', onMousemoveHandler);
window.addEventListener('touchmove', onTouchmoveHandler);
window.addEventListener('touchdown', onTouchmoveHandler);
window.addEventListener('touchup', onTouchmoveHandler);

function initMouse(elementArray) {
    for (let i = MOUSE_COUNT; i > 0; i--) {
        // for (let i = 0; i < MOUSE_COUNT; i++) {
        elementArray.push({
            x: mouse.x,
            y: mouse.y,
            radius: BASE_RADIUS * (i * 0.25),
            color: `hsla(${i * (40 / MOUSE_COUNT) + 0}, 100%, 50%, 0.7)`,
            // color: `white`,
            prevPosition: {
                x: mouse.x,
                y: mouse.y,
            },
            velocity: {
                x: 0,
                y: 0,
            },
            // terminalVelocity: TERMINAL_VEL + (MOUSE_COUNT - i) * TAIL_LENGTH,
            terminalVelocity: TERMINAL_VEL,
            offset: Math.random() + 5,
        });
    }
}
initMouse(mouseArr);

function calcMouseVel(mouseArray, leadElement) {
    for (let i = mouseArray.length; i > 0; i--) {
        // for (let i = 0; i < mouseArray.length; i++) {
        const mouseElement = mouseArray[i - 1];
        const distance = mouseArray[i - 2]
            ? {
                  x: mouseArray[i - 2].x - mouseElement.x,
                  y: mouseArray[i - 2].y - mouseElement.y,
              }
            : {
                  x: leadElement.x - mouseElement.x,
                  y: leadElement.y - mouseElement.y,
              };
        // const direction = {
        //     x: Math.sign(distance.x),
        //     y: Math.sign(distance.y),
        // };
        const magnitude = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
        const direction = {
            x: magnitude != 0 ? distance.x / magnitude : 0,
            y: magnitude != 0 ? distance.y / magnitude : 0,
        };

        // mouseElement.velocity.x += ACCELERATION * direction.x;
        // mouseElement.velocity.y += ACCELERATION * direction.y;
        mouseElement.velocity.x +=
            ACCELERATION * direction.x - mouseElement.velocity.x * mouseElement.terminalVelocity;
        mouseElement.velocity.y +=
            ACCELERATION * direction.y - mouseElement.velocity.y * mouseElement.terminalVelocity;
        mouseElement.x += mouseElement.velocity.x * SPEED;
        mouseElement.y += mouseElement.velocity.y * SPEED;
    }
}

// Draw Mouse
function drawMouse(mouseArray) {
    for (let i = 0; i < mouseArray.length; i++) {
        const mouseElement = mouseArray[i];
        ctx.beginPath();
        ctx.fillStyle = mouseElement.color;
        ctx.arc(mouseElement.x, mouseElement.y, mouseElement.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    // mouse collision
    // if (mouseElement.x - mouseElement.radius <= 0) {
    //     mouseElement.x = mouseElement.radius;
    //     mouseElement.velocity.x = -mouseElement.velocity.x * mouseElement.bounce;
    // }
    // if (mouseElement.x + mouseElement.radius >= ctx.canvas.width) {
    //     mouseElement.x = ctx.canvas.width - mouseElement.radius;
    //     mouseElement.velocity.x = -mouseElement.velocity.x * mouseElement.bounce;
    // }
    // if (mouseElement.y + mouseElement.radius <= 0) {
    //     mouseElement.y = mouseElement.radius;
    //     mouseElement.velocity.y = -mouseElement.velocity.y * mouseElement.bounce;
    // }
    // if (mouseElement.y + mouseElement.radius >= ground.y) {
    //     mouseElement.y = ground.y - mouseElement.radius;
    //     mouseElement.velocity.y = -mouseElement.velocity.y * mouseElement.bounce;
    //     mouseElement.friction = mouseElement.groundFriction;
    // }
    // }
}

console.log(mouseArr);

//MAIN FUNCTION
function drawApp() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    calcMouseVel(mouseArr, mouse);
    drawMouse(mouseArr);

    // recall function
    window.requestAnimationFrame(drawApp);
}
drawApp();
