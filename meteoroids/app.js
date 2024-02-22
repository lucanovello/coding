const FPS = 240;
const TITLE = 'ASTEROIDS';
const POINT = 0.1;
let scoreCount = 0;
let highScoreCount = 0;
let isGameStart = false;

const TITLE_FONT = 'fantasy';
const TITLE_FONT_SIZE = '146';
const TITLE_FONT_WEIGHT = '900';
const TITLE_FONT_STYLE = 'small-caps';

const PLAYER_HEALTH = 100;
const PLAYER_SPEED = 0.04;
const MAX_SPEED = 3;
const ROTATION_SPEED = 1.5;
const FRICTION = 0.02;
const THRUST_LIFETIME = 100;
const MAX_THRUSTER = 2;
const PLAYER_EXPLOSION_TIME = 0.6;
const PLAYER_EXPLOSION_RADIUS = 10;
const PLAYER_INV_TIME = 1.1;
const PLAYER_BLINK_TIME = 0.1;

const PLAYER_SIZE = 20;
const PLAYER_FILL = 'black';
const PLAYER_STROKE = 'white';
const LINEWIDTH = PLAYER_SIZE / 20;

const LASER_MAX = 250;
const LASER_SPEED = 1200;
const LASER_DISTANCE = 0.9;
const PLAYER_SHOT_DELAY = 40;

let ASTEROID_COUNT = 20;
const ASTEROID_SPEED = 1.5;
const ASTEROID_SIZE = 100;
const ASTEROID_JAGGED = 0.3;
const ASTEROID_VERTICES = 12;
const ASTEROID_DAMAGE = 15;

const STAR_COUNT = 300;
const STAR_SIZE = 5;

let AUTO_RUN = false;
let AUTO_SHOOT = false;
let AUTO_ROTATE = false;
let SHOW_COLLISION = false;
let WRAP_LASERS = false;

let playerSpeed = PLAYER_SPEED;
let maxSpeed = MAX_SPEED;
let rotationSpeed = ROTATION_SPEED;

let mouse = {
  x: 0,
  y: 0,
};

const showCollision = document.getElementById('show-collision');
const autoRun = document.getElementById('auto-run');
const autoRotate = document.getElementById('auto-rotate');
const autoShoot = document.getElementById('auto-shoot');
const wrapLasers = document.getElementById('wrap-lasers');
const scoreText = document.getElementById('score');
const highScoreText = document.getElementById('high-score');
const highScoreSpanText = document.getElementById('high-score-span');
const resetScore = document.getElementById('reset-score');
const devTools = document.getElementById('dev-tools');
const buttons = document.getElementById('buttons');
const startScreen = document.getElementById('start-screen');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//PLAYER OBJECT//
let player = newPlayer();

//ASTEROID OBJECTS//
let asteroids = [];
createAsteroids();

// CREATE BACKGROUND STARS//
let stars = [];
createStars(ctx.canvas.width, ctx.canvas.height);

//EVENT HANDLERS//
window.addEventListener('resize', resizeCanvasHandler);
window.addEventListener('keydown', keydownHandler);
window.addEventListener('keyup', keyUpHandler);
window.addEventListener('mousemove', mousemoveHandler);
//BUTTON HANDLERS
autoRun.addEventListener('click', () => (AUTO_RUN = !AUTO_RUN));
autoRotate.addEventListener('click', () => (AUTO_ROTATE = !AUTO_ROTATE));
autoShoot.addEventListener('click', () => (AUTO_SHOOT = !AUTO_SHOOT));
wrapLasers.addEventListener('click', () => (WRAP_LASERS = !WRAP_LASERS));
devTools.addEventListener('click', () => {
  buttons.classList.toggle('disappear');
});
resetScore.addEventListener('click', () => {
  highScoreCount = 0;
  localStorage.setItem('highScoreCount', `0`);
});
showCollision.addEventListener(
  'click',
  () => (SHOW_COLLISION = !SHOW_COLLISION)
);

//GAME ENGINE//
const engine = setInterval(mainApp, 1000 / FPS);

//MAIN APP//
function mainApp() {
  //get highscore from local storage
  if (localStorage.getItem('highScoreCount') > highScoreCount) {
    highScoreCount = localStorage.getItem('highScoreCount');
  } else {
    localStorage.setItem('highScoreCount', `${highScoreCount}`);
  }

  //check if score is higher than highscore
  scoreCount > highScoreCount && (highScoreCount = scoreCount);

  //draw scoreboard
  scoreText.innerText = `Score: ${Math.round(scoreCount * 10)}`;
  highScoreText.innerText = `High Score: ${
    localStorage.getItem('highScoreCount')
      ? `${Math.round(parseFloat(localStorage.getItem('highScoreCount')) * 10)}`
      : 0
  }`;

  highScoreSpanText.innerText =
    highScoreCount === scoreCount && highScoreCount != 0 ? 'New Record!' : '';

  playerInputs();
  wrapScreen(player);
}

//PLAYER MOVEMENT INPUT HANDLING//
function playerInputs() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let blinkStart = player.blinkNum % 2 === 0;
  let explosion = player.explosionTime > 0;

  if (isGameStart) {
    startScreen.classList.add('disappear');

    drawStars();
    drawAsteroids();
    drawLasers();

    if (!explosion) {
      if (blinkStart) {
        drawThrusters();
        drawPlayer();
      }

      // handle blinking
      if (player.blinkNum > 0 && player.isInv) {
        // reduce the blink time
        player.blinkTime--;

        // reduce the blink num
        if (player.blinkTime <= 0) {
          player.blinkTime = Math.ceil(PLAYER_BLINK_TIME * FPS);
          player.blinkNum--;
        }

        if (player.blinkNum <= 0) {
          player.isInv = false;
        }
      }
    } else {
      drawExplosion(10);
    }

    if (!explosion) {
      if (!player.isInv) {
        // check for collisions //
        for (let i = 0; i < asteroids.length; i++) {
          if (
            distBetweenPoints(
              player.x,
              player.y,
              asteroids[i].x,
              asteroids[i].y
            ) <
            player.radius * 0.9 + asteroids[i].radius
          ) {
            player.health -= ASTEROID_DAMAGE;
            player.blinkTime = Math.ceil(PLAYER_BLINK_TIME * FPS);
            player.blinkNum = Math.ceil(PLAYER_INV_TIME / PLAYER_BLINK_TIME);
            player.isInv = true;
            //   killPlayer();
          }
        }
      }

      if (player.health <= 0) {
        killPlayer();
      }

      //calculate direction//
      player.direction.x = player.thrust.x - player.reverse.x;
      player.direction.y = player.reverse.y - player.thrust.y;

      //calculate speed x//
      if (player.speed.x >= maxSpeed) {
        player.speed.x = maxSpeed - FRICTION * player.speed.x;
      } else if (player.speed.x <= -maxSpeed) {
        player.speed.x = -maxSpeed - FRICTION * player.speed.x;
      } else {
        player.speed.x +=
          playerSpeed * Math.cos(player.angle) * player.direction.x -
          FRICTION * player.speed.x;
      }
      //calculate speed y//
      if (player.speed.y >= maxSpeed) {
        player.speed.y = maxSpeed - FRICTION * player.speed.y;
      } else if (player.speed.y <= -maxSpeed) {
        player.speed.y = -maxSpeed - FRICTION * player.speed.y;
      } else {
        player.speed.y +=
          playerSpeed * Math.sin(player.angle) * player.direction.y -
          FRICTION * player.speed.y;
      }

      //reduce speed when reversing//
      if (player.direction.x < 0) {
        maxSpeed = MAX_SPEED / 1.5;
        rotationSpeed = ROTATION_SPEED;
      } else {
        maxSpeed = MAX_SPEED;
        rotationSpeed = ROTATION_SPEED;
      }

      //move player
      if (AUTO_RUN) {
        //move player automatically//
        player.angle += player.rotation * 0.8;
        player.x += 40 * playerSpeed * Math.cos(player.angle);
        player.y -= 40 * playerSpeed * Math.sin(player.angle);
      } else {
        //move player with inputs//
        player.angle += player.rotation;
        player.x += player.speed.x;
        player.y += player.speed.y;
      }
    } else {
      player.explosionTime--;
      if (player.explosionTime === 0) {
        player = newPlayer();
      }
    }
  } else {
    drawStars();
    drawAsteroids();
  }
}

// function drawStartScreen(text = TITLE) {
//   ctx.fillStyle = 'white';
//   ctx.font = `${TITLE_FONT_STYLE} ${TITLE_FONT_WEIGHT} ${TITLE_FONT_SIZE}px ${TITLE_FONT}`;
//   ctx.textAlign = 'center';
//   ctx.fillText(text, window.innerWidth / 2, window.innerHeight / 2 - 100);
// }

function newPlayer() {
  scoreCount = 0;
  return {
    health: 100,
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: PLAYER_SIZE / 2,
    angle: (20 / 180) * Math.PI,
    rotation: 0,
    direction: { x: 0, y: 0 },
    thrust: { x: 0, y: 0 },
    reverse: { x: 0, y: 0 },
    speed: { x: 0, y: 0 },
    explosionTime: 0,
    blinkNum: Math.ceil(PLAYER_INV_TIME / PLAYER_BLINK_TIME),
    blinkTime: Math.ceil(PLAYER_BLINK_TIME * FPS),
    isInv: true,
    rotateDir: 0,
    isDashing: false,
    isShooting: false,
    shotDelay: 0,
    lasers: [],
  };
}

//DRAW PLAYER//
function drawPlayer() {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = LINEWIDTH;
  // Front of player//
  ctx.beginPath();
  ctx.moveTo(
    // nose of the player//
    player.x + (4 / 3) * player.radius * Math.cos(player.angle),
    player.y - (4 / 3) * player.radius * Math.sin(player.angle)
  );

  ctx.lineTo(
    // rear left//
    player.x -
      player.radius *
        ((2 / 3) * Math.cos(player.angle) + Math.sin(player.angle)),
    player.y +
      player.radius *
        ((2 / 3) * Math.sin(player.angle) - Math.cos(player.angle))
  );

  ctx.lineTo(
    // rear right//
    player.x -
      player.radius *
        ((2 / 3) * Math.cos(player.angle) - Math.sin(player.angle)),
    player.y +
      player.radius *
        ((2 / 3) * Math.sin(player.angle) + Math.cos(player.angle))
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  //draw health bar outline
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeRect(
    player.x - player.radius * 2,
    player.y + 20,
    player.radius * 4,
    7
  );
  ctx.stroke();

  //draw health bar
  ctx.fillStyle = `hsl(${(player.health / PLAYER_HEALTH) * 120}, 100%, 50% )`;
  ctx.beginPath();
  ctx.fillRect(
    player.x - player.radius * 2,
    player.y + 20,
    player.radius * 4 * (player.health / PLAYER_HEALTH),
    7
  );
  ctx.fill();

  //collision bounding box//
  if (SHOW_COLLISION) {
    ctx.strokeStyle = 'magenta';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius * 0.9, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  AUTO_ROTATE
    ? (player.rotation = (rotationSpeed / 180) * Math.PI)
    : (player.rotation = ((rotationSpeed * player.rotateDir) / 180) * Math.PI);

  if (!AUTO_SHOOT) {
    if (player.isShooting && player.shotDelay <= 0) {
      shootLaser();
      player.shotDelay = PLAYER_SHOT_DELAY;
    } else {
      player.shotDelay -= 1;
    }
  } else {
    if (player.shotDelay <= 0) {
      shootLaser();
      player.shotDelay = PLAYER_SHOT_DELAY;
    } else {
      player.shotDelay -= 1;
    }
  }

  //detect collision between laser and asteroids
  let astX, astY, astR, lasX, lasY, lasR;
  //asteroid values
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    astX = asteroid.x;
    astY = asteroid.y;
    astR = asteroid.radius;
    //laser values
    for (let j = player.lasers.length - 1; j >= 0; j--) {
      const laser = player.lasers[j];
      lasX = laser.x;
      lasY = laser.y;
      lasR = laser.radius;

      //remove laser and asteroid
      if (distBetweenPoints(astX, astY, lasX, lasY) <= astR) {
        scoreCount += POINT;
        player.lasers.splice(j, 1);
        asteroids.splice(i, 1);
        asteroids.push(
          newAsteroid(
            player.x +
              (Math.random() > 0.5
                ? getRandomArbitrary(-600, -100)
                : getRandomArbitrary(100, 600)),
            player.y +
              (Math.random() > 0.5
                ? getRandomArbitrary(-600, -100)
                : getRandomArbitrary(100, 600))
          )
        );
      }
    }
  }
}

//DRAW LASERS
function drawLasers() {
  //move the lasers
  for (let i = player.lasers.length - 1; i >= 0; i--) {
    const laser = player.lasers[i];

    if (laser.distance > LASER_DISTANCE * window.innerWidth) {
      player.lasers.splice(i, 1);
      continue;
    }

    laser.x += laser.velX;
    laser.y += -laser.velY;

    //calc distance laser has travelled
    laser.distance += Math.sqrt(
      Math.pow(laser.velX, 2) + Math.pow(laser.velY, 2)
    );

    WRAP_LASERS && wrapScreen(laser);
  }
  // draw lasers
  for (let i = 0; i < player.lasers.length; i++) {
    const laser = player.lasers[i];
    ctx.fillStyle = 'lime';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(laser.x, laser.y, laser.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
  }
}

function killPlayer() {
  player.explosionTime = Math.ceil(PLAYER_EXPLOSION_TIME * FPS);
}

function shootLaser() {
  if (player.lasers.length < LASER_MAX) {
    player.lasers.push({
      // nose of the player//
      x: player.x + (4 / 3) * player.radius * Math.cos(player.angle),
      y: player.y - (4 / 3) * player.radius * Math.sin(player.angle),
      velX: (LASER_SPEED * Math.cos(player.angle)) / FPS,
      velY: (LASER_SPEED * Math.sin(player.angle)) / FPS,
      radius: player.radius / 5,
      distance: 0,
    });
  }
}

//CREATE AND DRAW EXPLOSION
let particles = [];
function drawExplosion(num) {
  for (let i = 0; i < num; i++) {
    const particle = {
      x:
        player.x +
        getRandomArbitrary(-PLAYER_EXPLOSION_RADIUS, PLAYER_EXPLOSION_RADIUS),
      y:
        player.y +
        getRandomArbitrary(-PLAYER_EXPLOSION_RADIUS, PLAYER_EXPLOSION_RADIUS),
      velX: 0,
      velY: 0,
      size: 5,
    };
    particles.push(particle);
    ctx.fillStyle = `hsla(${getRandomArbitrary(0, 50)}, 100%,50%,1)`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = `hsla(50, 100%,90%,0.5)`;
    ctx.beginPath();
    ctx.arc(
      player.x,
      player.y,
      PLAYER_EXPLOSION_RADIUS * 0.7,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
  }
}

// DRAW THE THRUSTERS//
function drawThrusters() {
  const normalized =
    Math.sqrt(
      player.speed.x * player.speed.x + player.speed.y * player.speed.y
    ) /
    (maxSpeed * 0.8);

  ctx.fillStyle = player.isDashing
    ? `hsla(200, 100% ,50%, 1)`
    : `hsla(160,100% ,50%, 1)`;
  ctx.strokeStyle = player.isDashing
    ? `hsla(250, 100% ,50%, 1)`
    : `hsla(210, 100% ,50%, 1)`;
  ctx.lineWidth = LINEWIDTH * 2;
  ctx.beginPath();
  ctx.moveTo(
    // rear left//
    player.x -
      player.radius *
        ((2 / 3) * Math.cos(player.angle) + 0.5 * Math.sin(player.angle)),
    player.y +
      player.radius *
        ((2 / 3) * Math.sin(player.angle) - 0.5 * Math.cos(player.angle))
  );
  ctx.lineTo(
    // rear centre (behind the player)//
    player.x -
      player.radius *
        2 *
        (AUTO_RUN
          ? 0.5 + getRandomArbitrary(0.2, 0.6)
          : Math.abs(player.speed.x * 0.3) + getRandomArbitrary(0.4, 0.6)) *
        Math.cos(player.angle),
    player.y +
      player.radius *
        2 *
        (AUTO_RUN
          ? 0.5 + getRandomArbitrary(0.2, 0.6)
          : Math.abs(player.speed.y * 0.3) + getRandomArbitrary(0.4, 0.6)) *
        Math.sin(player.angle)
  );

  ctx.lineTo(
    // rear right//
    player.x -
      player.radius *
        ((2 / 3) * Math.cos(player.angle) - 0.5 * Math.sin(player.angle)),
    player.y +
      player.radius *
        ((2 / 3) * Math.sin(player.angle) + 0.5 * Math.cos(player.angle))
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

//CREATE ASTEROIDS//
function createAsteroids(num = ASTEROID_COUNT) {
  asteroids = [];
  let x, y;
  for (let i = 0; i < num; i++) {
    do {
      x = Math.floor(Math.random() * window.innerWidth);
      y = Math.floor(Math.random() * window.innerHeight);
    } while (
      distBetweenPoints(player.x, player.y, x, y) <
      ASTEROID_SIZE * 2 + player.radius
    );
    asteroids.push(newAsteroid(x, y));
  }
}

function newAsteroid(x, y) {
  let asteroid = {
    x: x,
    y: y,
    radius: ASTEROID_SIZE / 2,
    velX:
      getRandomArbitrary(0.1, 0.8) *
      ASTEROID_SPEED *
      (Math.random() < 0.5 ? 1 : -1),
    velY:
      getRandomArbitrary(0.1, 0.8) *
      ASTEROID_SPEED *
      (Math.random() < 0.5 ? 1 : -1),
    angle: Math.random() * Math.PI * 2,
    vertices: Math.floor(
      Math.random() * (ASTEROID_VERTICES + 1) + ASTEROID_VERTICES / 2
    ),
    offset: [],
  };

  // populate the offsets array//
  for (let i = 0; i < asteroid.vertices; i++) {
    asteroid.offset.push(
      Math.random() * ASTEROID_JAGGED * 2 + 1 - ASTEROID_JAGGED
    );
  }
  return asteroid;
}

//DRAW ASTEROIDS//
function drawAsteroids(astCount = asteroids.length) {
  //check if num of asteroids is bigger than available array
  ASTEROID_COUNT = astCount;
  astCount > asteroids.length && (astCount = asteroids.length);

  // draw the asteroids//

  let angle, radius, x, y, offset, vertices;

  for (let i = 0; i < astCount; i++) {
    ctx.strokeStyle = 'grey';
    ctx.fillStyle = 'hsla(200, 0%, 15%, 1)';
    ctx.lineWidth = PLAYER_SIZE / 20;
    // get the asteroid properties//
    angle = asteroids[i].angle;
    radius = asteroids[i].radius;
    x = asteroids[i].x;
    y = asteroids[i].y;
    offset = asteroids[i].offset;
    vertices = asteroids[i].vertices;

    // draw the path//
    ctx.beginPath();
    ctx.moveTo(
      x + radius * offset[0] * Math.cos(angle),
      y + radius * offset[0] * Math.sin(angle)
    );
    // draw the polygon//
    for (let j = 1; j < vertices; j++) {
      ctx.lineTo(
        x + radius * offset[j] * Math.cos(angle + (j * Math.PI * 2) / vertices),
        y + radius * offset[j] * Math.sin(angle + (j * Math.PI * 2) / vertices)
      );
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    //collision bounding box//
    if (SHOW_COLLISION) {
      ctx.strokeStyle = 'cyan';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.stroke();
    }

    // move the asteroid//
    asteroids[i].x += asteroids[i].velX;
    asteroids[i].y += asteroids[i].velY;

    // handle asteroid edge of screen//
    wrapScreen(asteroids[i]);
  }
}

//CREATE BACKGROUND STARS//
function createStars(width, height) {
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = {
      x: Math.random() * 2400,
      y: Math.random() * 1200,
      size: getRandomArbitrary(0.15, 0.35) * STAR_SIZE,
    };
    stars.push(star);
  }
}
//DRAW BACKGROUND STARS//
function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    ctx.fillStyle = `hsla(${getRandomArbitrary(180, 360)}, 70%, ${
      (star.size / STAR_SIZE) * 300
    }%, 1)`;
    ctx.fillRect(
      (star.x / 2400) * window.innerWidth,
      (star.y / 1200) * window.innerHeight,
      star.size,
      star.size
    );
    ctx.fill();
  }
}
//FIND DISTANCE BETWEEN 2 POINTS//
function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//GET RANDOM NUMBER BETWEEN ANY TWO NUMBERS//
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//OBJECTS WRAP AROUND SCREEN//
function wrapScreen(object) {
  if (object.x < -object.radius) object.x = window.innerWidth + object.radius;
  if (object.x > window.innerWidth + object.radius) object.x = -object.radius;
  if (object.y < -object.radius) object.y = window.innerHeight + object.radius;
  if (object.y > innerHeight + object.radius) object.y = -object.radius;
}

//TRACK MOUSE POSITION
function mousemoveHandler(e) {
  e.preventDefault();
  if (player.health > 0) {
    mouse.x = e.x;
    mouse.y = e.y;
  }
}

//RESIZE SCREEN HANDLER//
function resizeCanvasHandler() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  drawStars();
  drawAsteroids();
  drawThrusters();
  drawPlayer();
}

// KEYBOARD HANDLERS//
function keydownHandler(e) {
  e.preventDefault();
  if (!AUTO_SHOOT) {
    if (e.code === 'Space') {
      player.isShooting = true;
      // player.shotDelay = 0;
    }
  }
  switch (e.code) {
    case 'KeyW':
      player.thrust.x = 1;
      player.thrust.y = 1;
      break;
    case 'KeyS':
      player.reverse.x = 1;
      player.reverse.y = 1;
      break;
    case 'KeyA':
      player.rotateDir = 1;
      // player.rotation = (rotationSpeed / 180) * Math.PI;
      break;
    case 'KeyD':
      player.rotateDir = -1;
      // player.rotation = (-rotationSpeed / 180) * Math.PI;
      break;
    case 'ArrowUp':
      player.thrust.x = 1;
      player.thrust.y = 1;
      break;
    case 'ArrowDown':
      player.reverse.x = 1;
      player.reverse.y = 1;
      break;
    case 'ArrowLeft':
      player.rotateDir = 1;
      // player.rotation = (rotationSpeed / 180) * Math.PI;
      break;
    case 'ArrowRight':
      player.rotateDir = -1;
      // player.rotation = (-rotationSpeed / 180) * Math.PI;
      break;
    case 'ShiftLeft':
      player.isDashing = true;
      playerSpeed = PLAYER_SPEED * 1.5;
      break;
    case 'Enter':
      isGameStart = true;
      break;
    default:
      break;
  }
}
function keyUpHandler(e) {
  e.preventDefault();
  if (!AUTO_SHOOT) {
    if (e.code === 'Space') {
      player.isShooting = false;
      player.shotDelay = 0;
    }
  }
  switch (e.code) {
    case 'KeyW':
      player.thrust.x = 0;
      player.thrust.y = 0;
      break;
    case 'KeyS':
      player.reverse.x = 0;
      player.reverse.y = 0;
      break;
    case 'KeyA':
      // player.rotation = 0;
      player.rotateDir = 0;
      break;
    case 'KeyD':
      // player.rotation = 0;
      player.rotateDir = 0;
      break;
    case 'ArrowUp':
      player.thrust.x = 0;
      player.thrust.y = 0;
      break;
    case 'ArrowDown':
      player.reverse.x = 0;
      player.reverse.y = 0;
      break;
    case 'ArrowLeft':
      // player.rotation = 0;
      player.rotateDir = 0;
      break;
    case 'ArrowRight':
      // player.rotation = 0;
      player.rotateDir = 0;
      break;
    case 'ShiftLeft':
      playerSpeed = PLAYER_SPEED;
      player.isDashing = false;
      break;

    default:
      break;
  }
}
