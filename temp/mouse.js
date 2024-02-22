const body = document.body;

class Mouse {
    constructor(canvas = document.body) {
        this.canvas = canvas;
        this.x = window.innerWidth * 0.5;
        this.y = window.innerHeight * 0.5;
        this.prevX = this.x;
        this.prevY = this.y;
        this.distX = 0.1;
        this.distY = 0.1;
        this.hue = 200;

        this.ease = 0.9;
    }
    mousemoveHandler(x, y) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = x;
        this.y = y;
        this.distX += this.prevX - this.x;
        this.distY += this.prevY - this.y;
    }
    update() {
        Math.abs(this.distX) > 0.1 && (this.distX *= this.ease);
        Math.abs(this.distY) > 0.1 && (this.distY *= this.ease);
        this.hue += 0.1;
    }
}

const mouse = new Mouse();

function mainApp() {
    body.style.background = `radial-gradient(40% 70% at ${mouse.prevX + mouse.distX}px ${
        mouse.prevY + mouse.distY
    }px, hsla(${mouse.hue},70%,20%,1), hsla(${mouse.hue + 20},100%,5%,1)`;

    mouse.update();
    console.log(mouse);
    requestAnimationFrame(mainApp);
}

mainApp();
window.addEventListener('mousemove', (e) => mouse.mousemoveHandler(e.clientX, e.clientY));
