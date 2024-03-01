class User {
  constructor() {
    this.canvas;
    this.context;
    this.x = window.innerWidth * 0.5;
    this.y = window.innerHeight * 0.5;
    this.radius = 5;
    // movement
    this.acc = 100;
    this.decel = 0.1;
    this.direction = {
      x: 0,
      y: 0,
    };
    this.vel = {
      x: 0,
      y: 0,
    };
    // keys & mouse
    this.isRightDown = 0;
    this.isLeftDown = 0;
    this.isDown = this.isRightDown - this.isLeftDown;
    this.initCanvas();
    this.shift = 0;
    this.control = 0;
    this.space = 0;
    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;
  }
  initCanvas() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-user";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = context;
  }
  update(x = null, y = null) {
    if (x == null) {
      this.x = x;
      this.y = y;
    } else {
      this.direction.x = this.right - this.left;
      this.direction.y = this.down - this.up;
      this.vel.x += this.direction.x * this.acc;
      this.vel.y += this.direction.y * this.acc;
      this.x += this.vel.x;
      this.y += this.vel.y;
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
  onMousedownHandler(e) {
    e.preventDefault();
    e.button == 0 && (this.isLeftDown = 1);
    e.button == 2 && (this.isRightDown = 1);
    if (this.isRightDown != 0 || this.isLeftDown != 0) {
      document.body.style.cursor = "grabbing";
    }
  }
  onMouseupHandler(e) {
    e.preventDefault();
    e.button == 0 && (this.isLeftDown = 0);
    e.button == 2 && (this.isRightDown = 0);
    if (this.isRightDown == 0 && this.isLeftDown == 0) {
      document.body.style.cursor = "grab";
    }
  }
  onTouchStartHandler(x, y) {
    this.isLeftDown = 1;
    this.x = x;
    this.y = y;
  }
  onTouchEndHandler(x, y) {
    this.isLeftDown = 0;
    this.x = x;
    this.y = y;
  }
  onKeydownHandler(key) {
    switch (key) {
      case "Space":
        this.space = 1;
        break;
      case "Shift":
        this.shift = 1;
        break;
      case "Control":
        this.control = 1;
        break;
      case "KeyW":
        this.up = 1;
        break;
      case "KeyS":
        this.down = 1;
        break;
      case "KeyA":
        this.left = 1;
        break;
      case "KeyD":
        this.right = 1;
        break;
      default:
        break;
    }
  }
  onKeyupHandler(key) {
    switch (key) {
      case "Space":
        this.space = 0;
        break;
      case "Shift":
        this.shift = 0;
        break;
      case "Control":
        this.control = 0;
        break;
      case "KeyW":
        this.up = 0;
        break;
      case "KeyS":
        this.down = 0;
        break;
      case "KeyA":
        this.left = 0;
        break;
      case "KeyD":
        this.right = 0;
        break;
      default:
        break;
    }
  }
}
class Particle {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.radiusMin = 5;
    this.radiusMax =
      Math.random() > 0.99
        ? 100
        : Math.random() > 0.8
        ? 70
        : Math.random() > 0.5
        ? 50
        : 30;
    this.radius = getRandomRange(this.radiusMin, this.radiusMax);
    this.x = getRandomRange(this.radius, this.canvas.width - this.radius);
    this.y = getRandomRange(this.radius, this.canvas.height - this.radius);
    // Speed
    this.speed = 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.acc = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };
    this.decel = 0.01;
    this.initVel = 1;
    this.vel = {
      x: this.acc.x * this.initVel * (this.radius / this.radiusMax),
      y: this.acc.y * this.initVel * (this.radius / this.radiusMax),
    };
    this.maxVel = 9;
    this.jiggleStep = (this.radius / this.radiusMax) * 0.5;
    this.wallBounce = 0.9;
    this.minDistance =
      (this.canvas.width * this.canvas.width +
        this.canvas.height * this.canvas.height) *
      0.03;

    // Style
    this.startingHue = 0;
    this.hueRange = 359;
    this.hue = getRandomRange(0, 359);
    // this.hue =
    //   this.startingHue + (this.radius / this.radiusMax) * this.hueRange;
    this.saturation = getRandomRange(90, 100);
    this.brightness = getRandomRange(55, 65);
    this.alpha = 1;
    this.maxLineWidth = 1;
    this.arc = Math.PI * 2;
  }
  update(user) {
    const dx = user.x - this.x;
    const dy = user.y - this.y;
    this.angle = Math.atan2(dy, dx);
    const dist = dx * dx + dy * dy;
    const finalDist =
      dist < this.minDistance * this.minDistance
        ? this.minDistance * this.minDistance
        : dist;
    const force = (this.radius * 2) / this.radiusMax;
    const leftForce =
      this.canvas.width < 950 ? force * 3000000000 : force * 10000000000;
    const rightForce = force * 1;
    const jiggle = getRandomRange(-this.jiggleStep, this.jiggleStep);

    // mouseLeftdown
    if (user.isLeftDown != 0 || user.space != 0) {
      this.acc.x =
        ((Math.cos(this.angle) * this.speed) / finalDist) * leftForce;
      this.acc.y =
        ((Math.sin(this.angle) * this.speed) / finalDist) * leftForce;
      if (
        dist < this.minDistance &&
        (Math.abs(this.vel.x) > this.maxVel ||
          Math.abs(this.vel.y) > this.maxVel)
      ) {
        this.decel = 0.05;
        this.vel.x += this.acc.x - this.vel.x * this.decel;
        this.vel.y += this.acc.y - this.vel.y * this.decel;
      } else {
        this.decel = 0.0;
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
      }
    }
    // mouseRightdown
    if (user.isRightDown != 0 && dist < this.minDistance * 0.5) {
      this.vel.x += this.acc.x - this.vel.x * this.decel;
      this.vel.y += this.acc.y - this.vel.y * this.decel;
      this.acc.x = -(Math.cos(this.angle) * this.speed * rightForce);
      this.acc.y = -(Math.sin(this.angle) * this.speed * rightForce);
    }

    this.x += this.vel.x;
    this.y += this.vel.y;
    this.screenBounce();
  }
  draw() {
    this.context.beginPath();

    // Create gradient
    const gradient = this.context.createRadialGradient(
      this.x,
      this.y,
      1,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(
      0,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`
    );
    gradient.addColorStop(
      0.1,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.7})`
    );
    gradient.addColorStop(
      0.2,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.5})`
    );
    gradient.addColorStop(
      0.3,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.32})`
    );
    gradient.addColorStop(
      0.4,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.168})`
    );
    gradient.addColorStop(
      0.5,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.078})`
    );
    gradient.addColorStop(
      0.6,
      `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.031})`
    );
    // gradient.addColorStop(
    //   0.7,
    //   `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.002})`
    // );
    // gradient.addColorStop(
    //   0.8,
    //   `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.04})`
    // );
    // gradient.addColorStop(
    //   0.9,
    //   `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${0.01})`
    // );
    gradient.addColorStop(1, "transparent");
    this.context.fillStyle = gradient;

    // this.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${
    //   this.brightness
    // }%, ${this.alpha * 0.2})`;

    // this.context.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
    // this.context.lineWidth = this.maxLineWidth;
    this.context.arc(this.x, this.y, this.radius, 0, this.arc);
    this.context.fill();
    // this.context.stroke();
    this.context.closePath();
  }
  screenBounce() {
    // Gradient Circles
    if (this.x < 0) {
      this.x = 0;
      this.acc.x *= -this.wallBounce;
      this.vel.x *= -this.wallBounce;
    }
    if (this.x > this.canvas.width) {
      this.x = this.canvas.width;
      this.acc.x *= -this.wallBounce;
      this.vel.x *= -this.wallBounce;
    }
    if (this.y < 0) {
      this.y = 0;
      this.acc.y *= -this.wallBounce;
      this.vel.y *= -this.wallBounce;
    }
    if (this.y > this.canvas.height) {
      this.y = this.canvas.height;
      this.acc.y *= -this.wallBounce;
      this.vel.y *= -this.wallBounce;
    }
    // Solid Circles
    // if (this.x + this.radius > this.canvas.width) {
    //   this.x = this.canvas.width - this.radius;
    //   this.acc.x *= -this.wallBounce;
    //   this.vel.x *= -this.wallBounce;
    // }
    // if (this.x - this.radius < 0) {
    //   this.x = this.radius;
    //   this.acc.x *= -this.wallBounce;
    //   this.vel.x *= -this.wallBounce;
    // }
    // if (this.y - this.radius < 0) {
    //   this.y = this.radius;
    //   this.acc.y *= -this.wallBounce;
    //   this.vel.y *= -this.wallBounce;
    // }
    // if (this.y + this.radius > this.canvas.height) {
    //   this.y = this.canvas.height - this.radius;
    //   this.acc.y *= -this.wallBounce;
    //   this.vel.y *= -this.wallBounce;
    // }
  }
  screenWrap() {
    if (this.x < -this.radius) {
      this.x = this.canvas.width + this.radius;
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
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
class ParticleSpawner {
  constructor() {
    this.canvas;
    this.context;
    this.particleCount = window.innerWidth > 1000 ? 20 : 50;
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
  update(user) {
    for (let i = 0; i < this.particleArr.length; i++) {
      const particle = this.particleArr[i];
      particle.update(user);
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
    for (let i = 0; i < this.particleArr.length; i++) {
      const particle = this.particleArr[i];
      particle.resize(this.canvas.width, this.canvas.height);
    }
  }
}

// Get random number from range
function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}
// Window Event **************************************************************************************************************
window.addEventListener("resize", () => {
  user.resize(window.innerWidth, window.innerHeight);
  particleSpawner.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Mouse Events **************************************************************************************************************
window.addEventListener("mousedown", (e) => {
  e.preventDefault();
  user.onMousedownHandler(e);
});
window.addEventListener("mouseup", (e) => {
  e.preventDefault();
  user.onMouseupHandler(e);
});
window.addEventListener("mousemove", (e) => {
  e.preventDefault();
  user.update(e.clientX, e.clientY);
});
window.addEventListener("touchstart", (e) => {
  console.log(e);
  user.onTouchStartHandler(
    e.changedTouches[0].clientX,
    e.changedTouches[0].clientY
  );
});
// window.addEventListener("touchend", (e) => {
//   console.log(e);
//   user.onTouchEndHandler(
//     e.changedTouches[0].clientX,
//     e.changedTouches[0].clientY
//   );
// });
window.addEventListener("touchmove", (e) => {
  user.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
// Key Events **************************************************************************************************************
window.addEventListener("keydown", (e) => user.onKeydownHandler(e.code));
window.addEventListener("keyup", (e) => user.onKeyupHandler(e.code));

// Instantiate objects **************************************************************************************************************
const user = new User(0, 0, 30);
const particleSpawner = new ParticleSpawner();

// MAIN FUNCTION **********************************************************************************************************************************
function animate() {
  particleSpawner.update(user);
  particleSpawner.draw();
  requestAnimationFrame(animate);
  console.log(user.up, user.down, user.left, user.right);
}
animate();
