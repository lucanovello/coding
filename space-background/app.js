const body = document.getElementById('body');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 1920;
const canvasHeight = 1080;

const STEPS = 8;
const SPEED = 0.001;
const CLICK_SPEED = 3;
const COLOR = 0.5;
const SATURATION_STEP = 0.2;
const SATURATION = 70;
const MAX_SATURATION = 100;
const BOUNCINESS = 10000;

let particleSpeed = SPEED;
let particleColor = COLOR;
let particleSaturation = SATURATION;
const starCount = 100;
const minStarSize = 4;
const maxStarSize = 20;
let alphaAdjuster = 0.6;
let maxDirX = 4;
let maxDirY = 4;
const maxJiggle = 0.1;
const gravConstant = 2;
const initMouseMass = maxStarSize * 200;
const initPadding = maxStarSize * 5;
const zonePadding = 50;

let nameColorTimer = 0;

const starArr = [];

let mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  isMouseDown: false,
};

initCanvas();
//EVENT LISTENERS
window.addEventListener('resize', resizeHandler);
window.addEventListener('mousedown', mousedownHandler);
window.addEventListener('mouseup', mouseupHandler);

//APP ENGINE
const Engine = setInterval(() => app(), STEPS);

//MAIN APP
function app() {
  //clear screen
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (mouse.isMouseDown === true) {
    particleSpeed = SPEED * CLICK_SPEED;
    particleColor = COLOR * CLICK_SPEED;
    particleSaturation > MAX_SATURATION
      ? (particleSaturation = MAX_SATURATION)
      : (particleSaturation += SATURATION_STEP);
  } else {
    particleSpeed = SPEED;
    particleColor = COLOR;
    particleSaturation < SATURATION
      ? (particleSaturation = SATURATION)
      : (particleSaturation -= SATURATION_STEP);
  }

  //track mouse position
  window.onmousemove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  for (let i = 0; i < starArr.length; i++) {
    // if (mouse.isMouseDown === true) {
    applyForce(mouse, starArr[i]);

    // } else {
    //calculate paricle velocity during no force
    //   particleSpeed = SPEED;
    //   window.onmousemove = null;
    //   starArr[i].dirX += getRandomArbitrary(-maxJiggle, maxJiggle);
    //   starArr[i].dirY += getRandomArbitrary(-maxJiggle, maxJiggle);
    // }

    // move particle
    moveParticle(starArr[i]);
    //Set screen behaviour - Wrap or Bounce
    // screenBounce(starArr[i]);
    screenWrap(starArr[i]);

    //Draw to canvas
    drawParticle(starArr[i]);
  }
}

//INITIALIZATION
function initCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  initParticles();
}

// CALCULATING "GRAVITATIONAL" FORCE
function applyForce(player, object) {
  let radian;

  // Attraction For Screen Wrap
  // if (
  //   Math.abs(player.x - object.x + window.innerWidth) <
  //   Math.abs(player.x - object.x)
  // ) {
  //   radian = -radian;
  // }
  // if (
  //   Math.abs(player.x - object.x - window.innerWidth) <
  //   Math.abs(player.x - object.x)
  // ) {
  //   radian = -radian;
  // }
  // if (
  //   Math.abs(player.y - object.y + window.innerHeight) <
  //   Math.abs(player.y - object.y)
  // ) {
  //   radian = -radian;
  // }
  // if (
  //   Math.abs(player.y - object.y - window.innerHeight) <
  //   Math.abs(player.y - object.y)
  // ) {
  //   radian = -radian;
  // }
  // Check For Collision
  for (let i = 0; i < starArr.length; i++) {
    const object1 = starArr[i];

    if (
      object != object1 &&
      distBetweenPoints(object.x, object.y, object1.x, object1.y) <=
        object.size + object1.size
    ) {
      radian = Math.atan2(object.x - object1.x, object.y - object1.y);
      object.x += object1.size * Math.sin(radian);
      object.y += object1.size * Math.cos(radian);
      //  Apply Force
      object.dirX +=
        Math.sin(radian) *
        particleSpeed *
        BOUNCINESS *
        (object1.size / object.size);
      object.dirY +=
        Math.cos(radian) *
        particleSpeed *
        BOUNCINESS *
        (object1.size / object.size);
    } else {
      radian = Math.atan2(player.x - object.x, player.y - object.y);
    }
  }
  //  Apply Force
  object.dirX += Math.sin(radian) * particleSpeed;
  object.dirY += Math.cos(radian) * particleSpeed;
}

// CREATE PARTICLES
function initParticles() {
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
      h: getRandomArbitrary(160, 200),
      s: particleSaturation,
      l: 60,
      alpha: getRandomArbitrary(0.1, 1),
      isPulledIn: false,
      isPulledInRepeat: false,
    });
  }
}
1;

// CALCULATE PARTICLE SPEED
function moveParticle(particle) {
  //Set Particle Speed Limit
  if (particle.dirX < -maxDirX) particle.dirX = -maxDirX;
  if (particle.dirX > maxDirX) particle.dirX = maxDirX;
  if (particle.dirY < -maxDirY) particle.dirY = -maxDirY;
  if (particle.dirY > maxDirY) particle.dirY = maxDirY;

  //Set Particle Speed
  particle.x += particle.dirX;
  particle.y += particle.dirY;
}

// DRAW PARTICLES
function drawParticle(particle) {
  particle.h += particleColor;
  ctx.beginPath();
  ctx.fillStyle = `hsla(${particle.h},${particleSaturation}%,${particle.l}%,${
    particle.alpha * alphaAdjuster
  })`;
  //   ctx.strokeStyle = `hsla(${particle.h},${particle.s}%,${particle.l}%,${
  //     particle.alpha * alphaAdjuster
  //   })`;
  ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, false);
  ctx.fill();
  //   ctx.stroke();
  ctx.closePath();
}

// GET RANDOM NUMBER BETWEEN 2 VALUES
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//FIND DISTANCE BETWEEN 2 POINTS//
function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// SCREEN WRAP BEHAVIOUR
function screenWrap(item) {
  if (item.x > window.innerWidth) item.x = item.x - window.innerWidth;
  if (item.x < 0) item.x = item.x + window.innerWidth;
  if (item.y < 0) item.y = item.y + window.innerHeight;
  if (item.y > window.innerHeight) item.y = item.y - window.innerHeight;
}
function screenBounce(item) {
  if (item.x + item.size >= window.innerWidth) item.dirX = -item.dirX;
  if (item.x <= 0) item.dirX = -item.dirX;
  if (item.y <= 0) item.dirX = -item.dirX;
  if (item.y + item.size >= window.innerHeight) item.dirX = -item.dirX;
}

//HANDLERS METHODS
function resizeHandler() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  starArr.forEach((particle) => drawParticle(particle));
}
function mousedownHandler(e) {
  e.preventDefault();
  mouse.isMouseDown = true;
}
function mouseupHandler(e) {
  e.preventDefault();
  mouse.isMouseDown = false;
}
