const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnPause = document.getElementById('pause');
const pauseIcon = document.getElementById('pause-icon');
const clear = document.getElementById('clear');
const zoomLabel = document.getElementById('zoom-label');
const zoom = document.getElementById('zoom');
zoom.min = '1';
zoom.max = '10';
zoom.step = '0.1';
zoom.value = '1.5';

let clickIndex = 0;

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
        this.minCellWidth = 35;
        this.zoomScalar = 0.08;
        this.zoom = zoom.value * this.zoomScalar;
        this.cellWidth = this.minCellWidth * this.zoom;
        this.cellHeight = this.cellWidth;
        this.columns = Math.ceil(this.width / this.cellWidth);
        this.rows = Math.ceil(this.height / this.cellHeight);
        this.gridArr = [];
        this.gridArrNext = [];
        this.buttonClicked = 0;
        this.isMouseDown = false;
        this.timeInterval = 1;
        this.isRunning = true;
        this.lifetimeCounter = 0;
        this.iterations = 100;
        this.initCanvas();
        this.initCanvasMesh();
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
    initCanvasMesh() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.id = 'canvas-grid-mesh';
        document.body.appendChild(canvas);
        this.canvasMesh = canvas;
        this.ctxMesh = ctx;
    }
    init() {
        this.lifetimeCounter = 0;
        this.gridArr = [];
        this.zoom = zoom.value * this.zoomScalar;
        this.cellWidth = this.minCellWidth * this.zoom;
        this.cellHeight = this.cellWidth;
        this.columns = Math.ceil(this.width / this.cellWidth);
        this.rows = Math.ceil(this.height / this.cellHeight);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.gridArr.push(new Cell(this, x, y, y * this.columns + x));
            }
        }
        this.gridArrNext = this.gridArr;
        pauseIcon.innerHTML = this.isRunning ? '&#9208;&#xfe0e;' : `&#9654;&#xfe0e;`;
        clickIndex = Math.floor(
            this.columns * Math.floor(this.rows * 0.5) + Math.floor(this.columns * 0.5)
        );
        console.log(this.gridArr);
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
        this.lifetimeCounter++;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.gridArr.length; i++) {
            const cell = this.gridArr[i];
            (cell.currentState !== 0 || cell.index === clickIndex) && cell.alpha > 0 && cell.draw();
        }
    }
    drawMesh() {
        this.ctxMesh.clearRect(0, 0, this.width, this.height);
        this.ctxMesh.strokeStyle = 'hsla(200,0%,10%, 0.2';
        this.ctxMesh.lineWidth = 1;
        for (let y = 0; y < this.rows; y++) {
            this.ctxMesh.beginPath();
            this.ctxMesh.moveTo(0, y * this.cellHeight);
            this.ctxMesh.lineTo(this.width, y * this.cellHeight);
            this.ctxMesh.stroke();
            this.ctxMesh.closePath();
        }
        for (let x = 0; x < this.columns; x++) {
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
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
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
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
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
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
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
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
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
            Math.floor(y / this.cellHeight) * this.columns + Math.floor(x / this.cellWidth);
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
    constructor(grid, x, y, index) {
        this.grid = grid;
        this.ctx = this.grid.ctx;
        this.index = index;
        this.populationDensity = 0.375;
        // Physics
        this.x = x;
        this.y = y;
        this.width = this.grid.cellWidth;
        this.height = this.grid.cellHeight;
        // State
        this.currentState = Math.random() < this.populationDensity ? 1 : 0;
        this.lifetimeCounter = 0;
        this.matureCounterLimit = 1500;
        this.lastTouchedCellState = 0;
        // Style
        this.hueStart = 220;
        this.hueRange = 180;
        this.hue = this.hueStart;
        this.hueChangeRate = 10;
        this.saturation = 80;
        this.brightness = 50;
        this.alpha = 1;
        // Neighbours
        this.neighbourTopLeft = 0;
        this.neighbourTopMid = 0;
        this.neighbourTopRight = 0;
        this.neighbourCenterLeft = 0;
        this.neighbourCenterRight = 0;
        this.neighbourBottomLeft = 0;
        this.neighbourBottomMid = 0;
        this.neighbourBottomRight = 0;
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
        // total neighbour value
        this.neighbourValue =
            this.neighbourTopLeft * this.neighbourTopLeftWeight +
            this.neighbourTopMid * this.neighbourTopMidWeight +
            this.neighbourTopRight * this.neighbourTopRightWeight +
            this.neighbourCenterLeft * this.neighbourCenterLeftWeight +
            this.neighbourCenterRight * this.neighbourCenterRightWeight +
            this.neighbourBottomLeft * this.neighbourBottomLeftWeight +
            this.neighbourBottomMid * this.neighbourBottomMidWeight +
            this.neighbourBottomRight * this.neighbourBottomRightWeight;
        // Rules
        // CONWAY RULES
        // this.aliveRuleConway = this.neighbourValue < 2 || this.neighbourValue > 3;
        // this.deadRuleConway = this.neighbourValue === 3;
        // this.populationDensity = 0.618;
        // CONWAY SPACESHIPS RULES
        // this.aliveRuleConway = this.neighbourValue < 2 || this.neighbourValue > 7;
        // this.deadRuleConway = this.neighbourValue === 2;
        // this.populationDensity = 0.501;
        // FIRE1 RULES
        // this.aliveRuleFire = this.neighbourValue === 5;
        // this.deadRuleFire = this.neighbourValue < 2 || this.neighbourValue > 3;
        // this.populationDensity = 0.51;
        // FIRE2 RULES
        // this.aliveRuleFire = this.neighbourValue === 5;
        // this.deadRuleFire = this.neighbourValue < 3 || this.neighbourValue > 5;
        // this.populationDensity = 0.55;
        // SYMMETRICAL ENTROPY RULES
        // this.aliveRuleFire = this.neighbourValue < 2 || this.neighbourValue > 3;
        // this.deadRuleFire = this.neighbourValue >= 3 && this.neighbourValue <= 4;
        // this.populationDensity = 0.52;
    }
    update(gridArrNext) {
        const minNum = this.neighbourWeightTotal * 0.5;
        const maxNum = this.neighbourWeightTotal * 0.5;
        if (this.neighbourValue < minNum) {
            gridArrNext[this.index].currentState = 0;
        } else if (this.neighbourValue > maxNum) {
            gridArrNext[this.index].currentState = 1;
        } else {
            gridArrNext[this.index].currentState = 1;
        }

        // switch (this.neighbourValue) {
        //     case 0:
        //         gridArrNext[this.index].currentState = 0;
        //         break;
        //     case 1:
        //         gridArrNext[this.index].currentState = 0;
        //         break;
        //     case 2:
        //         gridArrNext[this.index].currentState = 0;
        //         break;
        //     case 3:
        //         gridArrNext[this.index].currentState = 0;
        //         break;
        //     case 4:
        //         gridArrNext[this.index].currentState = 1;
        //         break;
        //     case 5:
        //         gridArrNext[this.index].currentState = 1;
        //         break;
        //     case 6:
        //         gridArrNext[this.index].currentState = 1;
        //         break;
        //     case 7:
        //         gridArrNext[this.index].currentState = 1;
        //         break;
        //     case 8:
        //         gridArrNext[this.index].currentState = 1;
        //         break;
        //     default:
        //         gridArrNext[this.index].currentState = 1;
        //         break;
        // }

        // if (this.currentState !== 0) {
        //     // Alive Rule ------------------------------------------------------------------------------------
        //     if (this.neighbourValue > 4) {
        //         gridArrNext[this.index].currentState = 0;
        //         // this.lifetimeCounter = 0;
        //         this.saturation = 90;
        //         this.brightness = 45;
        //     } else {
        //         grid.isRunning && this.lifetimeCounter++;
        //     }
        // } else {
        //     // this.lifetimeCounter = 0;
        //     // Dead Rule ------------------------------------------------------------------------------------
        //     if (this.neighbourValue < 4) {
        //         gridArrNext[this.index].currentState = 1;
        //     }
        // }
    }
    calcNeighbours(gridArr) {
        this.neighbourTopLeft = gridArr[this.index - this.grid.columns - 1]
            ? gridArr[this.index - this.grid.columns - 1].currentState
            : 1;
        this.neighbourTopMid = gridArr[this.index - this.grid.columns]
            ? gridArr[this.index - this.grid.columns].currentState
            : 1;
        this.neighbourTopRight = gridArr[this.index - this.grid.columns + 1]
            ? gridArr[this.index - this.grid.columns + 1].currentState
            : 1;
        this.neighbourCenterLeft = gridArr[this.index - 1]
            ? gridArr[this.index - 1].currentState
            : 1;
        this.neighbourCenterRight = gridArr[this.index + 1]
            ? gridArr[this.index + 1].currentState
            : 1;
        this.neighbourBottomLeft = gridArr[this.index + this.grid.columns - 1]
            ? gridArr[this.index + this.grid.columns - 1].currentState
            : 1;
        this.neighbourBottomMid = gridArr[this.index + this.grid.columns]
            ? gridArr[this.index + this.grid.columns].currentState
            : 1;
        this.neighbourBottomRight = gridArr[this.index + this.grid.columns + 1]
            ? gridArr[this.index + this.grid.columns + 1].currentState
            : 1;
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

    draw() {
        // const normCounter = (this.lifetimeCounter / this.matureCounterLimit) * this.hueChangeRate;
        // this.hue =
        //     this.hueStart - this.hueRange * normCounter < 0
        //         ? 0
        //         : this.hueStart - this.hueRange * normCounter;
        // this.hue =
        //     this.hueStart -
        //     (this.hueRange - this.hueRange * (this.neighbourValue / this.neighbourWeightTotal));
        this.hue = this.hueStart + grid.lifetimeCounter;
        const brightness =
            this.neighbourValue != 8 ? 100 * (this.neighbourValue / this.neighbourWeightTotal) : 50;

        // draw cells
        this.ctx.beginPath();
        this.index === clickIndex &&
            (this.ctx.strokeStyle = `hsla(${this.hue + 180},
                100%,
                50%,
                1)`);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%,${brightness}%, ${this.alpha})`;
        this.ctx.rect(this.x * this.width, this.y * this.height, this.width, this.height);
        this.ctx.fill();
        this.index === clickIndex && this.ctx.stroke();
        this.ctx.closePath();

        // if (this.saturation > 0 && normCounter >= 1 && grid.isRunning && this.index != clickIndex) {
        //     this.saturation -= 0.05;
        // }
        // if (
        //     this.brightness > 0 &&
        //     this.saturation <= 0.1 &&
        //     grid.isRunning &&
        //     this.index != clickIndex
        // ) {
        //     this.brightness -= 0.02;
        // }
    }
}

const grid = new Grid();

// Window Events
window.addEventListener('resize', (e) => {
    grid.resize(window.innerWidth, window.innerHeight);
});
// Mouse Events
window.addEventListener('mousedown', (e) => {
    if (e.button === 1) {
        clickIndex =
            Math.floor(e.clientY / grid.cellHeight) * grid.columns +
            Math.floor(e.clientX / grid.cellWidth);
        grid.draw();
    }
    grid.mouseDownHandler(e.clientX, e.clientY, e.button);
    window.onmousemove = (e) => grid.mouseMoveHandler(e.clientX, e.clientY, e.button, e);
    grid.canvas && grid.draw();
    console.log(grid.gridArr[clickIndex]);
});
window.addEventListener('mouseup', (e) => {
    window.onmousemove = null;
});
window.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        grid.timeInterval = grid.timeInterval + 10 <= 10000 ? grid.timeInterval + 10 : 10000;
        clearInterval(grid.engine);
        grid.engine = setInterval(mainApp, grid.timeInterval);
        document.getElementById('fps').innerText = `${
            grid.timeInterval <= 0 ? 1 : grid.timeInterval
        }`;
        return;
    }
    if (e.deltaY < 0) {
        grid.timeInterval = grid.timeInterval - 10 >= 0 ? grid.timeInterval - 10 : 0;
        clearInterval(grid.engine);
        grid.engine = setInterval(mainApp, grid.timeInterval);
        document.getElementById('fps').innerText = `${
            grid.timeInterval <= 0 ? 1 : grid.timeInterval
        }`;
        return;
    }
});

// Touch Events
window.addEventListener('touchstart', (e) => {
    console.log(e);
    if (e.targetTouches.length > 1) {
        clickIndex =
            Math.floor(e.targetTouches[0].clientY / grid.cellHeight) * grid.columns +
            Math.floor(e.targetTouches[0].clientX / grid.cellWidth);
        grid.draw();
    }
    grid.touchStartHandler(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    window.ontouchmove = (e) => {
        grid.touchMoveHandler(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    };
});
window.addEventListener('touchend', (e) => {
    window.ontouchmove = null;
});
// Btn Events
btnUp.addEventListener('mousedown', () => {
    grid.timeInterval = grid.timeInterval - 10 >= 0 ? grid.timeInterval - 10 : 0;
    clearInterval(grid.engine);
    grid.engine = setInterval(mainApp, grid.timeInterval);
    document.getElementById('fps').innerText = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;
});
btnDown.addEventListener('mousedown', () => {
    grid.timeInterval = grid.timeInterval + 10 <= 10000 ? grid.timeInterval + 10 : 10000;
    clearInterval(grid.engine);
    grid.engine = setInterval(mainApp, grid.timeInterval);
    document.getElementById('fps').innerText = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;
});
btnPause.addEventListener('mousedown', () => {
    grid.isRunning = !grid.isRunning;
    pauseIcon.innerHTML = grid.isRunning ? '&#9208;&#xfe0e;' : `&#9654;&#xfe0e;`;
});
clear.addEventListener('mousedown', () => {
    for (let i = 0; i < grid.gridArr.length; i++) {
        const cell = grid.gridArr[i];
        cell.currentState = 0;
    }
});

zoom.addEventListener('change', (e) => {
    grid.zoom = e.target.value * grid.zoomScalar;
    grid.init(grid.zoom);
});

grid.engine = setInterval(mainApp, grid.timeInterval);

window.addEventListener('keydown', (e) => {
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
                cell.currentState = 0;
            }
            break;
        case 'KeyW':
        case 'ArrowUp':
            grid.timeInterval = grid.timeInterval - 10 >= 0 ? grid.timeInterval - 10 : 0;
            clearInterval(grid.engine);
            grid.engine = setInterval(mainApp, grid.timeInterval);
            document.getElementById('fps').innerText = `${
                grid.timeInterval <= 0 ? 1 : grid.timeInterval
            }`;
            break;
        case 'KeyS':
        case 'ArrowDown':
            grid.timeInterval = grid.timeInterval + 10 <= 10000 ? grid.timeInterval + 10 : 10000;
            clearInterval(grid.engine);
            grid.engine = setInterval(mainApp, grid.timeInterval);
            document.getElementById('fps').innerText = `${
                grid.timeInterval <= 0 ? 1 : grid.timeInterval
            }`;

            break;
        default:
            break;
    }
});
function mainApp() {
    grid.canvas && grid.draw();
    // if (grid.canvasMesh && grid.cellWidth > 3.7) {
    //     grid.drawMesh();
    // } else {
    //     grid.ctxMesh.clearRect(0, 0, grid.canvasMesh.width, grid.canvasMesh.height);
    // }
    grid.calcNeighbours();
    if (grid.lifetimeCounter < grid.iterations && grid.isRunning) {
        grid.update();
    }
    zoomLabel.innerText = `Zoom: ${zoom.value}x`;
}
document.getElementById('fps').innerText = `${grid.timeInterval <= 0 ? 1 : grid.timeInterval}`;
