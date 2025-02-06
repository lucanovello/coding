const body = document.getElementById("body");

const canvasScene = document.getElementById("canvas");
const ctx = canvasScene.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const mouse = {
  x: ctx.canvas.width / 2,
  y: ctx.canvas.height / 2,
  isDown: false,
};

const SUB_STEPS = 4;

//  Particle Constants
const PARTICLE_RAD_MIN = 5;
const PARTICLE_RAD_MAX = 15;
const PARTICLE_RADIUS = getRandomArbitrary(PARTICLE_RAD_MIN, PARTICLE_RAD_MAX);
const PARTICLE_VELOCITY = 2;
const PARTICLE_DECELERATION = 0.993;
const PARTICLE_OPACITY_RATE = PARTICLE_DECELERATION * PARTICLE_DECELERATION;
const PARTICLE_SIZE_RATE =
  PARTICLE_DECELERATION * PARTICLE_DECELERATION - PARTICLE_DECELERATION * 0.01;

const GRAVITY = PARTICLE_VELOCITY * 0.03;

const particleArr = [];

let mainColor = Math.random() * 360;

// Set up the resize handler
window.addEventListener("resize", () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
});

// Mouse events
window.addEventListener("mousedown", (e) => {
  e.preventDefault();
  mouse.isDown = true;
});
window.addEventListener("mouseup", (e) => {
  e.preventDefault();
  mouse.isDown = false;
});
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Touch events
window.addEventListener("touchstart", (e) => {
  e.preventDefault();
  mouse.x = e.changedTouches[0].clientX;
  mouse.y = e.changedTouches[0].clientY;
  // mouse.isDown = true;
});
window.addEventListener("touchend", (e) => {
  e.preventDefault();
  mouse.x = e.changedTouches[0].clientX;
  mouse.y = e.changedTouches[0].clientY;
  mouse.isDown = false;
});
window.addEventListener("touchmove", (e) => {
  mouse.x = e.changedTouches[0].clientX;
  mouse.y = e.changedTouches[0].clientY;
});

// Getting a random integer between two values
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// CREATE PARTICLES AND PUSH TO ARRAY
function createParticle(particleArr) {
  const angle = getRandomArbitrary(-Math.PI, Math.PI);
  const size = mouse.isDown
    ? getRandomArbitrary(PARTICLE_RAD_MIN, PARTICLE_RAD_MAX)
    : getRandomArbitrary(PARTICLE_RAD_MIN, PARTICLE_RAD_MAX) * 1.618;
  particleArr.push({
    x: mouse.x,
    y: mouse.y,
    angle: angle,
    velocity: {
      x: Math.cos(angle),
      y: Math.sin(angle),
    },
    size: size,
    hue: mainColor,
    saturation: 100,
    brightness: 50,
    opacity: 1,
    isFill: mouse.isDown,
  });
}

// CALC PARTICLE MOVEMENT
function calcParticleMovement(particle, particleArr) {
  if (particle.opacity <= 0.01 || particle.size < 0.001) {
    particleArr.splice(particle, 1);
  } else {
    particle.x += particle.velocity.x * PARTICLE_VELOCITY;
    particle.y += particle.velocity.y * PARTICLE_VELOCITY;
    particle.velocity.x *= PARTICLE_DECELERATION;
    particle.velocity.y *= PARTICLE_DECELERATION;

    // particle.velocity.y += GRAVITY;
    particle.size *= PARTICLE_SIZE_RATE;
    particle.opacity *= PARTICLE_OPACITY_RATE;
  }
}

// DRAW PARTICLES
function drawParticles(particle) {
  ctx.fillStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.brightness}%, ${particle.opacity} )`;
  ctx.strokeStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.brightness}%, ${particle.opacity} )`;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
  // ctx.rect(particle.x, particle.y, particle.size, particle.size);
  particle.isFill ? ctx.fill() : ctx.stroke();
  ctx.closePath();
}
createParticle(particleArr);

// MAIN ANIMATION FUNCTION ------------------------------------------------------
function main() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (mouse.isDown) {
    for (let i = 0; i < SUB_STEPS; i++) {
      createParticle(particleArr);
    }
  } else {
    for (let i = 0; i < SUB_STEPS / 4; i++) {
      createParticle(particleArr);
    }
  }

  // for (let i = particleArr.length - 1; i > 0; i--) {
  for (let i = 0; i < particleArr.length; i++) {
    const particle = particleArr[i];
    drawParticles(particle);
    calcParticleMovement(particle, particleArr);
  }

  mainColor += 0.5;
  requestAnimationFrame(main);
}

main();
