const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Attractor {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.size = 8;
    this.radius =
      window.innerWidth > window.innerHeight
        ? window.innerWidth / this.size
        : window.innerHeight / this.size;
    this.innerRadius = this.radius * 0.15;
    this.speed = 2;
    this.direction = { x: 1, y: -1 };
    this.staticVelocity = { x: 0, y: 0 };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.initAttraction = this.speed * 0.00003;
    this.attraction = this.initAttraction;
    this.attractionMultiplier = 5;
    this.deceleration = 0.01;
    this.initInnerDeceleration = this.deceleration;
    this.innerDeceleration = this.initInnerDeceleration;
    this.innerDecelerationMultiplier = 5;
    this.scrollSpeed = 2;
    this.scrollX = window.scrollX;
    this.scrollY = window.scrollY;
    this.prevScrollX = this.scrollX;
    this.prevScrollY = this.scrollY;
    this.maxScrollVel = 1;
    this.maxVelocity = 600;
    this.timer;
    this.isMouseDown = false;
  }
  screenWrapCollision() {
    if (this.x < -this.radius) {
      this.x = window.innerWidth;
    }
    if (this.x > window.innerWidth) {
      this.x = -this.radius;
    }
    if (this.y < -this.radius) {
      this.y = window.innerHeight;
    }
    if (this.y > window.innerHeight) {
      this.y = -this.radius;
    }
  }
  bounceCollision() {
    if (this.x < this.innerRadius) {
      this.x = this.innerRadius;
      this.direction.x *= -1;
    }
    if (this.x > window.innerWidth - this.innerRadius) {
      this.x = window.innerWidth - this.innerRadius;
      this.direction.x *= -1;
    }
    if (this.y < this.innerRadius) {
      this.y = this.innerRadius;
      this.direction.y *= -1;
    }
    if (this.y > window.innerHeight - this.innerRadius) {
      this.y = window.innerHeight - this.innerRadius;
      this.direction.y *= -1;
    }
  }
  updateSweep() {
    this.staticVelocity.x = this.speed * this.direction.x;
    this.staticVelocity.y = this.speed * this.direction.y;
    this.x += this.staticVelocity.x;
    this.y += this.staticVelocity.y;
    // this.screenWrapCollision();
    this.bounceCollision();
  }
  updateMousemove(e) {
    clearTimeout(this.timer);
    this.x = e.clientX;
    this.y = e.clientY;
    this.updateVelocity(e.movementX, e.movementY);
    this.timer = setTimeout(() => {
      this.velocity = { x: 0, y: 0 };
    }, 100);
  }
  updateTouchmove(e) {
    this.x = e.touches[0].clientX;
    this.y = e.touches[0].clientY;
  }
  updateScroll() {
    clearTimeout(this.timer);

    this.scrollX = window.scrollX;
    this.scrollY = window.scrollY;
    this.updateVelocity(
      -(this.scrollX - this.prevScrollX) * this.scrollSpeed,
      -(this.scrollY - this.prevScrollY) * this.scrollSpeed
    );
    this.prevScrollX = this.scrollX;
    this.prevScrollY = this.scrollY;
    this.clampVelocity(this.velocity.x, this.maxScrollVel);
    this.clampVelocity(this.velocity.y, this.maxScrollVel);

    this.timer = setTimeout(() => {
      this.velocity = { x: 0, y: 0 };
    }, 100);
  }
  updateWheel(e) {
    e.preventDefault();
    clearTimeout(this.timer);

    this.updateVelocity(
      e.deltaX * this.scrollSpeed,
      e.deltaY * this.scrollSpeed
    );
    this.clampVelocity(this.velocity.y, this.maxScrollVel * 0.5);
    this.timer = setTimeout(() => {
      this.velocity = { x: 0, y: 0 };
    }, 100);
  }
  clampVelocity(velocity, max) {
    velocity > max && (velocity = max);
    velocity < -max && (velocity = -max);
  }
  updateVelocity(speedX, speedY) {
    this.velocity = {
      x: speedX / this.maxVelocity,
      y: speedY / this.maxVelocity,
    };
  }
  draw() {
    ctx.fillStyle = "hsla(200, 0%, 0%, 0.5)";
    ctx.strokeStyle = "hsla(200, 0%, 100%, 0.3)";
    ctx.lineWidth = 1;

    // Outer Radius ----------------------
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.stroke();
    // ctx.closePath();

    // Inner Radius ----------------------
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2);
    ctx.stroke();
    // ctx.fill();
    ctx.closePath();

    // Mouse Position ----------------------
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

class Grid {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.maxLength = Math.hypot(this.width, this.height);
    this.particleCount = 1000;
    this.particles = [];
    this.minSizeRange = [1, 4];
    this.maxSizeRange = [5, 11];
    this.createCells();
  }
  createCells() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const radius =
        Math.random() < 0.99
          ? randomNumberFromRange(this.minSizeRange[0], this.minSizeRange[1])
          : randomNumberFromRange(this.maxSizeRange[0], this.maxSizeRange[1]);
      this.particles.push(
        new Particle(
          Math.random() * this.width,
          Math.random() * this.height,
          radius
        )
      );
    }
  }
  update(attractor) {
    this.particles.forEach((cell) => {
      cell.update(attractor);
    });
  }
  draw() {
    ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach((cell, i) => {
      cell.draw();
    });
  }
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.maxLength = Math.hypot(this.width, this.height);
  }
}

class Particle {
  constructor(x, y, radius = 1) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    // physics ----------------------
    this.speed = 0.03;
    this.acceleration = {
      x: randomNumberFromRange(-this.speed, this.speed),
      y: randomNumberFromRange(-this.speed, this.speed),
    };
    this.velocity = {
      x: this.acceleration.x * 100,
      y: this.acceleration.y * 100,
    };
    this.isInner = false;
    this.beenInner = this.isInner;

    // style ------------------------
    this.hue = randomNumberFromRange(30, 50);
    this.saturation = randomNumberFromRange(80, 100);
    this.brightness = randomNumberFromRange(40, 60);
    this.counter = Math.random() * 1000;
  }
  update(attractor) {
    const dx = attractor.x - this.x;
    const dy = attractor.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // this == grid.particles[0] && console.log(distance);

    // calculate velocity ----------------------
    if (
      // attraction ring to the attractor ----------------------
      distance < attractor.radius - this.radius &&
      distance > attractor.innerRadius
    ) {
      if (
        distance < attractor.radius - this.radius * 2 &&
        distance > attractor.innerRadius + this.radius * 2
      ) {
        this.isInner = false;
      }
      const angle = Math.atan2(dy, dx);
      const targetX = this.x + Math.cos(angle) * attractor.radius;
      const targetY = this.y + Math.sin(angle) * attractor.radius;
      this.velocity.x += (targetX - this.x) * attractor.attraction;
      this.velocity.y += (targetY - this.y) * attractor.attraction;
    } else if (
      // inner circle to the attractor
      distance < attractor.radius - this.radius &&
      distance < attractor.innerRadius
    ) {
      this.beenInner = true;
      this.isInner = true;
      this.velocity.x +=
        randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.x -
        this.velocity.x * attractor.innerDeceleration;
      this.velocity.y +=
        randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.y -
        this.velocity.y * attractor.innerDeceleration;
    } else {
      // not in the attractor radius ----------------------
      this.isInner = false;
      const angle = Math.atan2(dy, dx);
      const targetX = this.x + Math.cos(angle) * attractor.radius;
      const targetY = this.y + Math.sin(angle) * attractor.radius;
      this.acceleration.x +=
        ((targetX - this.x) * attractor.attraction -
          this.acceleration.x * 0.1) /
        ((distance / Math.hypot(ctx.canvas.width, ctx.canvas.height)) * 5);
      this.acceleration.y +=
        ((targetY - this.y) * attractor.attraction -
          this.acceleration.y * 0.1) /
        (distance / Math.hypot(ctx.canvas.width, ctx.canvas.height));
      this.velocity.x +=
        this.acceleration.x +
        // randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.x -
        this.velocity.x * attractor.deceleration;
      this.velocity.y +=
        this.acceleration.y +
        // randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.y -
        this.velocity.y * attractor.deceleration;
    }

    // move the cell ----------------------
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // collision handling ----------------------
    this.bounceCollision();
    // this.screenWrapCollision();

    // update the counter ----------------------
    this.counter += 0.005;

    // store the previous position ----------------------
    // if (this.prevPos.length > this.prevPosCount - 1) {
    //   this.prevPos.shift();
    // }
    // this.prevPos.push({ x: this.x, y: this.y });
  }
  screenWrapCollision() {
    if (this.x < -this.radius * 2) {
      this.x = window.innerWidth + this.radius * 2;
    }
    if (this.x > window.innerWidth + this.radius * 2) {
      this.x = -(this.radius * 2);
    }
    if (this.y < -(this.radius * 2)) {
      this.y = window.innerHeight + this.radius * 2;
    }
    if (this.y > window.innerHeight + this.radius * 2) {
      this.y = -(this.radius * 2);
    }
  }
  bounceCollision() {
    if (this.x < this.radius) {
      this.x = this.radius;
      this.acceleration.x *= -1;
      this.velocity.x *= -1;
    }
    if (this.x > window.innerWidth - this.radius) {
      this.x = window.innerWidth - this.radius;
      this.acceleration.x *= -1;
      this.velocity.x *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.acceleration.y *= -1;
      this.velocity.y *= -1;
    }
    if (this.y > window.innerHeight - this.radius) {
      this.y = window.innerHeight - this.radius;
      this.acceleration.y *= -1;
      this.velocity.y *= -1;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.brightness}%)`;
    // ctx.rect(
    //   this.x - this.radius / 2,
    //   this.y - this.radius / 2,
    //   this.radius,
    //   this.radius
    // );
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

function randomNumberFromRange(min, max) {
  return Math.random() * (max - min) + min;
}

const attractor = new Attractor();
const attractor2 = new Attractor();
const grid = new Grid(canvas.width, canvas.height, 20);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  grid.resize();
});

window.addEventListener("mousemove", (e) => {
  attractor.updateMousemove(e);
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    attractor.innerDeceleration =
      attractor.initInnerDeceleration * attractor.attractionMultiplier;
    attractor.attraction =
      attractor.initAttraction * attractor.innerDecelerationMultiplier;
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    attractor.innerDeceleration = attractor.initInnerDeceleration;
    attractor.attraction = attractor.initAttraction;
  }
});

window.addEventListener("touchstart", (e) => {
  attractor.updateTouchmove(e);
});
window.addEventListener("touchmove", (e) => {
  attractor.updateTouchmove(e);
});

window.addEventListener("scroll", () => {
  attractor.updateScroll();
});

window.addEventListener(
  "wheel",
  (e) => {
    attractor.updateWheel(e);
  },
  { passive: false }
);
1;

function main() {
  grid.update(attractor);
  // grid.update(attractor2);
  // attractor2.updateSweep();
  grid.draw();
  attractor.draw();

  // console.log(grid.particles[0].distance);

  requestAnimationFrame(main);
}

main();
