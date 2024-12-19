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
    this.innerRadius = this.radius / (this.size * 2);
    this.speed = 2;
    this.direction = { x: 1, y: -1 };
    this.staticVelocity = { x: 0, y: 0 };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.attraction = this.speed * 0.0005;
    this.scrollSpeed = 2;
    this.scrollX = window.scrollX;
    this.scrollY = window.scrollY;
    this.prevScrollX = this.scrollX;
    this.prevScrollY = this.scrollY;
    this.maxScrollVel = 1;
    this.maxVelocity = 600;
    this.timer;
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
    ctx.strokeStyle = "hsla(45, 100%, 50%, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
}

class Grid {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.maxLength = Math.hypot(this.width, this.height);
    this.totalParticles = this.maxLength;
    this.particles = [];
    this.minSizeRange = [0.5, 1];
    this.maxSizeRange = [2, 3];
    this.createCells();
  }
  createCells() {
    this.particles = [];
    for (let i = 0; i < this.totalParticles; i++) {
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
    this.speed = 0.2;
    this.velocity = {
      x: randomNumberFromRange(-this.speed, this.speed) * 10,
      y: randomNumberFromRange(-this.speed, this.speed) * 10,
    };
    this.deceleration = 0.01;
    this.innerDeceleration = 0.9;
    // style ------------------------
    this.hue = randomNumberFromRange(160, 270);
    this.saturation = randomNumberFromRange(100, 100);
    this.brightness = randomNumberFromRange(50, 70);
    this.counter = Math.random() * 1000;
  }
  update(attractor) {
    const dx = attractor.x - this.x;
    const dy = attractor.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // calculate velocity ----------------------
    if (
      // attraction ring to the attractor ----------------------
      distance < attractor.radius - this.radius &&
      distance > attractor.innerRadius
    ) {
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
      this.velocity.x +=
        randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.x -
        this.velocity.x * this.innerDeceleration;
      this.velocity.y +=
        randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.y -
        this.velocity.y * this.innerDeceleration;
    } else {
      // not in the attractor radius ----------------------
      this.velocity.x +=
        randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.x -
        this.velocity.x * this.deceleration;
      this.velocity.y +=
        randomNumberFromRange(-this.speed, this.speed) +
        attractor.velocity.y -
        this.velocity.y * this.deceleration;
    }

    // move the cell ----------------------
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // collision handling ----------------------
    this.bounceCollision();
    // this.screenWrapCollision();

    // update the counter ----------------------
    this.counter += 0.005;
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
      this.velocity.x *= -1;
    }
    if (this.x > window.innerWidth - this.radius) {
      this.x = window.innerWidth - this.radius;
      this.velocity.x *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.velocity.y *= -1;
    }
    if (this.y > window.innerHeight - this.radius) {
      this.y = window.innerHeight - this.radius;
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
    ctx.arc(
      this.x,
      this.y,
      this.radius * (Math.sin(this.counter) + 1.2) * 0.8,
      0,
      Math.PI * 2
    );
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

function main() {
  grid.update(attractor);
  // grid.update(attractor2);
  // attractor2.updateSweep();
  grid.draw();
  // attractor2.draw();
  requestAnimationFrame(main);
}

main();
