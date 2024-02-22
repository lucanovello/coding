function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Grid {
    constructor(
        width = window.innerWidth,
        height = window.innerHeight,
        columns = 5 + Math.floor(width * 0.01),
        rows = columns * (height / width)
    ) {
        this.canvas;
        this.ctx;
        this.width = width;
        this.height = height;
        this.columns = columns;
        this.rows = rows;
        this.gridArr = [];
        this.cellSizeX = this.width / this.columns;
        this.cellSizeY = this.height / this.rows;
        this.initCanvas();
        this.initGrid();
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
    initGrid() {
        this.gridArr = [];
        this.cellSizeX = this.width / this.columns;
        this.cellSizeY = this.height / this.rows;
        for (let y = 0; y < this.rows + 1; y++) {
            for (let x = 0; x < this.columns + 1; x++) {
                this.gridArr.push(new Cell(this, x, y));
            }
        }
        console.log(this.gridArr);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.gridArr.length; i++) {
            const cell = this.gridArr[i];
            cell.update();
            cell.draw();
        }
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cellSizeX = width / this.columns;
        this.cellSizeY = height / this.rows;
        for (let i = 0; i < this.gridArr.length; i++) {
            const cell = this.gridArr[i];
            cell.resize(this);
        }
    }
}

class Cell {
    constructor(grid, x, y) {
        this.grid = grid;
        this.ctx = this.grid.ctx;
        // Physics
        this.width = this.grid.cellSizeX;
        this.height = this.grid.cellSizeY;
        this.radius = this.width * 0.5;
        this.normRadius = this.radius / this.grid.width;
        this.startX = x;
        this.startY = y;
        this.normX = (this.startX * this.width) / this.grid.width;
        this.normY = (this.startY * this.height) / this.grid.height;
        this.x = this.normX * this.grid.width;
        this.y = this.normY * this.grid.height;
        this.velX = getRandomArbitrary(-0, 0);
        this.velY = getRandomArbitrary(-0, 0);
        this.dx = 0;
        this.dy = 0;
        this.dist = 0;
        this.minDist = 1;
        this.radii = 10;
        this.speed = 5;
        this.decel = 0.2;
        this.bounce = 0.9;
        // Style
        this.hue = 180;
        this.lineWidth = 1;
    }
    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;

        if (Math.sqrt(dx * dx + dy * dy) < mouse.radius) {
            this.dx = this.startX * this.width - mouse.x;
            this.dy = this.startY * this.height - mouse.y;
            this.dist =
                Math.sqrt(this.dx * this.dx + this.dy * this.dy) > this.minDist
                    ? Math.sqrt(this.dx * this.dx + this.dy * this.dy)
                    : this.minDist;
            this.speed = 5;
            this.velX += (this.dx / this.dist) * this.speed;
            this.velY += (this.dy / this.dist) * this.speed;
        } else {
            this.dx = this.startX * this.width - this.x;
            this.dy = this.startY * this.height - this.y;
            this.dist =
                Math.sqrt(this.dx * this.dx + this.dy * this.dy) > this.radius
                    ? Math.sqrt(this.dx * this.dx + this.dy * this.dy)
                    : this.radius;
            this.speed = 1;
            this.velX += (this.dx / this.dist) * this.speed - this.velX * this.decel;
            this.velY += (this.dy / this.dist) * this.speed - this.velY * this.decel;
        }

        this.x += this.velX;
        this.y += this.velY;
        // if (this.startX === 7 && this.startY === 7) console.log(this.dist / this.minDist);
        // this.handleEdges(window.innerWidth, window.innerHeight);
    }
    draw() {
        const hueAdjust =
            Math.abs(this.x - this.startX * this.width) < 180
                ? Math.abs(this.x - this.startX * this.width)
                : 180;
        // Lines
        this.ctx.beginPath();
        this.ctx.fillStyle = `hsla(${this.hue + hueAdjust}, 80%, 50%, 0.5)`;
        this.ctx.strokeStyle = `hsla(${this.hue + hueAdjust}, 80%, 50%, 1)`;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.rect(
            this.x - (this.width - this.lineWidth * 0.5) * 0.5,
            this.y - (this.height - this.lineWidth * 0.5) * 0.5,
            this.width - this.lineWidth * 0.5,
            this.height - this.lineWidth * 0.5
        );
        // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        // Dot
        this.ctx.beginPath();
        this.ctx.fillStyle = `hsla(${this.hue + hueAdjust}, 100%, 90%, 1)`;
        this.ctx.strokeStyle = `hsla(${this.hue + hueAdjust}, 100%, 100%, 1)`;
        this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    handleEdges(width, height) {
        if (this.x - this.radius <= 0) {
            this.x = this.radius + this.lineWidth;
            this.velX = -this.velX * this.bounce;
        }
        if (this.x + this.radius >= width) {
            this.x = width - this.radius - this.lineWidth;
            this.velX = -this.velX * this.bounce;
        }

        if (this.y - this.radius <= 0) {
            this.y = this.radius + this.lineWidth;
            this.velY = -this.velY * this.bounce;
        }
        if (this.y + this.radius >= height) {
            this.y = height - this.radius - this.lineWidth;
            this.velY = -this.velY * this.bounce;
        }
    }
    resize(grid) {
        this.grid = grid;
        this.width = this.grid.cellSizeX;
        this.height = this.grid.cellSizeY;
        this.radius = this.normRadius * this.grid.width;
    }
}

class Mouse {
    constructor(
        x = window.innerWidth * 0.5,
        y = window.innerHeight * 0.5,
        radius = Math.sqrt(
            window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight
        ) * 0.1,
        hue = 130,
        saturation = 80,
        brightness = 50,
        alpha = 0.5,
        lineWidth = Math.ceil(radius * 0.01)
    ) {
        this.canvas;
        this.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.hue = hue;
        this.saturation = saturation;
        this.brightness = brightness;
        this.alpha = alpha;
        this.lineWidth = lineWidth;
        this.initCanvas();
        this.update(x, y);
    }
    initCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = 'canvas-mouse';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = ctx;
    }
    update(x, y) {
        this.x = x;
        this.y = y;
        document.body.style.background = `radial-gradient(circle at ${this.x}px ${this.y}px, hsla(200,10%,10%,1), hsla(200,10%,2%,1))`;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.fillStyle = `grey`;
        this.ctx.strokeStyle = `grey`;
        this.ctx.lineWidth = 1;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation * 0.9}%, ${
            this.brightness * 0.9
        }%, ${this.alpha})`;
        this.ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        // this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.radius =
            Math.sqrt(
                window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight
            ) * 0.1;
    }
}

const mouse = new Mouse();
const grid = new Grid();

function mainApp() {
    mouse.draw();
    grid.draw();
    requestAnimationFrame(mainApp);
}
mainApp();

window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});

window.addEventListener('touchstart', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener('touchmove', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});

window.addEventListener('resize', (e) => {
    mouse.resize(window.innerWidth, window.innerHeight);
    grid.resize(window.innerWidth, window.innerHeight);
});
