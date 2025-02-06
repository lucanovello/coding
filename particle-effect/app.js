const body = document.getElementById("body");
// Set up the canvas and context
const canvasScene = document.getElementById("canvas-scene");
const ctxScene = canvasScene.getContext("2d");

const canvasBall = document.getElementById("canvas-ball");
const ctxBall = canvasBall.getContext("2d");

// Set the canvas width and height to the width and height of the inner screen
ctxScene.canvas.width = window.innerWidth;
ctxScene.canvas.height = window.innerHeight;

// Set up the resize handler
window.addEventListener("resize", () => {
  // Change the canvas width and height to the new width and height of the inner screen
  ctxScene.canvas.width = window.innerWidth;
  ctxScene.canvas.height = window.innerHeight;
  // Draw a ball
  drawball(
    ball.normalizedX * window.innerWidth,
    ball.normalizedY * window.innerHeight,
    ball.size
  );
  drawStars(starArr);
});

window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      ball.up = 1;
      break;
    case "KeyA":
      ball.left = 1;
      break;
    case "KeyS":
      ball.down = 1;
      break;
    case "KeyD":
      ball.right = 1;
      break;
    case "Space":
      ball.state.isShooting = true;
      break;
    default:
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      ball.up = 0;
      break;
    case "KeyA":
      ball.left = 0;
      break;
    case "KeyS":
      ball.down = 0;
      break;
    case "KeyD":
      ball.right = 0;
      break;
    case "Space":
      ball.state.isShooting = false;
      break;
    default:
      break;
  }
});

// Mouse events
window.addEventListener("wheel", (e) => {
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

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
  ball.state.isShooting = true;
});
window.addEventListener("mouseup", (e) => {
  ball.state.isShooting = false;
});

//  Ball Constants
const ballSizeMin = 5;
const ballSizeMax = 50;
const ballSize = getRandomArbitrary(ballSizeMin, ballSizeMax);
const ballX = canvasScene.width / 2;
const ballY = canvasScene.height / 2;
const BALL_ACCELERATION = 0.5;
const BALL_DECELERATION = 0.05;

const mouse = {
  x: 0,
  y: 0,
  angle: 0,
};

//  Ball Object
const ball = {
  x: ballX,
  y: ballY,
  normalizedX: ballX / window.innerWidth,
  normalizedY: ballY / window.innerHeight,
  size: 30,
  gravityMultiplier: 50,
  velocity: { x: 0, y: 0 },
  acceleration: { x: BALL_ACCELERATION, y: BALL_ACCELERATION },
  deceleration: { x: BALL_DECELERATION, y: BALL_DECELERATION },
  bounce: 0.9,
  up: 0,
  left: 0,
  down: 0,
  right: 0,
  movementX: 0,
  movementY: 0,
  shootId: null,
  state: {
    isDown: false,
    isShooting: false,
  },
};
let gravity = { x: 1, y: 1 };

ctxBall.canvas.width = window.innerWidth;
ctxBall.canvas.height = window.innerHeight;

//  Scene Object
const scene = {
  wall: {
    width: window.innerWidth,
    height: window.innerHeight / 7,
  },
};

const laserArr = [];

const STAR_COUNT = 3500;
const starArr = [];
function createStars(num) {
  for (let i = 0; i < num; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const star = {
      x: x,
      y: y,
      xNormalized: x / window.innerWidth,
      yNormalized: y / window.innerHeight,
      radius: getRandomArbitrary(0.1, 1.3),
      h:
        Math.random() > 0.5
          ? getRandomArbitrary(190, 230)
          : getRandomArbitrary(350, 370),
      s: getRandomArbitrary(40, 80),
      l: getRandomArbitrary(70, 100),
      a: getRandomArbitrary(0.3, 0.8),
    };
    starArr.push(star);
  }
}
function drawStars(arr) {
  arr.forEach((star) => {
    ctxScene.fillStyle = `hsla(${star.h},${star.s}%,${star.l}%,${star.a})`;
    ctxScene.fillRect(
      star.xNormalized * window.innerWidth,
      star.yNormalized * window.innerHeight,
      star.radius,
      star.radius
    );
  });
}
//  SCREEN WRAP BEHAVIOUR
function screenWrap(item) {
  if (item.x < -item.size) item.x = window.innerWidth + item.size;
  if (item.x > window.innerWidth + item.size) item.x = -item.size;
  if (item.y < -item.size) item.y = window.innerHeight + item.size;
  if (item.y > window.innerHeight + item.size) item.y = -item.size;
}
function screenBounce(item) {
  if (item.x <= scene.wall.height + item.size + 1) {
    item.x = scene.wall.height + item.size + 1;
    item.velocity.x = -item.velocity.x * ball.bounce;
  }
  if (item.x + item.size >= window.innerWidth) {
    item.x = window.innerWidth - item.size;
    item.velocity.x = -item.velocity.x * ball.bounce;
  }
  if (item.y <= scene.wall.height + item.size) {
    item.y = scene.wall.height + item.size;
    item.velocity.y = -item.velocity.y * ball.bounce;
  }
  if (item.y + item.size >= window.innerHeight - scene.wall.height) {
    item.y = window.innerHeight - scene.wall.height - item.size;
    item.velocity.y = -item.velocity.y * ball.bounce;
  }
}
// Getting a random integer between two values
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
// Draw ball
function drawball(x, y, size) {
  ctxBall.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxBall.translate(x, y);
  ctxBall.rotate(
    Math.atan2(
      mouse.y - ball.normalizedY * window.innerHeight,
      mouse.x - ball.normalizedX * window.innerWidth
    )
  );
  ctxBall.translate(-x, -y);
  ctxBall.strokeStyle = "white";
  ctxBall.fillStyle = "hsl(200, 20%, 50%";
  ctxBall.lineWidth = 3;

  ctxBall.beginPath();
  ctxBall.rect(x - size / 2, y - size / 2, size, size);
  ctxBall.rect(x + 10, y - 4, 20, 8);
  ctxBall.closePath();
  ctxBall.stroke();
  ctxBall.fill();
  // Restore the context state
  ctxBall.setTransform(1, 0, 0, 1, 0, 0); // reset canvas transforms
}

function drawScene() {
  ctxScene.fillStyle = "hsl(215, 20%, 6%)";
  ctxScene.fillRect(0, 0, canvasScene.width, canvasScene.height);
  ctxScene.closePath();
}

function createLaser(arr) {
  arr.push({
    x:
      ball.x +
      Math.cos(
        Math.atan2(
          mouse.y - ball.normalizedY * window.innerHeight,
          mouse.x - ball.normalizedX * window.innerWidth
        )
      ) *
        ball.size,
    y:
      ball.y +
      Math.sin(
        Math.atan2(
          mouse.y - ball.normalizedY * window.innerHeight,
          mouse.x - ball.normalizedX * window.innerWidth
        )
      ) *
        ball.size,
    size: ball.size * 0.1,
    speed: 2,
    opacity: 1,
    smokeJiggle: { x: 1.5, y: 1.5 },
    angle: Math.atan2(
      mouse.y - ball.normalizedY * window.innerHeight,
      mouse.x - ball.normalizedX * window.innerWidth
    ),
  });
}

function drawLasers(arr) {
  arr.forEach((shot) => {
    ctxScene.fillStyle = `hsla(190, 10%, 80%, ${shot.opacity} )`;
    ctxScene.beginPath(); // Start a new path
    ctxScene.arc(shot.x, shot.y, shot.size, 0, 2 * Math.PI);
    ctxScene.fill(); // Fill the triangle with the fill color
    ctxScene.closePath(); // Close path
  });
}

function calcVelocity(ball) {
  ball.movementX = ball.right - ball.left;
  ball.movementY = ball.down - ball.up;
  // Update the ball velocity
  ball.velocity.x +=
    ball.movementX * ball.acceleration.x -
    ball.velocity.x * ball.deceleration.x;
  ball.velocity.y +=
    ball.movementY * ball.acceleration.y -
    ball.velocity.y * ball.deceleration.y;
}

function calcPosition(ball) {
  // Update the ball position
  ball.x += ball.velocity.x;
  ball.y += ball.velocity.y;
}
function calcNormPosition(ball) {
  // Update the ball position
  ball.normalizedX = ball.x / canvasScene.width;
  ball.normalizedY = ball.y / canvasScene.height;
}

// MAIN ANIMATION FUNCTION ------------------------------------------------------
function animate() {
  // Set the canvas background to sky blue
  mouse.angle = Math.atan2(
    mouse.y - ball.normalizedY * window.innerHeight,
    mouse.x - ball.normalizedX * window.innerWidth
  );

  for (let i = 0; i < laserArr.length; i++) {
    const shot = laserArr[i];
    if (shot.opacity <= 0.2 || shot.size < 0.001) {
      laserArr.splice(shot, 1);
    }
    shot.x +=
      Math.cos(shot.angle) * shot.speed +
      getRandomArbitrary(-shot.smokeJiggle.x, shot.smokeJiggle.x);
    shot.y +=
      Math.sin(shot.angle) * shot.speed +
      getRandomArbitrary(-shot.smokeJiggle.y, shot.smokeJiggle.y);
    shot.size *= shot.opacity;
    shot.opacity *= 0.99;
  }
  console.log(laserArr);
  // Calculate the velocity of the ball
  calcVelocity(ball);
  // Calculate the position of the ball
  calcPosition(ball);
  // Calculate the normalized position of the ball
  calcNormPosition(ball);
  screenWrap(ball);

  // Draw the scene
  drawScene();
  drawStars(starArr);

  // Draw ball
  drawball(
    ball.normalizedX * window.innerWidth,
    ball.normalizedY * window.innerHeight,
    ball.size
  );

  if (ball.state.isShooting) {
    body.style.cursor = "pointer";
  } else {
    body.style.cursor = "grab";
  }
  createLaser(laserArr);
  drawLasers(laserArr);

  // Call the animate function again on the next frame
  requestAnimationFrame(animate);
}

// Start the animation
// setInterval(createSpike, 1500);
createStars(STAR_COUNT);
drawStars(starArr);
animate();
