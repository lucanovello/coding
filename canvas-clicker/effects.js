const btnContainer = document.getElementById('btn-container');

const SIZE = `${100}px`;

const buttonArr = [];

class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Button {
    constructor(width, height = width) {
        this.width = width;
        this.height = height;
        this.padding = `10px`;
        this.borderRadius = `10px`;
        this.color1 = 'hsl(205,80%,50%)';
        this.color2 = 'hsl(205,80%,40%)';
        this.color3 = 'hsl(200,80%,20%)';
        this.background = `linear-gradient( ${this.color1}, ${this.color2}, ${this.color3})`;
        this.cursor = `pointer`;
        this.classList = 'btn';
        this.counter = 0;
        this.title = `Btn ${buttonArr.length + 1}`;
        this.order = buttonArr.length;
        this.counterEle;
        this.newBtnCount = 10;
        this.init();
    }
    init() {
        this.order = buttonArr.length;
        //create and append btn element
        const btn = document.createElement('button');
        btn.style.padding = this.padding;
        btn.style.width = this.width;
        btn.style.height = this.height;
        btn.style.borderRadius = this.borderRadius;
        btn.style.background = this.background;
        btn.style.cursor = this.cursor;
        btn.classList = this.classList;
        btn.id = `btn-${this.order}`;
        btnContainer.appendChild(btn);
        btn.onmousedown = (e) => this.mouseDownHandler(e);
        btn.oncontextmenu = (e) => e.preventDefault();
        //create and append title element
        const btnTitle = document.createElement('h2');
        btnTitle.innerText = this.title;
        btnTitle.classList = 'btn-title';
        btn.appendChild(btnTitle);
        //create and append counter element
        const btnCounter = document.createElement('p');
        btnCounter.innerText = this.counter;
        btnCounter.classList = 'btn-counter';
        btnCounter.id = `btn-counter-${this.order}`;
        btn.appendChild(btnCounter);
        this.counterEle = btnCounter;
        //add button to button array
        buttonArr.push(this);
    }
    mouseDownHandler(e) {
        e.preventDefault();
        e.button === 0 && this.counter++;
        e.button === 2 && this.counter >= 1 && this.counter--;
        this.counterEle.innerText = this.counter;
        // if (this.counter - Math.floor(this.newBtnCount * (this.counter * 0.1)) === 0) {
        //     new Button(SIZE);
        // }
        console.log(this.newBtnCount + Math.floor(this.counter * this.counter * 0.5));
    }
}

// EVENT LISTENERS
window.addEventListener('mousemove', (e) => {
    mouse.update(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});
window.addEventListener('touchstart', (e) => {
    mouse.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});

// Get random number between 2 numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const button = new Button(SIZE);

const mouse = new Mouse();

// MAIN FUNCTION
function animate() {
    button.draw();

    requestAnimationFrame(animate);
}
console.log(buttonArr);
// animate();
