class Mouse {
  constructor() {
    this.canvas;
    this.context;
    this.x = window.innerWidth * 0.5;
    this.y = window.innerHeight * 0.5;
    this.radius = 5;
    this.isDown = false;
    this.initCanvas();
  }
  initCanvas() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-mouse";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = context;
  }
  update(x, y) {
    this.x = x;
    this.y = y;
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
  onMousedownHandler() {
    this.isDown = true;
  }
  onMouseupHandler() {
    this.isDown = false;
  }
}
class Particle {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.radiusMin = 2;
    this.radiusMax = 20;
    this.radius = getRandomRange(this.radiusMin, this.radiusMax);
    this.x = getRandomRange(this.radius, this.canvas.width - this.radius);
    this.y = getRandomRange(this.radius, this.canvas.height - this.radius);
    // Speed
    this.acc = { x: getRandomRange(-10, 10), y: getRandomRange(-10, 10) };
    this.decel = 0.005;
    this.initVel = {
      x: getRandomRange(-this.acc.x, this.acc.x),
      y: getRandomRange(-this.acc.y, this.acc.y),
    };
    this.vel = {
      x: this.initVel.x,
      y: this.initVel.y,
    };
    // Style
    this.hue = getRandomRange(0, 359);
    this.saturation = getRandomRange(90, 100);
    this.brightness = getRandomRange(45, 65);
    this.alpha = getRandomRange(0.5, 0.9);
    this.maxLineWidth = 1;
    this.arc = Math.PI * 2;
  }
  update(mouse) {
    if (mouse.isDown) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const angle = Math.atan2(dy, dx);
      this.vel.x += Math.cos(angle) - this.vel.x * this.decel;
      this.vel.y += Math.sin(angle) - this.vel.y * this.decel;
    }
    this.x += this.vel.x;
    this.y += this.vel.y;

    this.screenBounce();
  }
  screenBounce() {
    if (this.x + this.radius > this.canvas.width) {
      this.x = this.canvas.width - this.radius;
      this.acc.x *= -1;
      this.vel.x *= -1;
    }
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.acc.x *= -1;
      this.vel.x *= -1;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.acc.y *= -1;
      this.vel.y *= -1;
    }
    if (this.y + this.radius > this.canvas.height) {
      this.y = this.canvas.height - this.radius;
      this.acc.y *= -1;
      this.vel.y *= -1;
    }
  }
  screenWrap() {
    if (this.x < -this.radius) {
      this.x = this.canvas.width + this.radius.x;
    }
    if (this.x > this.canvas.width + this.radius) {
      this.x = -this.radius;
    }
    if (this.y < -this.radius) {
      this.y = this.canvas.height + this.radius;
    }
    if (this.y > this.canvas.height + this.radius) {
      this.y = -this.radius;
    }
  }
  draw() {
    this.context.beginPath();
    this.context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
    this.context.lineWidth = this.maxLineWidth;
    this.context.arc(this.x, this.y, this.radius, 0, this.arc);
    this.context.stroke();
    this.context.closePath();
  }
}

class ParticleSpawner {
  constructor() {
    this.canvas;
    this.context;
    this.particleCount = 500;
    this.particleArr = [];
    this.initCanvas();
    this.createParticle(this.particleCount);
  }
  initCanvas() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-particles";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = context;
  }
  createParticle(particleCount) {
    for (let i = 0; i < particleCount; i++) {
      this.particleArr.push(new Particle(this.canvas, this.context));
    }
  }
  update(mouse) {
    for (let i = 0; i < this.particleArr.length; i++) {
      const particle = this.particleArr[i];
      particle.update(mouse);
    }
  }
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.particleArr.length; i++) {
      const particle = this.particleArr[i];
      particle.draw();
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

// Get random number from range
function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Window Event **************************************************************************************************************
window.addEventListener("resize", () => {
  mouse.resize(window.innerWidth, window.innerHeight);
  particleSpawner.resize(window.innerWidth, window.innerHeight);
});

// Mouse Events **************************************************************************************************************
window.addEventListener("mousedown", (e) => {
  e.preventDefault();
  mouse.onMousedownHandler();
});
window.addEventListener("mouseup", (e) => {
  e.preventDefault();
  mouse.onMouseupHandler();
});
window.addEventListener("mousemove", (e) => {
  mouse.update(e.clientX, e.clientY);
});

// Instantiate objects **************************************************************************************************************
// const stars = new Stars();
const mouse = new Mouse(0, 0, 30);
const particleSpawner = new ParticleSpawner();

// MAIN FUNCTION **********************************************************************************************************************************
function animate() {
  particleSpawner.update(mouse);
  particleSpawner.draw();

  requestAnimationFrame(animate);
}
animate();
