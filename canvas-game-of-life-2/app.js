class Grid {
  constructor(
    x = 0,
    y = 0,
    width = window.innerWidth,
    height = window.innerHeight,
    cellSize = 6
  ) {
    // CANVAS ---------------------------------
    this.canvas;
    this.ctx;
    // GRID -----------------------------------
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.cellDensity = 0.9;
    this.rows = Math.ceil(this.height / this.cellSize);
    this.cols = Math.ceil(this.width / this.cellSize);
    this.totalCells = this.rows * this.cols;
    this.cellsArr = [];
    this.nextCellsArr = [];
    this.init();
  }
  init() {
    this.initGrid();
    this.initCanvas();
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
  initGrid() {
    for (let i = 0; i < this.totalCells; i++) {
      const x = i % this.cols;
      const y = Math.floor(i / this.cols);
      const cell = new Cell(
        x,
        y,
        this.cellSize,
        Math.random() > this.cellDensity ? 1 : 0
      );
      this.cellsArr.push(cell);
    }
  }
  update() {
    this.calcNeighbors();
    this.updateCells();
  }
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.cellsArr.forEach((cell) => {
      cell.draw(this.ctx);
    });
  }

  calcNeighbors() {
    this.cellsArr.forEach((cell, i) => {
      let tl = this.cellsArr[cell.y * this.rows + cell.x - 1];
      let tm = this.cellsArr[cell.y * this.rows + cell.x];
      let tr = this.cellsArr[cell.y * this.rows + cell.x + 1];
      let ml = this.cellsArr[cell.y * this.rows + cell.x - this.rows];
      let mr = this.cellsArr[cell.y * this.rows + cell.x + this.rows];
      let bl = this.cellsArr[cell.y * this.rows + cell.x - 1 - this.rows];
      let bm = this.cellsArr[cell.y * this.rows + cell.x - this.rows];
      let br = this.cellsArr[cell.y * this.rows + cell.x + 1 - this.rows];
      if (cell.y === 0) {
        if (cell.x === 0) {
          tl = this.cellsArr[this.totalCells - 1];
          tm = this.cellsArr[this.rows - 1 + cell.x];
          tr = this.cellsArr[this.rows + cell.x];
          ml = this.cellsArr[this.cols - 1];
          mr = this.cellsArr[i + 1];
          bl = this.cellsArr[(this.cols - 1) * 2];
          bm = this.cellsArr[this.cols - 1 + cell.x];
          br = this.cellsArr[this.cols + cell.x];
        } else if (cell.x === this.cols - 1) {
          tr = this.cellsArr[this.rows - 1];
          tm = this.cellsArr[this.totalCells - 1];
          tl = this.cellsArr[this.totalCells - 2];
          ml = this.cellsArr[i - 1];
          mr = this.cellsArr[0];
          bl = this.cellsArr[this.cols - 1 + cell.x];
          bm = this.cellsArr[this.cols + cell.x];
          br = this.cellsArr[this.cols];
        } else {
          tl = this.cellsArr[this.rows - 1 + (cell.x - 1)];
          tm = this.cellsArr[this.rows - 1 + cell.x];
          tr = this.cellsArr[this.rows - 1 + (cell.x + 1)];
          ml = this.cellsArr[i - 1];
          ml = this.cellsArr[i + 1];
          bl = this.cellsArr[(this.cols - 1) * 2 + cell.x];
          bm = this.cellsArr[this.cols - 1 + cell.x];
          br = this.cellsArr[this.cols - 1 + (cell.x + 1)];
        }
      } else if (cell.y === this.rows - 1) {
        if (cell.x === 0) {
          tl = this.cellsArr[this.totalCells - this.cols];
          tm = this.cellsArr[this.totalCells - this.cols + cell.x];
          tr = this.cellsArr[this.totalCells - this.cols + (cell.x + 1)];
          ml = this.cellsArr[this.totalCells - 1];
          mr = this.cellsArr[i + 1];
          bl = this.cellsArr[this.cols - 1];
          bm = this.cellsArr[0];
          br = this.cellsArr[1];
        } else if (cell.x === this.cols - 1) {
          tl = this.cellsArr[i - this.cols - 1];
          tm = this.cellsArr[i - this.cols];
          tr = this.cellsArr[i - this.cols * 2 + 1];
          ml = this.cellsArr[i - 1];
          mr = this.cellsArr[i - this.cols + 1];
          bl = this.cellsArr[this.cols - 2];
          bm = this.cellsArr[this.cols - 1];
          br = this.cellsArr[0];
        } else {
          tl = this.cellsArr[i - this.cols - 1];
          tm = this.cellsArr[i - this.cols];
          tr = this.cellsArr[i - this.cols + 1];
          ml = this.cellsArr[i - 1];
          mr = this.cellsArr[i + 1];
          bl = this.cellsArr[cell.x - 1];
          bm = this.cellsArr[cell.x];
          br = this.cellsArr[cell.x + 1];
        }
      } else if (cell.x === 0) {
        tl = this.cellsArr[i - 1];
        tm = this.cellsArr[i + this.cols - 1];
        tr = this.cellsArr[i + this.cols];
        ml = this.cellsArr[i + this.cols];
        mr = this.cellsArr[i + 1];
        bl = this.cellsArr[i + this.cols - 1];
        bm = this.cellsArr[i + this.cols];
        br = this.cellsArr[i + this.cols + 1];
      } else if (cell.x === this.cols - 1) {
        tl = this.cellsArr[i - this.cols - 1];
        tm = this.cellsArr[i - this.cols];
        tr = this.cellsArr[i - this.cols * 2 + 1];
        ml = this.cellsArr[i - 1];
        mr = this.cellsArr[i - this.cols + 1];
        bl = this.cellsArr[i + this.cols - 1];
        bm = this.cellsArr[i + this.cols];
        br = this.cellsArr[i + 1];
      } else {
        tl = this.cellsArr[i - this.cols - 1];
        tm = this.cellsArr[i - this.cols];
        tr = this.cellsArr[i - this.cols + 1];
        ml = this.cellsArr[i - 1];
        mr = this.cellsArr[i + 1];
        bl = this.cellsArr[i + this.cols - 1];
        bm = this.cellsArr[i + this.cols];
        br = this.cellsArr[i + this.cols + 1];
      }

      const neighbors = [tl, tm, tr, ml, mr, bl, bm, br];

      neighbors.forEach((neighbor) => {
        if (neighbor.state > 0) {
          cell.neighborCount += neighbor.state;
        }
      });
    });
  }
  updateCells() {
    this.cellsArr.forEach((cell) => {
      cell.update();
    });
  }
}

class Cell {
  constructor(x, y, size, state = Math.random() > 0.5 ? 1 : 0) {
    // POSITION --------------------------------
    this.x = x;
    this.y = y;
    this.size = size;
    // STATE -----------------------------------
    this.aliveMin = 2;
    this.aliveMax = 3;
    this.deadMin = 3;
    this.deadMax = 3;
    this.minState = 0;
    this.maxState = 1;
    this.state = state;
    this.neighborCount = 0;

    // STYLE -----------------------------------
    this.hue = 200;
    this.saturation = 100;
    this.lightness = 50;
    this.alpha = 1;
    this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.state})`;
  }
  update() {
    if (this.state === 1) {
      if (
        this.neighborCount < this.aliveMin ||
        this.neighborCount > this.aliveMax
      ) {
        this.state = 0;
      }
    } else {
      if (this.neighborCount === this.deadMin) {
        this.state = 1;
      }
    }
    this.neighborCount = 0;
  }
  draw(ctx) {
    this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.state})`;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    ctx.closePath();
  }
}

function getRandomFromRange(min, max) {
  return Math.random() * (max - min) + min;
}
const grid = new Grid();

function main() {
  grid.draw();
  grid.update();
}

setInterval(main, 1);
