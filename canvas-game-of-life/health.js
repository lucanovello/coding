function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Grid {
    constructor() {
        this.canvas;
        this.ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.minColumns = 3 + (window.innerWidth / 1920) * 8;
        this.cellWidth =
            this.width * 0.001 > this.minColumns ? this.width * 0.001 : this.minColumns;
        this.cellHeight = this.cellWidth;
        this.columns = Math.ceil(this.width / this.cellWidth);
        this.rows = Math.ceil(this.height / this.cellHeight);
        this.gridArr = [];
        this.gridArrNext = [];
        this.buttonClicked = 0;
        this.clickHealthAmt = 50;
        this.isMouseDown = false;
        this.timeInterval = 0;
        this.isRunning = true;
        this.populationDensity = 1;
        this.initCanvas();
        this.init();
    }
    initCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.id = 'canvas-grid';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = ctx;
    }
    init() {
        this.gridArr = [];
        this.columns = Math.ceil(this.width / this.cellWidth);
        this.rows = Math.ceil(this.height / this.cellHeight);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.gridArr.push(
                    new Cell(
                        this,
                        x,
                        y,
                        y * this.columns + x,
                        Math.round(Math.random() * this.populationDensity)
                    )
                );
            }
        }
        this.gridArrNext = this.gridArr;
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
            cell.update(this.gridArrNext);
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.gridArr.length; i++) {
            const cell = this.gridArr[i];
            cell.health > 0 && cell.draw();
        }
    }

    mouseDownHandler(x, y, button = 0) {
        this.isMouseDown = true;
        this.buttonClicked = button;
        const index =
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
        switch (this.buttonClicked) {
            case 0:
            case 1:
                this.gridArr[index].health =
                    this.gridArr[index].health + this.clickHealthAmt >= 100
                        ? 100
                        : this.gridArr[index].health + this.clickHealthAmt;
                break;
            case 2:
                this.gridArr[index].health =
                    this.gridArr[index].health - this.clickHealthAmt >= 0
                        ? 0
                        : this.gridArr[index].health - this.clickHealthAmt;
                break;
            default:
                break;
        }
    }
    mouseMoveHandler(x, y) {
        const index =
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
        switch (this.buttonClicked) {
            case 0:
            case 1:
                this.gridArr[index].health =
                    this.gridArr[index].health + this.clickHealthAmt >= 100
                        ? 100
                        : this.gridArr[index].health + this.clickHealthAmt;
                break;
            case 2:
                this.gridArr[index].health =
                    this.gridArr[index].health - this.clickHealthAmt >= 0
                        ? 0
                        : this.gridArr[index].health - this.clickHealthAmt;
                break;
            default:
                break;
        }
    }
    mouseUpHandler(x, y) {
        this.isMouseDown = false;
        const index =
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
        switch (this.buttonClicked) {
            case 0:
            case 1:
                this.gridArr[index].health =
                    this.gridArr[index].health + this.clickHealthAmt >= 100
                        ? 100
                        : this.gridArr[index].health + this.clickHealthAmt;
                break;
            case 2:
                this.gridArr[index].health =
                    this.gridArr[index].health - this.clickHealthAmt >= 0
                        ? 0
                        : this.gridArr[index].health - this.clickHealthAmt;
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
        this.health = this.currentState > 0.5 ? 10 + Math.random() * 90 : 0;
        // Neighbours
        this.neighbourTopLeft = this.grid.gridArr[this.index - this.columns - 1]
            ? this.grid.gridArr[this.index - this.columns - 1].health
            : 0;
        this.neighbourTopMid = this.grid.gridArr[this.index - this.columns]
            ? this.grid.gridArr[this.index - this.columns].health
            : 0;
        this.neighbourTopRight = this.grid.gridArr[this.index - this.columns + 1]
            ? this.grid.gridArr[this.index - this.columns + 1].health
            : 0;
        this.neighbourCenterLeft = this.grid.gridArr[this.index - 1]
            ? this.grid.gridArr[this.index - 1].health
            : 0;
        this.neighbourCenterRight = this.grid.gridArr[this.index + 1]
            ? this.grid.gridArr[this.index + 1].health
            : 0;
        this.neighbourBottomLeft = this.grid.gridArr[this.index + this.columns - 1]
            ? this.grid.gridArr[this.index + this.columns - 1].health
            : 0;
        this.neighbourBottomMid = this.grid.gridArr[this.index + this.columns]
            ? this.grid.gridArr[this.index + this.columns].health
            : 0;
        this.neighbourBottomRight = this.grid.gridArr[this.index + this.columns + 1]
            ? this.grid.gridArr[this.index + this.columns + 1].health
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
        // Style
        this.hue = 140;
        // this.saturation = getRandomArbitrary(70, 90);
        // this.brightness = getRandomArbitrary(35, 50);
        // this.alpha = 1;
    }
    calcNeighbours(gridArr) {
        this.neighbourTopLeft = gridArr[this.index - this.grid.columns - 1]
            ? gridArr[this.index - this.grid.columns - 1].health
            : 0;
        this.neighbourTopMid = gridArr[this.index - this.grid.columns]
            ? gridArr[this.index - this.grid.columns].health
            : 0;
        this.neighbourTopRight = gridArr[this.index - this.grid.columns + 1]
            ? gridArr[this.index - this.grid.columns + 1].health
            : 0;
        this.neighbourCenterLeft = gridArr[this.index - 1] ? gridArr[this.index - 1].health : 0;
        this.neighbourCenterRight = gridArr[this.index + 1] ? gridArr[this.index + 1].health : 0;
        this.neighbourBottomLeft = gridArr[this.index + this.grid.columns - 1]
            ? gridArr[this.index + this.grid.columns - 1].health
            : 0;
        this.neighbourBottomMid = gridArr[this.index + this.grid.columns]
            ? gridArr[this.index + this.grid.columns].health
            : 0;
        this.neighbourBottomRight = gridArr[this.index + this.grid.columns + 1]
            ? gridArr[this.index + this.grid.columns + 1].health
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
    update(gridArrNext) {
        if (this.health > 100) {
            if (this.neighbourValue < 200 || this.neighbourValue > 300) {
                gridArrNext[this.index].health -= 1;
            }
        } else {
            if (this.neighbourValue > 200 && this.neighbourValue < 400) {
                gridArrNext[this.index].health += 10;
                // gridArrNext[this.index].currentState = 1;
            }
        }
    }
    draw() {
        // draw cells
        this.ctx.beginPath();
        this.ctx.fillStyle =
            this.health === 0
                ? 'white'
                : `hsla(${this.hue + 50 * (this.health / 100)},90%, 40%, ${this.health / 20})`;
        this.ctx.rect(this.x * this.width, this.y * this.height, this.width, this.height);
        this.ctx.fill();
        this.ctx.closePath();
    }
}

const grid = new Grid();

window.addEventListener('resize', (e) => {
    grid.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener('mousedown', (e) => {
    console.log(e);
    grid.mouseDownHandler(e.clientX, e.clientY, e.button);
    window.onmousemove = (e) => grid.mouseMoveHandler(e.clientX, e.clientY);
});
window.addEventListener('mouseup', (e) => {
    grid.mouseUpHandler(e.clientX, e.clientY);
    window.onmousemove = null;
});
window.addEventListener('touchstart', (e) => {
    grid.mouseDownHandler(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    window.ontouchmove = (e) => grid.mouseMoveHandler(e.clientX, e.clientY);
});
window.addEventListener('touchend', (e) => {
    window.ontouchmove = null;
});
window.addEventListener('contextmenu', (e) => e.preventDefault());

grid.engine = setInterval(mainApp, grid.timeInterval);

window.addEventListener('keydown', (e) => {
    console.log(e);
    switch (e.code) {
        case 'Space':
            grid.isRunning = !grid.isRunning;
            break;
        case 'Escape':
            grid.init();
            break;
        case 'Backquote':
            for (let i = 0; i < grid.gridArr.length; i++) {
                const cell = grid.gridArr[i];
                cell.health = 0;
            }
            break;
        case 'KeyW':
        case 'ArrowUp':
            grid.timeInterval = grid.timeInterval + 10 <= 10000 ? grid.timeInterval + 10 : 10000;
            clearInterval(grid.engine);
            grid.engine = setInterval(mainApp, grid.timeInterval);
            document.getElementById('fps').innerText = grid.timeInterval;
            break;
        case 'KeyS':
        case 'ArrowDown':
            grid.timeInterval = grid.timeInterval - 10 >= 0 ? grid.timeInterval - 10 : 0;
            clearInterval(grid.engine);
            grid.engine = setInterval(mainApp, grid.timeInterval);
            document.getElementById('fps').innerText = grid.timeInterval;
            break;
        default:
            break;
    }
});
function mainApp() {
    grid.isRunning && grid.calcNeighbours();
    grid.canvas && grid.draw();
    grid.isRunning && grid.update();
    console.log(grid.gridArr[0].health);
}
document.getElementById('fps').innerText = grid.timeInterval;
