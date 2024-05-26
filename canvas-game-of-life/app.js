const fps = document.getElementById("fps");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnUpIcon = document.getElementById("btn-up-icon");
const btnDownIcon = document.getElementById("btn-down-icon");
const btnPause = document.getElementById("pause");
const pauseIcon = document.getElementById("pause-icon");
const reset = document.getElementById("reset");
const clear = document.getElementById("clear");
const zoomLabel = document.getElementById("zoom-label");
const zoom = document.getElementById("zoom");

const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="white"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>`;
const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill="white"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
const btnUpSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="white"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>`;
const btnDownSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="white"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`;

btnUpIcon.innerHTML = btnUpSVG;
btnDownIcon.innerHTML = btnDownSVG;

zoom.min = "1";
zoom.max = "10";
zoom.step = "0.1";
zoom.value = "1.0";

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

class Grid {
  constructor() {
    this.canvas;
    this.ctx;
    this.canvasMesh;
    this.ctxMesh;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.populationDensity = 0.1;
    this.minCellWidth = 35;
    this.zoomScalar = 0.1;
    this.zoom = zoom.value * this.zoomScalar;
    this.cellWidth = this.minCellWidth * this.zoom;
    this.cellHeight = this.cellWidth;
    this.columns = Math.ceil(this.width / this.cellWidth);
    this.rows = Math.ceil(this.height / this.cellHeight);
    this.gridArr = [];
    this.gridArrPrevStates = [];
    this.buttonClicked = 0;
    this.isMouseDown = false;
    this.timeInterval = 35;
    this.minTimeInterval = 0;
    this.maxTimeInterval = 1000;
    this.isRunning = true;
    this.lifetimeCounter = 0;
    this.iterations = 0; // 0 is infinity;
    this.initClickIndex = Math.floor(
      this.columns * Math.floor(this.rows * 0.5) +
        Math.floor(this.columns * 0.5)
    );
    this.clickIndex = this.initClickIndex;
    this.initCanvas();
    this.initCanvasMesh();
    this.init();
  }
  initCanvas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = "canvas-grid";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = ctx;
  }
  initCanvasMesh() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = "canvas-grid-mesh";
    document.body.appendChild(canvas);
    this.canvasMesh = canvas;
    this.ctxMesh = ctx;
  }
  init() {
    this.lifetimeCounter = 0;
    this.gridArr = [];
    this.gridArrPrevStates = [];
    this.zoom = zoom.value * this.zoomScalar;
    this.cellWidth = this.minCellWidth * this.zoom;
    this.cellHeight = this.cellWidth;
    this.columns = Math.ceil(this.width / this.cellWidth);
    this.rows = Math.ceil(this.height / this.cellHeight);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const index = y * this.columns + x;
        const state = Math.random() < this.populationDensity ? 1 : 0;
        this.gridArr.push(new Cell(this, x, y, index, state));
        this.gridArrPrevStates.push(state);
      }
    }

    pauseIcon.innerHTML = this.isRunning ? pauseSVG : playSVG;
    this.clickIndex = Math.floor(
      this.columns * Math.floor(this.rows * 0.5) +
        Math.floor(this.columns * 0.5)
    );
  }
  calcNeighbours() {
    for (let i = 0; i < this.gridArr.length; i++) {
      const cell = this.gridArr[i];
      cell.calcNeighbours(this.gridArr);
    }
  }
  update() {
    for (let i = 0; i < this.gridArr.length; i++) {
      const cell = this.gridArr[i];
      cell.update(this.gridArrPrevStates);
    }
    this.lifetimeCounter++;
  }
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.gridArr.length; i++) {
      const cell = this.gridArr[i];
      if (
        (cell.currentState !== 0 && cell.alpha > 0) ||
        (cell.currentState === 0 && this.gridArrPrevStates[i] === 1) ||
        cell.index === this.clickIndex
      ) {
        cell.draw(this.gridArrPrevStates[i]);
      }
    }
  }
  drawMesh() {
    const gridStep1 = 0.125;
    const gridStep2 = 0.25;
    this.ctxMesh.clearRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 1;
    for (let y = 0; y < this.rows; y++) {
      this.ctxMesh.strokeStyle =
        y % Math.floor(this.rows / (this.rows * gridStep1)) === 0
          ? "hsla(200,0%,20%, 0.5)"
          : y % Math.floor(this.rows / (this.rows * gridStep2)) === 0
          ? "hsla(200,0%,35%, 0.3)"
          : "hsla(200,0%,50%, 0.1)";
      this.ctxMesh.beginPath();
      this.ctxMesh.moveTo(0, y * this.cellHeight);
      this.ctxMesh.lineTo(this.width, y * this.cellHeight);
      this.ctxMesh.stroke();
      this.ctxMesh.closePath();
    }
    for (let x = 0; x < this.columns; x++) {
      this.ctxMesh.strokeStyle =
        x % Math.floor(this.rows / (this.rows * gridStep1)) === 0
          ? "hsla(200,0%,20%, 0.5)"
          : x % Math.floor(this.rows / (this.rows * gridStep2)) === 0
          ? "hsla(200,0%,35%, 0.3)"
          : "hsla(200,0%,50%, 0.1)";
      this.ctxMesh.beginPath();
      this.ctxMesh.moveTo(x * this.cellWidth, 0);
      this.ctxMesh.lineTo(x * this.cellWidth, this.height);
      this.ctxMesh.stroke();
      this.ctxMesh.closePath();
    }
  }
  touchStartHandler(x, y) {
    this.isMouseDown = true;
    const index =
      Math.floor(y / this.cellHeight) * this.columns +
      Math.floor(x / this.cellWidth);
    this.lastTouchedCellState = this.gridArr[index].currentState;
    switch (this.lastTouchedCellState) {
      case 0:
        this.gridArr[index].currentState = 1;
        break;
      case 1:
        this.gridArr[index].currentState = 0;
        break;

      default:
        break;
    }
  }
  touchMoveHandler(x, y) {
    this.isMouseDown = true;
    const index =
      Math.floor(y / this.cellHeight) * this.columns +
      Math.floor(x / this.cellWidth);
    switch (this.lastTouchedCellState) {
      case 0:
        this.gridArr[index].currentState = 1;
        break;
      case 1:
        this.gridArr[index].currentState = 0;
        break;
      default:
        break;
    }
  }
  mouseDownHandler(x, y, button = 0) {
    this.isMouseDown = true;
    this.buttonClicked = button;
    const index =
      Math.floor(y / this.cellHeight) * this.columns +
      Math.floor(x / this.cellWidth);
    switch (this.buttonClicked) {
      case 0:
        this.gridArr[index].currentState = 1;
        break;
      case 2:
        this.gridArr[index].currentState = 0;
        break;

      default:
        break;
    }
  }
  mouseMoveHandler(x, y) {
    const index =
      Math.floor(y / this.cellHeight) * this.columns +
      Math.floor(x / this.cellWidth);
    switch (this.buttonClicked) {
      case 0:
        this.gridArr[index].currentState = 1;
        break;
      case 2:
        this.gridArr[index].currentState = 0;
        break;

      default:
        break;
    }
  }
  mouseUpHandler(x, y) {
    this.isMouseDown = false;
    const index =
      Math.floor(y / this.cellHeight) * this.columns +
      Math.floor(x / this.cellWidth);
    switch (this.buttonClicked) {
      case 0:
        this.gridArr[index].currentState = 1;
        break;
      case 2:
        this.gridArr[index].currentState = 0;
        break;

      default:
        break;
    }
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvasMesh.width = this.width;
    this.canvasMesh.height = this.height;
    this.init();
  }
}

class Cell {
  constructor(grid, x, y, index, currentState) {
    this.grid = grid;
    this.ctx = this.grid.ctx;
    this.index = index;
    // Physics
    this.x = x;
    this.y = y;
    this.width = this.grid.cellWidth;
    this.height = this.grid.cellHeight;
    // State
    this.currentState = currentState;
    this.lifetimeCounter = 0;
    this.matureCounterLimit = 1500;
    this.lastTouchedCellState = 0;
    // Style
    this.hueStart = 200;
    this.hueRange = 120;
    this.minHue = this.hueStart - this.hueRange;
    this.hue = this.hueStart;
    this.hueChangeRate = 2;
    this.saturation = 90;
    this.brightnessStart = 100;
    this.brightness = this.brightnessStart;
    this.alpha = 1;
    // Neighbours
    // neighbour weights
    this.neighbourTopLeftWeight = 1;
    this.neighbourTopMidWeight = 1;
    this.neighbourTopRightWeight = 1;
    this.neighbourCenterLeftWeight = 1;
    this.neighbourCenterRightWeight = 1;
    this.neighbourBottomLeftWeight = 1;
    this.neighbourBottomMidWeight = 1;
    this.neighbourBottomRightWeight = 1;
    this.neighbourWeightTotal =
      this.neighbourTopLeftWeight +
      this.neighbourTopMidWeight +
      this.neighbourTopRightWeight +
      this.neighbourCenterLeftWeight +
      this.neighbourCenterRightWeight +
      this.neighbourBottomLeftWeight +
      this.neighbourBottomMidWeight +
      this.neighbourBottomRightWeight;
    // neighbour values
    this.neighbourTopLeft = 0;
    this.neighbourTopMid = 0;
    this.neighbourTopRight = 0;
    this.neighbourCenterLeft = 0;
    this.neighbourCenterRight = 0;
    this.neighbourBottomLeft = 0;
    this.neighbourBottomMid = 0;
    this.neighbourBottomRight = 0;
    this.neighbourValue =
      this.neighbourTopLeft * this.neighbourTopLeftWeight +
      this.neighbourTopMid * this.neighbourTopMidWeight +
      this.neighbourTopRight * this.neighbourTopRightWeight +
      this.neighbourCenterLeft * this.neighbourCenterLeftWeight +
      this.neighbourCenterRight * this.neighbourCenterRightWeight +
      this.neighbourBottomLeft * this.neighbourBottomLeftWeight +
      this.neighbourBottomMid * this.neighbourBottomMidWeight +
      this.neighbourBottomRight * this.neighbourBottomRightWeight;
  }
  calcNeighbours(gridArr) {
    this.neighbourTopLeft = gridArr[this.index - this.grid.columns - 1]
      ? gridArr[this.index - this.grid.columns - 1].currentState *
        this.neighbourTopLeftWeight
      : 0;
    this.neighbourTopMid = gridArr[this.index - this.grid.columns]
      ? gridArr[this.index - this.grid.columns].currentState *
        this.neighbourTopMidWeight
      : 0;
    this.neighbourTopRight = gridArr[this.index - this.grid.columns + 1]
      ? gridArr[this.index - this.grid.columns + 1].currentState *
        this.neighbourTopRightWeight
      : 0;
    this.neighbourCenterLeft = gridArr[this.index - 1]
      ? gridArr[this.index - 1].currentState * this.neighbourCenterLeftWeight
      : 0;
    this.neighbourCenterRight = gridArr[this.index + 1]
      ? gridArr[this.index + 1].currentState * this.neighbourCenterRightWeight
      : 0;
    this.neighbourBottomLeft = gridArr[this.index + this.grid.columns - 1]
      ? gridArr[this.index + this.grid.columns - 1].currentState *
        this.neighbourBottomLeftWeight
      : 0;
    this.neighbourBottomMid = gridArr[this.index + this.grid.columns]
      ? gridArr[this.index + this.grid.columns].currentState *
        this.neighbourBottomMidWeight
      : 0;
    this.neighbourBottomRight = gridArr[this.index + this.grid.columns + 1]
      ? gridArr[this.index + this.grid.columns + 1].currentState *
        this.neighbourBottomRightWeight
      : 0;
    this.neighbourValue =
      this.neighbourTopLeft +
      this.neighbourTopMid +
      this.neighbourTopRight +
      this.neighbourCenterLeft +
      this.neighbourCenterRight +
      this.neighbourBottomLeft +
      this.neighbourBottomMid +
      this.neighbourBottomRight;
  }
  update(gridArrPrevStates) {
    // RULES ============================================================================================================================================================================
    // CONWAY RULES --------------------------------------------------------------------------------------------------------------------------------------------------
    // this.aliveRuleConway = this.neighbourValue < 2 || this.neighbourValue > 3
    // this.deadRuleConway = this.neighbourValue === 3
    // this.populationDensity = 0.618;
    // CONWAY SPACESHIPS RULES ---------------------------------------------------------------------------------------------------------------------------------------
    // this.aliveRuleConway = this.neighbourValue < 2 || this.neighbourValue > 7
    // this.deadRuleConway = this.neighbourValue === 2
    // this.populationDensity = 0.501;
    // FIRE1 RULES ---------------------------------------------------------------------------------------------------------------------------------------------------
    // this.aliveRuleFire = this.neighbourValue === 5
    // this.deadRuleFire = this.neighbourValue < 2 || this.neighbourValue > 3
    // this.populationDensity = 0.51;
    // FIRE2 RULES ----------------------------------------------------------------------------------------------------------------------------------------------------
    // this.aliveRuleFire = this.neighbourValue === 5
    // this.deadRuleFire = this.neighbourValue < 3 || this.neighbourValue > 5
    // this.populationDensity = 0.55;
    // SYMMETRICAL ENTROPY RULES --------------------------------------------------------------------------------------------------------------------------------------
    // this.aliveRuleFire = this.neighbourValue < 2 || this.neighbourValue > 3
    // this.deadRuleFire = this.neighbourValue >= 3 && this.neighbourValue <= 4
    // this.populationDensity = 0.52;
    // RULES ============================================================================================================================================================================
    gridArrPrevStates[this.index] = this.currentState;
    if (this.currentState !== 0) {
      // Alive Rule ------------------------------------------------------------------------------------
      if (this.neighbourValue < 2 || this.neighbourValue > 3) {
        this.currentState = 0;
        this.lifetimeCounter = 0;
      }
      this.lifetimeCounter++;
    } else {
      // Dead Rule ------------------------------------------------------------------------------------
      this.lifetimeCounter = 0;
      if (this.neighbourValue === 3) {
        this.currentState = 1;
      }
    }
  }
  draw(prevState) {
    const hue =
      this.hueStart -
        this.hueRange *
          (this.lifetimeCounter / this.matureCounterLimit) *
          this.hueChangeRate <
      this.minHue
        ? this.minHue
        : this.hueStart -
          this.hueRange *
            (this.lifetimeCounter / this.matureCounterLimit) *
            this.hueChangeRate;
    // this.hue =
    //     this.hueStart -
    //     (this.hueRange - this.hueRange * (this.neighbourValue / this.neighbourWeightTotal));
    const alpha = this.currentState === 0 && prevState === 1 ? 0.0 : this.alpha;
    const sat =
      this.currentState === 0 && prevState === 1
        ? this.saturation * 0.7
        : this.saturation;
    const brightness = this.currentState === 0 && prevState === 1 ? 40 : 50;
    // this.hue = this.hueStart + this.lifetimeCounter * 0.5;
    // this.brightness =
    //     this.neighbourValue != 8
    //         ? this.brightnessStart * (this.neighbourValue / this.neighbourWeightTotal)
    //         : this.brightnessStart;

    // draw cells
    this.ctx.beginPath();
    this.ctx.fillStyle = `hsla(${hue}, ${sat}%,${brightness}%, ${alpha})`;
    this.ctx.rect(
      this.x * this.width,
      this.y * this.height,
      this.width,
      this.height
    );
    if (
      this.index != grid.clickIndex ||
      (this.index === grid.clickIndex &&
        (this.currentState != 0 || prevState != 0))
    ) {
      this.ctx.fill();
    }
    if (this.index === grid.clickIndex && window.innerWidth >= 1250) {
      this.ctx.strokeStyle = `hsla(${this.hue + 180},
                100%,
                50%,
                1)`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }
}

const grid = new Grid();

// EVENT LISTENERS **************************************************************************************************************************************************************************
// Window Events
window.addEventListener("resize", (e) => {
  grid.resize(window.innerWidth, window.innerHeight);
});
// Mouse Events
window.addEventListener("mousedown", (e) => {
  if (e.button === 1) {
    grid.clickIndex =
      Math.floor(e.clientY / grid.cellHeight) * grid.columns +
      Math.floor(e.clientX / grid.cellWidth);
  }
  grid.mouseDownHandler(e.clientX, e.clientY, e.button);
  grid.canvas && grid.draw();
  window.onmousemove = (e) =>
    grid.mouseMoveHandler(e.clientX, e.clientY, e.button, e);
});
window.addEventListener("mouseup", (e) => {
  window.onmousemove = null;
});
window.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    grid.timeInterval =
      grid.timeInterval + 10 <= grid.maxTimeInterval
        ? grid.timeInterval + 10
        : grid.maxTimeInterval;
    clearInterval(grid.engine);
    grid.engine = setInterval(mainApp, grid.timeInterval);
    fps.value = grid.timeInterval <= 0 ? 1 : grid.timeInterval;
  }
  if (e.deltaY < 0) {
    grid.timeInterval =
      grid.timeInterval - 10 >= grid.minTimeInterval
        ? grid.timeInterval - 10
        : grid.minTimeInterval;
    clearInterval(grid.engine);
    grid.engine = setInterval(mainApp, grid.timeInterval);
    fps.value = grid.timeInterval <= 0 ? 1 : grid.timeInterval;
  }
});
window.addEventListener("contextmenu", (e) => e.preventDefault());
// Touch Events
window.addEventListener("touchstart", (e) => {
  if (e.targetTouches.length > 1) {
    grid.clickIndex =
      Math.floor(e.targetTouches[0].clientY / grid.cellHeight) * grid.columns +
      Math.floor(e.targetTouches[0].clientX / grid.cellWidth);
    grid.draw();
  }
  grid.touchStartHandler(
    e.changedTouches[0].clientX,
    e.changedTouches[0].clientY
  );
  window.ontouchmove = (e) => {
    grid.touchMoveHandler(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
  };
});
window.addEventListener("touchend", (e) => {
  window.ontouchmove = null;
});
// Btn Events
btnUp.addEventListener("mousedown", () => {
  grid.timeInterval =
    grid.timeInterval - 10 >= grid.minTimeInterval
      ? grid.timeInterval - 10
      : grid.minTimeInterval;
  clearInterval(grid.engine);
  grid.engine = setInterval(mainApp, grid.timeInterval);
  fps.value = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;
});
btnDown.addEventListener("mousedown", () => {
  grid.timeInterval =
    grid.timeInterval + 10 <= grid.maxTimeInterval
      ? grid.timeInterval + 10
      : grid.maxTimeInterval;
  clearInterval(grid.engine);
  grid.engine = setInterval(mainApp, grid.timeInterval);
  fps.value = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;
});
btnPause.addEventListener("mousedown", pauseHandler);
reset.addEventListener("mousedown", resetHandler);
clear.addEventListener("mousedown", clearHandler);
// Zoom Events
zoom.addEventListener("change", (e) => {
  grid.zoom = e.target.value * grid.zoomScalar;
  grid.init();
});
fps.addEventListener("change", (e) => {
  const value =
    parseInt(e.target.value) <= grid.minTimeInterval ||
    !parseInt(e.target.value)
      ? grid.minTimeInterval
      : parseInt(e.target.value) >= grid.maxTimeInterval
      ? grid.maxTimeInterval
      : parseInt(e.target.value);
  fps.value = value;
  grid.timeInterval = value;
  clearInterval(grid.engine);
  grid.engine = setInterval(mainApp, grid.timeInterval);
});
// Key Events
window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      pauseHandler();
      break;
    case "Escape":
      resetHandler();
      break;
    case "Backquote":
      clearHandler();
      break;
    case "KeyW":
    case "ArrowUp":
      grid.timeInterval =
        grid.timeInterval - 10 >= minTimeInterval
          ? grid.timeInterval - 10
          : minTimeInterval;
      clearInterval(grid.engine);
      grid.engine = setInterval(mainApp, grid.timeInterval);
      fps.value = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;
      break;
    case "KeyS":
    case "ArrowDown":
      grid.timeInterval =
        grid.timeInterval + 10 <= maxTimeInterval
          ? grid.timeInterval + 10
          : maxTimeInterval;
      clearInterval(grid.engine);
      grid.engine = setInterval(mainApp, grid.timeInterval);
      fps.value = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;

      break;
    default:
      break;
  }
});

function clearHandler() {
  for (let i = 0; i < grid.gridArr.length; i++) {
    const cell = grid.gridArr[i];
    cell.currentState = 0;
    grid.gridArrPrevStates[i] = 0;
  }
}

function resetHandler() {
  grid.init();
}

function pauseHandler() {
  grid.isRunning = !grid.isRunning;
  pauseIcon.innerHTML = grid.isRunning ? pauseSVG : playSVG;
}

// Main Function
function mainApp() {
  if (grid.canvasMesh && grid.cellWidth > 3.7) {
    grid.drawMesh();
  } else {
    grid.ctxMesh.clearRect(0, 0, grid.canvasMesh.width, grid.canvasMesh.height);
  }

  grid.canvas && grid.draw();
  if (grid.isRunning) {
    if (grid.iterations === 0 || grid.lifetimeCounter < grid.iterations) {
      grid.calcNeighbours();
      grid.update();
    }
  }
  zoomLabel.innerText =
    window.innerWidth > 800 ? `Zoom: ${zoom.value}x` : `${zoom.value}x`;
}

// Engine
grid.engine = setInterval(mainApp, grid.timeInterval);

fps.value = grid.timeInterval;
