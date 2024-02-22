const body = document.getElementById('body');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 1920;
const canvasHeight = 1080;

const starCount = 500;
const minStarSize = 1;
const maxStarSize = 8;
const alphaAdjuster = 1;
const speed = 1;
let maxDirX = 3.5;
let maxDirY = 3.5;
const maxJiggle = 0.05;
const maxSizeChange = 0.2;
const gravConstant = 2;
const initMouseMass = maxStarSize * 200;
const initPadding = maxStarSize * 5;

const starArr = [];

const playerMaxSpeedX = 8;
const playerMaxSpeedY = 8;
const player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    acc: 0.1,
    dec: 0.06,
    velX: 0,
    velY: 0,
    maxVelX: (playerMaxSpeedX / (playerMaxSpeedX * 1.41421)) * playerMaxSpeedX,
    maxVelY: (playerMaxSpeedY / (playerMaxSpeedY * 1.41421)) * playerMaxSpeedY,
    size: 10,
};
let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};

let isMouseDown = false;
let isMoveUp = 0;
let isMoveDown = 0;
let isMoveLeft = 0;
let isMoveRight = 0;

let movementX = isMoveRight - isMoveLeft;
let movementY = isMoveDown - isMoveUp;

let newX = 0;
let newY = 0;
let magnitude = Math.sqrt(newX * newX + newY * newY);
let normX = newX / magnitude;
let normY = newY / magnitude;

const zonePadding = 50;

ctx.imageSmoothingEnabled = false;

//HANDLERS & METHODS
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function resizeHandler() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    app();
}
function mousedownHandler(e) {
    e.preventDefault();
    isMouseDown = true;
    for (let i = 0; i < starArr.length; i++) {
        mouse.x = e.x;
        mouse.y = e.y;
    }
    body.classList.add('grabbing');
    app();
}
function mouseupHandler(e) {
    e.preventDefault();
    isMouseDown = false;
    mouse.x = null;
    mouse.y = null;
    body.classList.remove('grabbing');
    app();
}
function keydownHandler(e) {
    e.preventDefault();
    switch (e.code) {
        case 'Space':
            isMouseDown = true;
            break;
        case 'KeyW' || 'ArrowUp':
            isMoveUp = player.acc;
            break;
        case 'KeyS' || 'ArrowDown':
            isMoveDown = player.acc;
            break;
        case 'KeyD' || 'ArrowRight':
            isMoveRight = player.acc;
            break;
        case 'KeyA' || 'ArrowLeft':
            isMoveLeft = player.acc;
            break;

        default:
            break;
    }
}
function keyupHandler(e) {
    e.preventDefault();
    switch (e.code) {
        case 'Space':
            isMouseDown = false;
            break;
        case 'KeyW' || 'ArrowUp':
            isMoveUp = 0;
            break;
        case 'KeyS' || 'ArrowDown':
            isMoveDown = 0;
            break;
        case 'KeyD' || 'ArrowRight':
            isMoveRight = 0;
            break;
        case 'KeyA' || 'ArrowLeft':
            isMoveLeft = 0;
            break;
        default:
            break;
    }
}

function screenWrap(item) {
    if (item.x > window.innerWidth) item.x = item.x - window.innerWidth;
    if (item.x < 0) item.x = item.x + window.innerWidth;
    if (item.y < 0) item.y = item.y + window.innerHeight;
    if (item.y > window.innerHeight) item.y = item.y - window.innerHeight;
}

function screenBounce(item) {
    if (item.x + item.size >= window.innerWidth) item.dirX *= -1;
    if (item.x <= 0) item.dirX *= -1;
    if (item.y <= 0) item.dirY *= -1;
    if (item.y + item.size >= window.innerHeight) item.dirY *= -1;
}

//INITIALIZATION FUNCTION
function initCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    for (let i = 0; i < starCount; i++) {
        const x = getRandomArbitrary(initPadding, window.innerWidth - initPadding);
        const y = getRandomArbitrary(initPadding, window.innerHeight - initPadding);
        const randomSize = getRandomArbitrary(minStarSize, maxStarSize);

        starArr.push({
            x: x,
            y: y,
            dirX: getRandomArbitrary(-maxDirX / 2, maxDirX / 2),
            dirY: getRandomArbitrary(-maxDirY / 2, maxDirY / 2),
            size: randomSize,
            h: getRandomArbitrary(0, 360),
            s: getRandomArbitrary(70, 100),
            l: getRandomArbitrary(40, 60),
            alpha:
                1.5 -
                (randomSize - minStarSize / (maxStarSize - minStarSize)) /
                    (maxStarSize - minStarSize),
            isPulledIn: false,
            isPulledInRepeat: false,
        });
    }
}

function playerController(player) {
    //calc player speed
    movementX = isMoveRight - isMoveLeft;
    movementY = isMoveDown - isMoveUp;

    player.velX += movementX * speed;
    player.velY += movementY * speed;

    if (player.velX < 0 && movementX === 0) {
        player.velX += player.dec;
    } else if (player.velX > 0 && movementX === 0) {
        player.velX += -player.dec;
    } else if (player.velX === 0 && movementX === 0) {
        player.velX = 0;
    }

    if (player.velY < 0 && movementY === 0) {
        player.velY += player.dec;
    } else if (player.velY > 0 && movementY === 0) {
        player.velY += -player.dec;
    } else if (player.velY === 0 && movementY === 0) {
        player.velY = 0;
    }

    // set player speed limits
    if (player.velX >= player.maxVelX) player.velX = player.maxVelX;
    if (player.velX <= -player.maxVelX) player.velX = -player.maxVelX;
    if (player.velY >= player.maxVelY) player.velY = player.maxVelY;
    if (player.velY <= -player.maxVelY) player.velY = -player.maxVelY;

    player.x += player.velX;
    player.y += player.velY;

    // player screen behaviour
    screenWrap(player);
    screenBounce(player);

    // draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, 2 * Math.PI, false);
    ctx.strokeStyle = `hsla(0,0%,100%,0.5)`;
    ctx.fillStyle = `hsla(0,0%,100%,0.3)`;
    ctx.strokeStyle = `rgba(255,255,255,0.8)`;
    ctx.fillStyle = `rgba(255,255,255,0.3)`;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    //draw player halo
    // ctx.beginPath();
    // ctx.arc(player.x, player.y, zonePadding * 1.2, 0, 2 * Math.PI, false);
    // ctx.strokeStyle = `hsla(0,0%,100%,0.3)`;
    // ctx.fillStyle = `hsla(0,0%,100%,0.1)`;
    // ctx.stroke();
    // ctx.fill();
    // ctx.closePath();
}

function force(player, object) {
    newX = player.x - object.x;
    newY = player.y - object.y;
    magnitude = Math.sqrt(newX * newX + newY * newY);
    if (magnitude < 100) magnitude = 200;
    normX = newX / magnitude;
    normY = newY / magnitude;

    // set closest direction for screen wrap
    if (Math.abs(player.x - object.x + window.innerWidth) < Math.abs(player.x - object.x))
        normX *= -1;
    if (Math.abs(player.x - object.x - window.innerWidth) < Math.abs(player.x - object.x))
        normX *= -1;
    if (Math.abs(player.y - object.y + window.innerHeight) < Math.abs(player.y - object.y))
        normY *= -1;
    if (Math.abs(player.y - object.y + window.innerHeight) < Math.abs(player.y - object.y))
        normY *= -1;

    object.dirX += (normX * gravConstant * (initMouseMass * object.size)) / (magnitude * magnitude);
    object.dirY += (normY * gravConstant * (initMouseMass * object.size)) / (magnitude * magnitude);
}

//MAIN FUNCTION
function app() {
    //clear screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // playerController(player);

    //track mouse position
    if (isMouseDown === true) {
        window.onmousemove = (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };
    }

    for (let i = 0; i < starArr.length; i++) {
        if (isMouseDown === true) {
            force(mouse, starArr[i]);
        } else {
            //calculate paricle velocity during no force
            window.onmousemove = null;
            starArr[i].dirX += getRandomArbitrary(-maxJiggle, maxJiggle);
            starArr[i].dirY += getRandomArbitrary(-maxJiggle, maxJiggle);
        }

        //set particle speed limit
        if (starArr[i].dirX < -maxDirX) starArr[i].dirX = -maxDirX;
        if (starArr[i].dirX > maxDirX) starArr[i].dirX = maxDirX;
        if (starArr[i].dirY < -maxDirY) starArr[i].dirY = -maxDirY;
        if (starArr[i].dirY > maxDirY) starArr[i].dirY = maxDirY;

        //set particle speed
        starArr[i].x += starArr[i].dirX;
        starArr[i].y += starArr[i].dirY;

        //Set screen behaviour - Wrap or Bounce
        screenWrap(starArr[i]);
        // screenBounce(starArr[i]);

        //Draw particle
        ctx.beginPath();
        // ctx.fillStyle = `hsla(${starArr[i].h},${starArr[i].s}%,${starArr[i].l}%,${
        //   starArr[i].alpha * alphaAdjuster
        // })`;
        ctx.strokeStyle = `hsla(${starArr[i].h},${starArr[i].s}%,${starArr[i].l}%,${
            starArr[i].alpha * alphaAdjuster
        })`;
        ctx.arc(starArr[i].x, starArr[i].y, starArr[i].size, 0, 2 * Math.PI, false);
        // ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if (
            Math.abs(player.x - starArr[i].x) < 10 &&
            Math.abs(player.y - starArr[i].y) < 10 &&
            starArr[i].isPulledInRepeat === false
        ) {
            starArr[i].isPulledIn = true;
            starArr[i].isPulledInRepeat = true;
            // mouseMass += starArr[i].size;
            // starArr.splice(i, 1);
        }
    }
}

//event listeners
window.addEventListener('resize', resizeHandler);
window.addEventListener('mousedown', mousedownHandler);
window.addEventListener('mouseup', mouseupHandler);
window.addEventListener('keydown', keydownHandler);
window.addEventListener('keyup', keyupHandler);

//call functions
initCanvas();

//app engine
const Engine = setInterval(() => app(), 1);
