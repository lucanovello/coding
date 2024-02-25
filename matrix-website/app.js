class UserInterface {
  constructor() {
    this.nameText = document.getElementById("name");
    this.options = document.getElementById("options");
    this.accLabel = document.getElementById("acc-label");
    this.decelLabel = document.getElementById("decel-label");
    this.turnSpeedLabel = document.getElementById("turnspeed-label");
    this.particleCountLabel = document.getElementById("particle-count-label");
    this.accInput = document.getElementById("acc-input");
    this.decelInput = document.getElementById("decel-input");
    this.turnSpeedInput = document.getElementById("turnspeed-input");
    this.particleCountInput = document.getElementById("particle-count-input");
    this.optionsContainer = document.getElementById("options-container");
    this.optionsIconWrapper = document.getElementById("options-icon-wrapper");
    this.optionsIconTop = document.getElementById("options-icon-top");
    this.optionsIconBottom = document.getElementById("options-icon-bottom");
    this.mainHue = Math.random() * 360;
    this.mainHueIncrement = 0.05;
    this.isOptionsOpen = false;
    this.initEvents();
  }
  initEvents() {
    // Window Event
    window.addEventListener("resize", () => {
      player.resize(window.innerWidth, window.innerHeight);
      mouse.resize(window.innerWidth, window.innerHeight);
      stars.resize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    // Touch Events
    window.addEventListener("touchmove", (e) => {
      mouse.shouldDraw = true;
      mouse.isMobileControl = true;
      if (e.target.dataset.group != "options") {
        mouse.touchDiffX = e.changedTouches[0].clientX - mouse.touchstartX;
        mouse.touchDiffY = e.changedTouches[0].clientY - mouse.touchstartY;
        mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    });
    window.addEventListener("touchstart", (e) => {
      mouse.shouldDraw = true;
      mouse.isMobileControl = true;
      if (e.target.dataset.group != "options") {
        mouse.touchstartX = e.changedTouches[0].clientX;
        mouse.touchstartY = e.changedTouches[0].clientY;
        mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    });
    window.addEventListener("touchend", (e) => {
      mouse.shouldDraw = false;
      mouse.isMobileControl = false;
      mouse.touchstartX = undefined;
      mouse.touchstartY = undefined;
      if (e.target.dataset.group != "options") {
        mouse.touchDiffX = 0;
        mouse.touchDiffY = 0;
        mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    });
    // Key Events
    window.addEventListener("keydown", (e) => {
      if (e.code === "ShiftLeft") player.acc = 1.618;
      if (e.code === "Space") player.isShooting = true;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          player.up = 1;
          break;
        case "KeyS":
        case "ArrowDown":
          player.down = 1;
          break;
        case "KeyA":
        case "ArrowLeft":
          player.left = 1;
          break;
        case "KeyD":
        case "ArrowRight":
          player.right = 1;
          break;
        default:
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "ShiftLeft") player.acc = 1;
      if (e.code === "Space") player.isShooting = false;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          player.up = 0;
          break;
        case "KeyS":
        case "ArrowDown":
          player.down = 0;
          break;
        case "KeyA":
        case "ArrowLeft":
          player.left = 0;
          break;
        case "KeyD":
        case "ArrowRight":
          player.right = 0;
          break;
        default:
          break;
      }
    });
    this.accInput.addEventListener("wheel", (e) => {
      this.onWheelHandler(e, this.accInput, 0.1, 1);
    });
    this.decelInput.addEventListener("wheel", (e) => {
      this.onWheelHandler(e, this.decelInput, 0.01, 2);
    });
    this.turnSpeedInput.addEventListener("wheel", (e) => {
      this.onWheelHandler(e, this.turnSpeedInput, 0.1, 2);
    });
    this.particleCountInput.addEventListener("wheel", (e) => {
      this.onWheelHandler(e, this.particleCountInput, 1, 0);
    });
    this.optionsIconWrapper.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.isOptionsOpen = !this.isOptionsOpen;
      this.mobileNavCloseHandler();
    });
    this.optionsIconWrapper.addEventListener("click", (e) => {
      e.preventDefault();
      this.isOptionsOpen = !this.isOptionsOpen;
      this.mobileNavCloseHandler();
    });
  }
  updateNameColor() {
    this.nameText.style.color = `hsl(${this.mainHue}, 100%, 50%)`;
    this.mainHue += this.mainHueIncrement;
  }
  mobileNavCloseHandler() {
    if (!this.isOptionsOpen) {
      this.optionsIconTop.classList.remove("options-icon-top-close");
      this.optionsIconBottom.classList.remove("options-icon-bottom-close");
      this.optionsContainer.classList.remove("options-container-closed");
    } else {
      this.optionsIconTop.classList.add("options-icon-top-close");
      this.optionsIconBottom.classList.add("options-icon-bottom-close");
      this.optionsContainer.classList.add("options-container-closed");
    }
  }
  onWheelHandler(e, element, increment, fixedTo) {
    if (e.wheelDeltaY > 0)
      element.value = (parseFloat(element.value) + increment).toFixed(fixedTo);
    if (e.wheelDeltaY < 0)
      element.value = (parseFloat(element.value) - increment).toFixed(fixedTo);
  }
}
class Player {
  constructor(x, y, mainHue, particleCount) {
    // Canvases & Contexts
    this.canvas;
    this.context;
    this.coinCanvas;
    this.coinContext;
    this.particleCanvas;
    this.particleContext;
    // Movement, Speed & Size
    this.x = x;
    this.y = y;
    this.radius = 9;
    this.velX = 0;
    this.velY = 0;
    this.angle = 0;
    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.particleArr = [];
    this.particlesCount = particleCount;
    // Stats
    this.maxScreenWidth = 2880;
    this.health = 10;
    this.damage = 1;
    this.accDefaultValue = 1.0;
    this.decelDefaultValue = 0.1;
    this.turnSpeedDefaultValue = 1.0;
    this.particleCountDefaultValue = 20;
    this.decel = 0.1;
    // Coins
    this.coinArr = [];
    this.coinScore = 0;
    // Color & Style
    this.hue = mainHue + 35;
    this.saturation = 90;
    this.brightness = 50;
    this.cornerRadius = 5;
    this.initCanvases();
  }
  initCanvases() {
    // Initialize Particle Canvas
    const particleCanvas = document.createElement("canvas");
    const particlectx = particleCanvas.getContext("2d");
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    particleCanvas.id = "canvas-particles";
    document.body.appendChild(particleCanvas);
    this.particleCanvas = particleCanvas;
    this.particleContext = particlectx;
    // Initialize Player Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-player";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = ctx;
    // Initialize Coin Canvas
    const coinCanvas = document.createElement("canvas");
    const coinCtx = coinCanvas.getContext("2d");
    coinCanvas.width = window.innerWidth;
    coinCanvas.height = window.innerHeight;
    coinCanvas.id = "canvas-coins";
    document.body.appendChild(coinCanvas);
    this.coinCanvas = coinCanvas;
    this.coinContext = coinCtx;
    // Initialize Screen Options
    userInterface.accInput.value = this.accDefaultValue;
    userInterface.decelInput.value = this.decelDefaultValue;
    userInterface.turnSpeedInput.value = this.turnSpeedDefaultValue;
    userInterface.particleCountInput.value = this.particleCountDefaultValue;
  }
  update(mouse) {
    const newAcc = userInterface.accInput.value;
    const newDecel = userInterface.decelInput.value;
    const newturnSpeed = userInterface.turnSpeedInput.value * 0.1;
    if (mouse.isMobileControl === true) {
      mouse.touchDiffX < -mouse.touchDeadzoneX ||
      mouse.touchDiffX > mouse.touchDeadzoneX
        ? (this.directionX = (mouse.touchDiffX / this.canvas.width) * 5)
        : (this.directionX = 0);
      mouse.touchDiffY < -mouse.touchDeadzoneY ||
      mouse.touchDiffY > mouse.touchDeadzoneY
        ? (this.directionY = -mouse.touchDiffY / (this.canvas.height * 0.1))
        : (this.directionY = 0);
      this.directionX > 1 && (this.directionX = 1);
      this.directionX < -1 && (this.directionX = -1);
      this.directionY > 1 && (this.directionY = 1);
      this.directionY < -1 && (this.directionY = -1);
    } else {
      this.directionX = this.right - this.left;
      this.directionY = this.up - this.down;
    }
    this.angle += this.directionX * newturnSpeed;
    this.velX +=
      Math.cos(this.angle) * this.directionY * newAcc - this.velX * newDecel;
    this.velY +=
      Math.sin(this.angle) * this.directionY * newAcc - this.velY * newDecel;
    this.x += this.velX / this.canvas.width;
    this.y += this.velY / this.canvas.height;
  }
  drawPlayer(mainHue) {
    const finalHue = mainHue + 35;
    body.style.background = `radial-gradient(circle at ${
      this.x * this.canvas.width
    }px ${this.y * this.canvas.height}px, hsl(${
      mainHue - 45
    }, 10%, 5%), hsl(205, 5%, 0%) 40%)`;
    this.context.save();
    this.context.translate(
      this.x * this.canvas.width,
      this.y * this.canvas.height
    );
    this.context.rotate(this.angle);
    this.context.fillStyle = `hsl(${finalHue},${this.saturation}%,${this.brightness}%)`;
    this.context.strokeStyle = `hsl(${finalHue},${this.saturation}%,${
      this.brightness * 0.7
    }%)`;
    this.context.lineWidth = 0.5;
    this.context.beginPath();
    // Nose point
    this.context.moveTo(this.radius, 0);
    // Bottom right point
    this.context.lineTo(-this.radius, this.radius * 0.9);
    // Bottom middle
    this.context.lineTo(-this.radius * 0.618, 0);
    // Bottom left point
    this.context.lineTo(-this.radius, -this.radius * 0.9);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
    this.context.restore();
  }
  animate(mouse, mainHue, particleCount) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particleContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.createParticle(particleCount);
    this.drawParticles(mainHue);
    this.drawPlayer(mainHue);
    this.createCoins();
    this.update(mouse);
    this.screenWrap();
  }
  createParticle(particleCount) {
    for (let i = 0; i < particleCount; i++) {
      this.particleArr.push(
        new Particle(
          this,
          this.x * this.canvas.width,
          this.y * this.canvas.height,
          getRandomRange(this.radius * 0.2, this.radius * 0.45),
          getRandomRange(this.radius * 0.15, this.radius * 0.2),
          this.angle,
          this.velX,
          this.velY
        )
      );
    }
  }
  drawParticles(mainHue) {
    for (let i = 0; i < this.particleArr.length; i++) {
      const particle = this.particleArr[i];
      particle.draw(mainHue);
      particle.update();
    }
  }
  createCoins() {
    if (this.coinArr.length == 0) {
      this.coinArr.push(
        new Coin(
          this.coinCanvas,
          this.coinContext,
          getRandomRange(0.1, 0.9),
          getRandomRange(0.1, 0.9),
          player.radius * 4
        )
      );
    }
  }
  drawCoins() {
    for (let i = 0; i < this.coinArr.length; i++) {
      const coin = this.coinArr[i];
      this.coinContext.clearRect(
        0,
        0,
        this.coinCanvas.width,
        this.coinCanvas.height
      );
      coin.draw();
    }
  }
  screenWrap() {
    const radiusX = this.radius / this.canvas.width;
    const radiusY = this.radius / this.canvas.height;
    if (this.x < -radiusX) {
      this.x = 1.0 + radiusX;
    }
    if (this.x > 1.0 + radiusX) {
      this.x = -radiusX;
    }
    if (this.y < -radiusY) {
      this.y = 1.0 + radiusY;
    }
    if (this.y > 1.0 + radiusY) {
      this.y = -radiusY;
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.particleCanvas.width = width;
    this.particleCanvas.height = height;
    this.coinCanvas.width = width;
    this.coinCanvas.height = height;
    for (let i = 0; i < this.coinArr; i++) {
      const coin = this.coinArr[i];
      coin.canvas = this.coinCanvas;
    }
  }
}
class Particle {
  constructor(player, x, y, radius, accel, angle, velX, velY) {
    this.player = player;
    this.context = this.player.particleContext;
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.normVel = this.velX * this.velX + this.velY * this.velY;
    this.accel = accel;
    this.decel = this.accel * 3;
    this.jiggle = 1.5;
    this.minThrottle = 0.1;
    this.radius = radius;
    this.hueAdjust = getRandomRange(-20, 20);
    this.saturation = getRandomRange(90, 100);
    this.brightness = getRandomRange(40, 55);
    this.alpha = 1;
    this.angle = angle;
    this.angleAdjust = Math.PI;
  }
  update() {
    if (this.alpha <= 0.001 || this.radius < 0.001) {
      this.player.particleArr.splice(this, 1);
    } else {
      this.x +=
        Math.cos(this.angle + this.angleAdjust) * this.accel +
        getRandomRange(-this.jiggle, this.jiggle);
      this.y +=
        Math.sin(this.angle + this.angleAdjust) * this.accel +
        getRandomRange(-this.jiggle, this.jiggle);
      this.radius *=
        this.radius >= this.player.radius * 2
          ? 1
          : getRandomRange(1.015, 1.025);
      this.alpha *=
        this.radius >= this.player.radius * 1.5
          ? getRandomRange(0.001, 0.99)
          : getRandomRange(0.8, 0.99);
      this.saturation *= getRandomRange(0.8, 0.99);
      this.accel *= getRandomRange(0.97, 0.99);
    }
  }
  draw(mainHue) {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.rotate(this.angle);
    this.context.fillStyle = `hsla(${mainHue + this.hueAdjust}, ${
      this.saturation
    }%, ${this.brightness}%, ${this.alpha})`;
    this.context.beginPath();
    this.context.arc(
      -this.player.radius,
      0,
      this.radius * 0.618,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }
}
class Coin {
  constructor(canvas, context, x, y, radius) {
    this.canvas = canvas;
    this.context = context;
    this.normalizedX = x;
    this.normalizedY = y;
    this.radius = radius;
    this.hue = 47;
    this.saturation = 100;
    this.brightness = 50;
    this.alpha = 1;
    this.counter = 0;
  }
  update;
  draw() {
    const x = this.normalizedX * this.canvas.width;
    const y = this.normalizedY * this.canvas.height;
    const radiusAdjust = this.radius * 0.25;
    const osc = Math.sin(this.counter);
    this.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
    this.context.beginPath();
    // CIRCLE SHAPE
    // this.context.moveTo((x - radiusAdjust) + (radiusAdjust * osc), y);
    // this.context.quadraticCurveTo((x - radiusAdjust) + (radiusAdjust * osc), y - this.radius, x, y - this.radius);
    // this.context.quadraticCurveTo((x + radiusAdjust) + (radiusAdjust * -osc), y - this.radius, (x + radiusAdjust) + (radiusAdjust * -osc), y);
    // this.context.quadraticCurveTo((x + radiusAdjust) + (radiusAdjust * -osc), y + this.radius, x, y + this.radius);
    // this.context.quadraticCurveTo((x - radiusAdjust) + (radiusAdjust * osc), y + this.radius, (x - radiusAdjust) + (radiusAdjust * osc), y);
    // DIAMOND SHAPE
    this.context.moveTo(x - radiusAdjust + radiusAdjust * osc, y);
    this.context.lineTo(x, y - this.radius * 0.5);
    this.context.lineTo(x + radiusAdjust + radiusAdjust * -osc, y);
    this.context.lineTo(x, y + this.radius * 0.5);
    this.context.lineTo(x + -radiusAdjust + radiusAdjust * osc, y);
    this.context.fill();
    this.context.closePath();
    this.counter += 0.05;
  }
}
class Star {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.normalizedX = (Math.random() * this.canvas.width) / this.canvas.width;
    this.normalizedY =
      (Math.random() * this.canvas.height) / this.canvas.height;
    this.radius =
      Math.random() > 0.5 ? getRandomRange(0.4, 0.6) : getRandomRange(0.3, 1.1);
    this.isShining = Math.random() > 0.9 || this.radius > 0.8 ? true : false;
    this.hue =
      Math.random() > 0.6 ? getRandomRange(0, 30) : getRandomRange(190, 220);
    this.saturation = this.isShining
      ? getRandomRange(30, 70)
      : getRandomRange(10, 40);
    this.brightness = getRandomRange(60, 90);
    this.alpha = getRandomRange(0.4, 0.95);
    this.counter = Math.random() * 10;
    this.counterIncrement = Math.random() * 0.05;
  }
  draw() {
    const osc = Math.sin(this.counter) * 0.7;
    this.context.fillStyle = `hsla(${this.hue}, ${
      this.saturation + osc * 50
    }%, ${this.brightness}%, ${this.isShining ? 1 + osc : this.alpha})`;
    this.context.beginPath();
    this.context.rect(
      this.normalizedX * this.canvas.width,
      this.normalizedY * this.canvas.height,
      this.radius,
      this.radius
    );
    this.context.fill();
    this.context.closePath();
    this.counter += this.counterIncrement;
  }
  resize(canvas) {
    this.canvas = canvas;
  }
}
class Stars {
  constructor() {
    this.canvas;
    this.context;
    this.starArr = [];
    this.starCount;
    this.initCanvas();
    this.createStars();
  }
  initCanvas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-stars";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = ctx;
  }
  createStars() {
    this.starArr = [];
    this.starCount = this.canvas.width * 1.5;
    for (let i = 0; i < this.starCount; i++) {
      this.starArr.push(new Star(this.canvas, this.context));
    }
    this.drawStars();
  }
  drawStars() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.starArr.length; i++) {
      const star = this.starArr[i];
      star.draw();
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.createStars();
  }
}
class Mouse {
  constructor(x, y, radius) {
    this.canvas;
    this.context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.touchstartX;
    this.touchstartY;
    this.touchDiffX = 0;
    this.touchDiffY = 0;
    this.touchDeadzoneX = 30;
    this.touchDeadzoneY = 20;
    this.isMobileControl = false;
    // color & style
    this.hue = 0;
    this.saturation = 80;
    this.brightness = 50;
    this.alpha = 1;
    this.cornerRadius = 5;
    this.shouldDraw = true;
    this.initCanvas();
  }
  initCanvas() {
    const mouseCanvas = document.createElement("canvas");
    const mouseCtx = mouseCanvas.getContext("2d");
    mouseCanvas.width = window.innerWidth;
    mouseCanvas.height = window.innerHeight;
    mouseCanvas.id = "canvas-mouse";
    document.body.appendChild(mouseCanvas);
    this.canvas = mouseCanvas;
    this.context = mouseCtx;
  }
  update(x, y) {
    this.x = x;
    this.y = y;
  }
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // current position
    if (this.shouldDraw) {
      this.context.fillStyle = `hsla(180,0%,0%,0.5)`;
      this.context.strokeStyle = `hsla(180,0%,100%,0.5)`;
      this.context.lineWidth = 1.5;
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
    }
    // start position
    if (this.touchstartX != this.x || this.touchstartY != this.y) {
      this.context.fillStyle = `hsla(180,0%,100%,0.05)`;
      this.context.strokeStyle = `hsla(180,0%,100%,0.1)`;
      this.context.lineWidth = 1.5;
      this.context.beginPath();
      this.context.arc(
        this.touchstartX,
        this.touchstartY,
        this.radius * 1.1,
        0,
        Math.PI * 2
      );
      this.context.stroke();
      this.context.fill();
      this.context.closePath();

      this.context.beginPath();
      this.context.moveTo(this.touchstartX, this.touchstartY);
      this.context.lineTo(this.x, this.y);
      this.context.stroke();
      this.context.closePath();
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

// Instantiate objects
const userInterface = new UserInterface();
const stars = new Stars();
const player = new Player(
  0.5,
  0.5,
  userInterface.mainHue,
  userInterface.particleCountInput.value
);
const mouse = new Mouse(0, 0, 10);

// Get random number from range
function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// MAIN FUNCTION ************************************************
function animate() {
  stars.drawStars();
  userInterface.updateNameColor();
  player.animate(
    mouse,
    userInterface.mainHue,
    userInterface.particleCountInput.value
  );
  // mouse.draw();
  // if (player.coinArr.length > 0) {
  //   player.drawCoins();
  // }
  userInterface.accLabel.innerHTML = `Acceleration: <span>${userInterface.accInput.value}</span>`;
  userInterface.decelLabel.innerHTML = `Deceleration: <span>${userInterface.decelInput.value}</span>`;
  userInterface.turnSpeedLabel.innerHTML = `TurnSpeed: <span>${userInterface.turnSpeedInput.value}</span>`;
  userInterface.particleCountLabel.innerHTML = `Particles: <span>${userInterface.particleCountInput.value}</span>`;
  requestAnimationFrame(animate);
}
animate();
