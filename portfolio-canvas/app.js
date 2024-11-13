const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Attractor {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 4;
    this.size = 8;
    this.radius =
      window.innerWidth > window.innerHeight
        ? window.innerWidth / this.size
        : window.innerHeight / this.size;
    this.innerRadius = this.radius / 4;
    this.speed = 1;
    this.direction = { x: 1, y: -1 };
    this.staticVelocity = { x: 0, y: 0 };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.attraction = 0.00005;
    this.scrollY = window.scrollY;
    this.prevScrollY = this.scrollY;
    this.maxVelocity = 800;
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
  update() {
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
  updateScroll(e) {
    clearTimeout(this.timer);
    this.scrollY = window.scrollY;
    this.updateVelocity(0, -(this.scrollY - this.prevScrollY) * 5);
    this.prevScrollY = this.scrollY;

    this.timer = setTimeout(() => {
      this.velocity = { x: 0, y: 0 };
    }, 50);
  }
  updateVelocity(speedX, speedY) {
    this.velocity = {
      x: speedX / this.maxVelocity,
      y: speedY / this.maxVelocity,
    };
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = "gold";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
    this.createCells();
  }
  createCells() {
    this.particles = [];
    for (let i = 0; i < this.totalParticles; i++) {
      const radius =
        Math.random() < 0.99
          ? randomNumberFromRange(0.5, 1)
          : randomNumberFromRange(2, 3);
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
    this.speed = 0.1;
    this.velocity = {
      x: randomNumberFromRange(-this.speed, this.speed) * 10,
      y: randomNumberFromRange(-this.speed, this.speed) * 10,
    };
    this.deceleration = 0.01;
    this.innerDeceleration = 0.03;
    // style ------------------------
    this.hue = randomNumberFromRange(0, 359);
    this.saturation = randomNumberFromRange(80, 100);
    this.brightness = randomNumberFromRange(40, 85);
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

window.addEventListener("scroll", (e) => {
  attractor.updateScroll(e);
});

function main() {
  // grid.update(attractor);
  grid.update(attractor2);
  grid.draw();
  attractor2.update();
  // attractor2.draw();
  requestAnimationFrame(main);
}

main();
