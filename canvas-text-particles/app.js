const TEXT = "LucaNovello";

class Mouse {
  constructor(
    x = window.innerWidth * 0.5,
    y = window.innerHeight * 0.5,
    radius = window.innerWidth * 0.04,
    hue = 45,
    saturation = 100,
    brightness = 40,
    alpha = 1,
    lineWidth = 1
  ) {
    this.canvas;
    this.ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.isMoving = false;
    this.isMovingCounter = 0;
    this.isMovingCounterLimit = 250;
    //Style
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.alpha = alpha;
    this.lineWidth = lineWidth;
    this.initCanvas();
    this.update(x, y);
  }
  initCanvas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-mouse";
    canvas.style.zIndex = "999999";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = ctx;
  }
  update(x, y) {
    this.isMoving = true;
    this.isMovingCounter = 0;
    this.x = x;
    this.y = y;
    document.body.style.background = `radial-gradient(circle at ${this.x}px ${this.y}px, hsl(210, 20%, 7%),
    hsl(200, 30%, 2%))`;
  }
  draw() {
    const finalRadius = this.radius * 0.5;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation * 0.9}%, ${
      this.brightness * 0.9
    }%, ${this.alpha})`;
    this.ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.arc(this.x, this.y, finalRadius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();

    if (this.isMoving) {
      this.isMovingCounter++;
      if (this.isMovingCounter >= this.isMovingCounterLimit)
        this.isMoving = false;
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    // this.radius =
    //   Math.sqrt(
    //     window.innerWidth * window.innerWidth +
    //       window.innerHeight * window.innerHeight
    //   ) * 0.1;
  }
}

class Grid {
  constructor(text = "Hello") {
    this.canvas;
    this.ctx;
    this.text = text.toString();
    this.fontFamily = "Poppins";
    this.fontSize = 60;
    this.fontWeight = 900;
    this.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.width = (this.fontFamily.length - 0.5) * this.fontSize;
    this.height = this.fontSize;
    this.x = 0;
    this.y = 0;
    this.imageData;
    this.data;
    this.particlesArr = [];
    this.pixelSize = 1;
    this.initTextCanvas();
    this.initDraw();
    this.initParticleCanvas();
  }
  initTextCanvas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = "canvas-text";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = ctx;
    console.log(this.canvas);
  }
  initDraw() {
    this.ctx.font = this.font;
    this.ctx.textBaseline = "top";
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();
    this.ctx.fillText(this.text, 0, 0, this.width);
    this.ctx.closePath();
    this.createImageData();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  initParticleCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;
  }
  createImageData() {
    this.imageData = this.ctx.getImageData(
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.data = this.imageData.data;
    for (let i = 3; i < this.data.length; i += 4) {
      const pixel = this.data[i];
      if (pixel > 0) {
        const index = (i + 1) / 4;

        this.particlesArr.push(
          new Particle(
            this,
            index % this.width,
            Math.floor(index / this.width),
            pixel
          )
        );

        // this.particlesArr.push({
        //   x: index % this.width,
        //   y: Math.floor(index / this.width),
        //   alpha: pixel,
        // });
      }
    }
    console.log(this.imageData);
    console.log(this.particlesArr);
  }
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particlesArr.length; i++) {
      const particle = this.particlesArr[i];
      particle.update();
      particle.draw();
    }
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;

    for (let i = 0; i < this.particlesArr.length; i++) {
      const particle = this.particlesArr[i];
      particle.resize(this);
    }
  }
}

class Particle {
  constructor(grid, x, y, alpha) {
    this.grid = grid;
    this.ctx = this.grid.ctx;
    // Physics
    this.radius = 2;
    this.normRadius = this.radius / window.innerWidth;
    this.padding = 10;
    this.startX = this.padding / this.radius + x;
    this.startY = this.padding / this.radius + y;
    this.normX = this.startX / window.innerWidth;
    this.normY = this.startY / window.innerHeight;
    this.x = this.normX * window.innerWidth;
    this.y = this.normY * window.innerHeight;
    this.velX = 0;
    this.velY = 0;
    this.dx = 0;
    this.dy = 0;
    this.dist = 0;
    this.minDist = 20;
    this.radii = 10;
    this.speed = 10;
    this.decel = 0.03;
    this.bounce = 0.9;
    // Style
    this.hue = 45;
    this.alpha = alpha;
    this.lineWidth = 1;
    this.timer = Math.random() * this.grid.particlesArr.length;
    this.timerRnd = Math.random() * 0.05;
  }
  update(
    mouse = {
      x: window.innerWidth * 0.5,
      y: 60000,
      radius: 10,
      isMoving: false,
    }
  ) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const length = Math.hypot(dx, dy);
    if (length < mouse.radius && mouse.isMoving) {
      this.dx = this.startX * this.radius - mouse.x;
      this.dy = this.startY * this.radius - mouse.y;
      this.dist = length > this.minDist ? length : this.minDist;
    } else {
      this.dx = this.startX * this.radius - this.x;
      this.dy = this.startY * this.radius - this.y;
      this.dist = length > this.radius ? length : this.radius;
    }
    this.velX += (this.dx / this.dist) * this.speed - this.velX * this.decel;
    this.velY += (this.dy / this.dist) * this.speed - this.velY * this.decel;
    this.x += this.velX;
    this.y += this.velY;
    // this.timer += 0.01 + this.timerRnd;
  }
  draw() {
    const color = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    // this.ctx.strokeStyle = color;
    // this.ctx.lineWidth = 1;
    // this.ctx.arc(
    //   (this.x + this.radius * 0.5) * this.radius,
    //   (this.y + this.radius * 0.5) * this.radius,
    //   this.radius,
    //   0,
    //   Math.PI * 2
    // );
    this.ctx.rect(
      this.x * this.radius,
      this.y * this.radius,
      this.radius,
      this.radius
    );
    this.ctx.fill();
    // this.ctx.stroke();
    this.ctx.closePath();
  }
  resize(grid) {
    this.grid = grid;
    this.normRadius = this.radius / this.grid.width;
    this.normX = this.startX / this.grid.width;
    this.normY = this.startY / this.grid.height;
    this.x = this.normX * this.grid.width;
    this.y = this.normY * this.grid.height;
  }
}

function getRandomFromRange(min, max) {
  return Math.random() * (max - min) + min;
}

const mouse = new Mouse();
const text = new Grid(TEXT);
// const grid = new Grid(text);

window.addEventListener("resize", (e) => {
  text.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", (e) => {
  mouse.update(e.clientX, e.clientY);
});
window.addEventListener("touchstart", (e) => {
  e.preventDefault();
  mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener("touchmove", (e) => {
  e.preventDefault();
  mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener("scroll", (e) => {
  e.preventDefault();
});
// MAIN FUNCTION **********************************************************************************************************************************
function animate() {
  text.draw();
  mouse.draw();
  requestAnimationFrame(animate);
}
animate();
