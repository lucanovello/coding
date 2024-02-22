const body = document.body;

class Graph {
    constructor(originX, originY, width, height, gridlines = 20, subdivisions = 4) {
        this.canvas;
        this.ctx;
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
        this.normWidth = this.width / window.innerWidth;
        this.normHeight = this.height / window.innerHeight;
        this.gridlines = gridlines;
        this.subdivisions = subdivisions;
        this.columns = Math.floor(this.width / this.gridlines);
        this.rows = Math.floor(this.height / this.gridlines);
        this.startX = Math.floor(this.columns * this.originX);
        this.startY = Math.floor(this.rows * this.originY);
        // line style
        this.funcLineWidth = 2;
        this.dotRadius = this.funcLineWidth * 2;
        this.initCanvas();
        console.log(this.columns, this.rows);
    }
    initCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.id = 'canvas-graph';
        body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = ctx;
    }
    resize(width, height) {
        this.canvas.width = this.normWidth * width;
        this.canvas.height = this.normHeight * height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw columns
        for (let i = 0; i < this.columns; i++) {
            this.ctx.strokeStyle = i === this.startX ? 'black' : '#242424';
            this.ctx.lineWidth = i === this.startX ? 1 : 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridlines, 0);
            this.ctx.lineTo(i * this.gridlines, this.height);
            this.ctx.stroke();
            this.ctx.closePath();

            // Draw columns subdivisions
            for (let j = 0; j < this.subdivisions; j++) {
                this.ctx.strokeStyle = '#484848';
                this.ctx.lineWidth = 0.25;
                this.ctx.beginPath();
                this.ctx.moveTo(
                    i * this.gridlines + (j * this.gridlines + this.gridlines) / this.subdivisions,
                    0
                );
                this.ctx.lineTo(
                    i * this.gridlines + (j * this.gridlines + this.gridlines) / this.subdivisions,
                    this.height
                );
                this.ctx.stroke();
                this.ctx.closePath();
            }
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(
                i - this.startX,
                i * this.gridlines + 5,
                this.originY * this.height - 40
            );
        }
        // Draw rows
        for (let i = 0; i < this.rows; i++) {
            this.ctx.strokeStyle = i === this.startY ? 'black' : '#242424';
            this.ctx.lineWidth = i === this.startY ? 1 : 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridlines);
            this.ctx.lineTo(this.width, i * this.gridlines);
            this.ctx.stroke();
            this.ctx.closePath();
            // Draw columns subdivisions
            for (let j = 0; j < this.subdivisions; j++) {
                this.ctx.strokeStyle = '#484848';
                this.ctx.lineWidth = 0.25;
                this.ctx.beginPath();
                this.ctx.moveTo(
                    0,
                    i * this.gridlines + (j * this.gridlines + this.gridlines) / this.subdivisions
                );
                this.ctx.lineTo(
                    this.width,
                    i * this.gridlines + (j * this.gridlines + this.gridlines) / this.subdivisions
                );
                this.ctx.stroke();
                this.ctx.closePath();
            }
            this.ctx.fillStyle = 'black';
            this.rows - i - (this.rows - this.startY) != 0 &&
                this.ctx.fillText(
                    this.rows - i - (this.rows - this.startY),
                    this.originX * this.width - 30,
                    i * this.gridlines + 12
                );
        }
        this.drawFunction();
    }
    drawFunction() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = this.funcLineWidth;
        for (let i = 0; i < this.columns; i++) {
            const cell = i * this.gridlines;
            this.ctx.lineTo(
                cell + Math.floor(this.originX * this.width) - 34,
                this.originY * this.height -
                    this.gridlines -
                    this.graphFunc(i) -
                    this.dotRadius * 0.5
            );
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.arc(
                cell + Math.floor(this.originX * this.width) - 34,
                this.originY * this.height -
                    this.gridlines -
                    this.graphFunc(i) -
                    this.dotRadius * 0.5,
                this.dotRadius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.moveTo(
                cell + Math.floor(this.originX * this.width) - 34,
                this.originY * this.height -
                    this.gridlines -
                    this.graphFunc(i) -
                    this.dotRadius * 0.5
            );
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.closePath();
    }
    graphFunc(x) {
        return x * x;
    }
}

const graph = new Graph(0.2, 0.7, window.innerWidth, window.innerHeight, 50);

window.addEventListener('resize', () => graph.resize(window.innerWidth, window.innerHeight));

window.addEventListener('mousedown', (e) => {
    let mouseStartX = e.clientX;
    let mouseStartY = e.clientY;
    let diffX = 0;
    let diffY = 0;
    window.onmousemove = (e) => {
        diffX = (e.clientX - mouseStartX) * 0.0001;
        diffY = (e.clientY - mouseStartY) * 0.0001;
        graph.originX += diffX;
        graph.originY += diffY;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
    };
});

window.addEventListener('mouseup', () => {
    window.onmousemove = null;
});

function mainApp() {
    graph.draw();

    requestAnimationFrame(mainApp);
}

mainApp();
