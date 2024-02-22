const name = document.getElementById('name');

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Grid {
    constructor(
        width = window.innerWidth,
        height = window.innerHeight,
        columns = width > height
        ? 40 + Math.floor(width * 0.02)
        : 20 + Math.floor(width * 0.02),
        rows = window.innerWidth > window.innerHeight
        ? Math.floor(columns * 0.5)
        : Math.floor(columns * 1)
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
                this.gridArr.push(new Cell(this, x, y, this.gridArr.length + 1));
            }
        }
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
    constructor(grid, x, y, text) {
        this.grid = grid;
        this.ctx = this.grid.ctx;
        this.text = text;
        // Physics
        this.width = this.grid.cellSizeX;
        this.height = this.grid.cellSizeY;
        this.radius = window.innerWidth > window.innerHeight ? this.width * 0.2 : this.width * 0.4;
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
        this.minDist = mouse.radius*0.5;
        this.radii = 10;
        this.speed = 1;
        this.decel = 0.03;
        this.bounce = 0.9;
        // Style
        this.hue = 45;
        this.lineWidth = 1;
        this.timer = 0
        this.timerRnd = Math.random() * 0.05
    }
    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const length = Math.hypot(dx,dy)
        if (length < mouse.radius && mouse.isMoving) {
            this.dx = this.startX * this.width - mouse.x;
            this.dy = this.startY * this.height - mouse.y;
            this.dist =
                length > this.minDist
                    ? length
                    : this.minDist;
        } else {
            this.dx = this.startX * this.width - this.x;
            this.dy = this.startY * this.height - this.y;
            this.dist =
                length > this.radius
                    ? length
                    : this.radius;
        }
        this.velX += (((this.dx / this.dist) * this.speed) - (this.velX * this.decel));
        //  + (Math.cos(this.timer) * 0.01);
        this.velY += (((this.dy / this.dist) * this.speed) - (this.velY * this.decel));
        //  + (Math.sin(this.timer) * 0.01);
        this.x += this.velX;
        this.y += this.velY;
        // this.timer += 0.01 + this.timerRnd
    }
    draw() {
        // const dx = mouse.x - this.x;
        // const dy = mouse.y - this.y;
        // const length = Math.hypot(dx,dy) 
        // const colorAdjust = length * 0.25;
        // const maxHue = 260;
        // const finalHue = this.hue + colorAdjust
        // const minSat = 0;
        // const normDistance = length / (window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight)
        // const finalAlpha =  (1 - normDistance )
        // const color = `hsla(${this.hue}, 100%, 50%, ${finalAlpha})`
        const color = `hsla(${120 + (Math.cos(this.timer)*100)}, 100%, 50%, 1)`
        // Lines
        // this.ctx.beginPath();
        // this.ctx.fillStyle = `hsla(${this.hue + colorAdjust}, 80%, 50%, 0.5)`;
        // this.ctx.strokeStyle = `hsla(${this.hue + colorAdjust}, 80%, 50%, 1)`;
        // this.ctx.lineWidth = this.lineWidth;
        // this.ctx.rect(
        //     this.x,
        //     this.y,
        //     this.width - this.lineWidth * 0.5,
        //     this.height - this.lineWidth * 0.5
        // );
        // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // this.ctx.fill();
        // this.ctx.stroke();
        // Text
        // const fontSize = 12;
        // this.ctx.beginPath();
        // this.ctx.fillStyle = `hsl(200,5%,40%)`;
        // this.ctx.font = `300 ${fontSize}px Poppins`;
        // this.ctx.fillText(this.text, this.x + this.width * 0.5, this.y + this.height * 0.5);
        // this.ctx.closePath();

        // Dot
        this.ctx.beginPath();
        // this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1
        this.ctx.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.radius, 0, Math.PI * 2);
        // this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.timer += 0.01
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

class Text {
    constructor(
        text,
        parentDiv = document.body,
        divType = 'div',
        className = null,
        fontSize = '16px',
        fontWeight = '400',
        fontFamily = 'sans-serif',
        color = 'grey'
    ) {
        this.textElement;
        this.text = text;
        this.id = `text-${this.text}`;
        this.className = className;
        this.fontSize = fontSize;
        this.fontWeight = fontWeight;
        this.fontFamily = fontFamily;
        this.color = color;
        this.divType = divType;
        this.parentDiv = parentDiv;
        this.init();
    }
    init() {
        const textDiv = document.createElement(`${this.divType}`);
        textDiv.innerText = this.text;
        textDiv.id = this.id;
        this.className && (textDiv.classList = this.className);
        !this.className && (textDiv.style.fontFamily = this.fontFamily);
        !this.className && (textDiv.style.fontSize = this.fontSize);
        !this.className && (textDiv.style.fontWeight = this.fontWeight);
        !this.className && (textDiv.style.color = this.color);
        textDiv.style.textShadow = `${(mouse.x / window.innerWidth) * 30}px ${
            (mouse.y / window.innerHeight) * 30
        }px 3px black`;
        this.parentDiv.appendChild(textDiv);
        this.textElement = textDiv;
    }
    update(mouse) {
        const element = document.getElementById(this.id);
        const elementX =
            element.getBoundingClientRect().x + element.getBoundingClientRect().width * 0.5;
        const elementY =
            element.getBoundingClientRect().y + element.getBoundingClientRect().height * 0.5;
        const dxNorm = (elementX - mouse.x) / window.innerWidth;
        const dyNorm = (elementY - mouse.y) / window.innerHeight;
        element.style.textShadow = `${dxNorm * 30}px ${dyNorm * 30}px ${
            2 + (dxNorm * dxNorm + dyNorm * dyNorm) * 20
        }px black`;
    }
}

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
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = 'canvas-mouse';
        canvas.style.zIndex = '999999';
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = ctx;
    }
    update(x, y) {
        this.isMoving = true;
        this.isMovingCounter = 0;
        this.x = x;
        this.y = y;
        // document.body.style.background = `radial-gradient(circle at ${this.x}px ${this.y}px, hsla(200,10%,10%,1), hsla(200,10%,2%,1))`;
    }
    draw() {
        const finalRadius = this.radius * 0.5
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
            if (this.isMovingCounter >= this.isMovingCounterLimit) this.isMoving = false;
        }
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
// const firstName = new Text('Luca', document.getElementById('text-container'), 'h1', 'first-name');
// const lastName = new Text('Novello', document.getElementById('text-container'), 'h1', 'last-name');

function mainApp() {
    // firstName.update(mouse);
    // lastName.update(mouse);
    // mouse.draw();
    grid.draw();

    requestAnimationFrame(mainApp);
}
mainApp();

window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});

window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});

window.addEventListener('resize', (e) => {
    mouse.resize(window.innerWidth, window.innerHeight);
    grid.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener('scroll', (e) => {
    e.preventDefault();
});
