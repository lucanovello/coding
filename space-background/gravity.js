const body = document.getElementById('body');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 1920;
const canvasHeight = 1080;

const starCount = 2;
const minStarSize = 2;
const maxStarSize = 10;
const acc = 0.1;
let maxVelX = 1;
let maxVelY = 1;
const gravConstant = 0.5;
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const earth = {
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  velX: getRandomArbitrary(-maxVelX, maxVelX),
  velY: getRandomArbitrary(-maxVelY, maxVelY),
  size: 20,
  h: 130,
  s: 70,
  l: 40,
};
const moon = {
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  velX: getRandomArbitrary(-maxVelX, maxVelX),
  velY: getRandomArbitrary(-maxVelY, maxVelY),
  size: 4,
  h: 200,
  s: 5,
  l: 40,
};

const starArr = [earth, moon];

//Methods and handlers
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeHandler() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  app();
}

//Init function
function initCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  for (let i = 0; i < starArr.length; i++) {
    ctx.beginPath();
    ctx.arc(starArr[i].x, starArr[i].y, starArr[i].size, 0, 2 * Math.PI, false);
    ctx.fillStyle = `hsl(${starArr[i].h},${starArr[i].s}%,${starArr[i].l}%`;
    ctx.fill();
    ctx.closePath();
  }
}

function app() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < starArr.length; i++) {
    starArr[i].velX =
      (gravConstant * starArr[1].size) /
      ((starArr[i].x - starArr[1].x) * (starArr[i].x - starArr[1].x));
    starArr[i].velY =
      (gravConstant * starArr[1].size) /
      ((starArr[i].y - starArr[1].y) * (starArr[i].y - starArr[1].y));

    starArr[i].x = starArr[i].velX;
    starArr[i].y = starArr[i].velY;

    if (starArr[i].x > window.innerWidth)
      starArr[i].x = starArr[i].x - window.innerWidth;
    if (starArr[i].x < 0) starArr[i].x = starArr[i].x + window.innerWidth;
    if (starArr[i].y < 0) starArr[i].y = starArr[i].y + window.innerHeight;
    if (starArr[i].y > window.innerHeight)
      starArr[i].y = starArr[i].y - window.innerHeight;

    ctx.beginPath();
    ctx.arc(starArr[i].x, starArr[i].y, starArr[i].size, 0, 2 * Math.PI, false);
    ctx.fillStyle = `hsl(${starArr[i].h},${starArr[i].s}%,${starArr[i].l}%`;
    ctx.fill();
    ctx.closePath();
  }
}

window.addEventListener('resize', resizeHandler);

initCanvas();

//app engine
const Engine = setInterval(() => app(), 10);
