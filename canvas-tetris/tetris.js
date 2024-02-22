// Main Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Shapes Canvas
const shapeCanvas = document.getElementById('canvas-shapes');
const shapeCtx = shapeCanvas.getContext('2d');
shapeCanvas.width = window.innerWidth;
shapeCanvas.height = window.innerHeight;

class Controller {
    constructor() {
        this.up = 0;
        this.down = 0;
        this.left = 0;
        this.right = 0;
        this.directionX = this.down - this.up;
        this.directionY = this.right - this.left;
    }
    update() {
        this.directionY = this.down - this.up;
    }
    keydownHandler(e) {
        switch (e.code) {
            case 'KeyW':
                this.up = 1;
                break;
            case 'KeyS':
                this.down = 1;
                break;
            case 'KeyA':
                this.left = 1;
                break;
            case 'KeyD':
                this.right = 1;
                break;
            default:
                break;
        }
        console.log(e);
        this.directionX = this.right - this.left;
    }
    keyupHandler(e) {
        switch (e.code) {
            case 'KeyW':
                this.up = 0;
                break;
            case 'KeyS':
                this.down = 0;
                break;
            case 'KeyA':
                this.left = 0;
                break;
            case 'KeyD':
                this.right = 0;
                break;
            default:
                break;
        }
        this.directionX = this.right - this.left;
    }
}
const controller = new Controller();

class Cell {
    constructor(canvas, context, x, y, size, isAlive = false, originX, originY) {
        this.canvas = canvas;
        this.context = context;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lineWidth = 1;
        this.isAlive = isAlive;
        this.originX = originX;
        this.originY = originY;
    }

    draw() {
        this.context.beginPath();
        this.context.strokeStyle = `hsla(210, 0%, 100%, 0.1)`;
        this.context.fillStyle = `hsla(210, 100%, 50%, 1)`;
        this.context.lineWidth = this.lineWidth;
        this.context.rect(this.x - this.originX, this.y - this.originY, this.size, this.size);
        // this.context.stroke();
        if (this.isAlive) {
            this.context.fill();
            this.context.strokeStyle = `hsla(210, 0%, 100%, 1)`;
            this.context.stroke();
        }
        this.context.closePath();
        // inner circle
        // this.context.beginPath();
        // this.context.fillStyle = `hsla(210, 0%, 85%, 0.2)`;
        // this.context.arc(
        //     this.x + this.size * 0.5 ,
        //     this.y + this.size * 0.5,
        //     this.size * 0.02,
        //     0,
        //     Math.PI * 2
        // );
        // this.context.fill();
        // this.context.closePath();
    }
    resize(size) {
        this.cellSize = size;
    }
}

class Shape {
    constructor(canvas, context, x, y, cellSize, type, controller) {
        this.canvas = canvas;
        this.context = context;
        this.controller = controller;
        this.cellSize = cellSize;
        this.type = type;
        this.rows = this.type === 'I' ? 4 : 3;
        this.columns = this.type === 'J' || this.type === 'L' ? 4 : 3;
        this.width = this.columns * this.cellSize;
        this.height = this.rows * this.cellSize;
        this.x = x;
        this.y = y;
        this.originX = type === 'O' ? (this.width / 3) * 2 : this.width * 0.5;
        this.originY =
            type === 'I' || type === 'J' || type === 'L' ? this.height * 0.5 : this.height / 3;
        this.velX = 0;
        this.velY = 0;
        this.rotation = 0;
        this.shapeArr = [];
        this.color = `hsla(210, 100%, 50%, 0.8)`;
        this.init();
        this.draw();
    }
    init() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.shapeArr.push(
                    new Cell(
                        this.canvas,
                        this.context,
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        false,
                        this.originX,
                        this.originY
                    )
                );
            }
        }
        switch (this.type) {
            case 'I':
                this.getShapeTypes('I').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });

                break;
            case 'O':
                this.getShapeTypes('O').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });

                break;
            case 'T':
                this.getShapeTypes('T').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });

                break;
            case 'S':
                this.getShapeTypes('S').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });
                break;
            case 'Z':
                this.getShapeTypes('Z').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });
                break;
            case 'J':
                this.getShapeTypes('J').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });
                break;
            case 'L':
                this.getShapeTypes('L').forEach((i) => {
                    this.shapeArr[i].isAlive = true;
                });
                break;
            default:
                console.error(`Please enter either 'I', 'O', 'T', 'S', 'Z', 'J', 'L' for type`);
                break;
        }
    }
    update() {
        this.rotation += controller.directionY;
        this.velX = controller.directionX * 10;
        this.velY += 0.1;
        this.x += this.velX;
        this.y += this.velY;

        if (this.y + this.height > this.canvas.height * 1.5) {
            gameBoard.createShape();
            gameBoard.shapesArr.splice(this, 1);
        }
    }
    draw() {
        this.context.save();
        this.context.translate(this.x + this.originX, this.y + this.originY);
        this.context.rotate(this.rotation * 0.2);

        for (let i = 0; i < this.shapeArr.length; i++) {
            const cell = this.shapeArr[i];
            cell.draw();
            this.context.beginPath();
            this.context.fillStyle = `red`;
            this.context.arc(0, 0, 2, 0, Math.PI * 2);
            this.context.fill();
            this.context.closePath();
        }
        this.context.restore();
    }
    resize(size) {
        this.cellSize = size;
    }
    getShapeTypes(type) {
        switch (type) {
            case 'I':
                return [1, 4, 7, 10];
                break;
            case 'O':
                return [1, 2, 4, 5];
                break;
            case 'T':
                return [0, 1, 2, 4];
                break;
            case 'S':
                return [1, 2, 3, 4];
                break;
            case 'Z':
                return [0, 1, 4, 5];
                break;
            case 'J':
                return [2, 6, 9, 10];
                break;
            case 'L':
                return [1, 5, 9, 10];
                break;
            default:
                console.error(`Please enter either 'I', 'O', 'T', 'S', 'Z', 'J', 'L' for type`);
                break;
        }
        return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    }
}
// const shapeI = new Shape(shapeCanvas, shapeCtx, 0, 0, 40, 'I');
// const shapeO = new Shape(shapeCanvas, shapeCtx, 0, 160, 40, 'O');
// const shapeT = new Shape(shapeCanvas, shapeCtx, 0, 320, 40, 'T');
// const shapeS = new Shape(shapeCanvas, shapeCtx, 0, 440, 40, 'S');
// const shapeZ = new Shape(shapeCanvas, shapeCtx, 0, 560, 40, 'Z');
// const shapeJ = new Shape(shapeCanvas, shapeCtx, 0, 680, 40, 'J');
// const shapeL = new Shape(shapeCanvas, shapeCtx, 0, 800, 40, 'L');

class GameBoard {
    constructor(canvas, context, x, y, controller) {
        this.canvas = canvas;
        this.context = context;
        this.height = this.canvas.height * 0.8;
        this.width = this.height * 0.5;
        this.lineWidth = 1;
        this.x = x - this.width * 0.5 - this.lineWidth;
        this.y = y - this.height * 0.5 - this.lineWidth;
        this.normX = this.x / window.innerWidth;
        this.normY = this.y / window.innerHeight;
        this.rows = 20;
        this.columns = 10;
        this.gridArr = [];
        this.cellSize = this.height / this.rows;
        this.shapesArr = [];
        this.shapeTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        this.controller = controller;
        this.init();
    }
    draw() {
        for (let i = 0; i < this.shapesArr.length; i++) {
            const shape = this.shapesArr[i];
            shape.update();
            shape.draw();
        }
        for (let i = 0; i < this.gridArr.length; i++) {
            const cell = this.gridArr[i];
            cell.draw();
        }
        this.context.beginPath();
        this.context.strokeStyle = `hsla(210, 90%, 50%, 1)`;
        this.context.lineWidth = this.lineWidth * 2;
        this.context.rect(
            this.x - this.lineWidth,
            this.y - this.lineWidth,
            this.width + this.lineWidth,
            this.height + this.lineWidth
        );
        this.context.stroke();
        this.context.closePath();
    }
    init() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.gridArr.push(
                    new Cell(
                        canvas,
                        ctx,
                        x * this.cellSize + this.x,
                        y * this.cellSize + this.y,
                        this.cellSize
                    )
                );
            }
        }

        this.createShape();
    }
    createShape() {
        this.shapesArr.push(
            new Shape(
                shapeCanvas,
                shapeCtx,
                this.x + this.cellSize * 4,
                this.y,
                this.cellSize,
                this.shapeTypes[Math.floor(Math.random() * this.shapeTypes.length)],

                this.controller
            )
        );
        console.log(this.controller);
    }
    resize(height) {
        this.canvas.height = height;
        this.height = this.canvas.height * 0.8;
        this.width = this.height * 0.5;
        this.cellSize = this.rows / this.height;
        for (let i = 0; i < this.gridArr.length; i++) {
            const cell = this.gridArr[i];
            cell.resize(this.cellSize);
        }
    }
}
const gameBoard = new GameBoard(
    canvas,
    ctx,
    window.innerWidth * 0.5,
    window.innerHeight * 0.5,
    controller
);

// EVENT LISTENERS
window.addEventListener('resize', () => {
    gameBoard.resize(window.innerHeight);
});
window.addEventListener('keydown', (e) => {
    controller.keydownHandler(e);
});
window.addEventListener('keyup', (e) => {
    controller.keyupHandler(e);
});

// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// MAIN FUNCTION
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapeCtx.clearRect(0, 0, canvas.width, canvas.height);

    gameBoard.draw();
    controller.update();
    requestAnimationFrame(animate);
}
animate();
