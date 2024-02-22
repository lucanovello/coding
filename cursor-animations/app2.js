const body = document.getElementById('body');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const MOUSE_COUNT = 15;
const BASE_RADIUS = 0.3;
const SPEED = 0.2;
const RESPONSE_TIME = 0.4;

const mouse = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
};

const mouseArr = [];

//Window Handlers
function onResizeHandler() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}
//Mouse Handlers
function onMousemoveHandler(e) {
    mouse.x = e.x;
    mouse.y = e.y;
}

// EVENT LISTENERS
window.addEventListener('resize', onResizeHandler);
window.addEventListener('mousemove', onMousemoveHandler);

function addElement() {
    const mouseDivContainer = document.createElement('div');
    mouseDivContainer.classList = `mouse-container`;
    for (let i = 0; i < MOUSE_COUNT; i++) {
        const width = BASE_RADIUS * (MOUSE_COUNT - i);
        const mouseDiv = document.createElement('div');
        mouseDiv.classList = `mouse`;
        mouseDiv.style = `
        width: ${width}px;
        aspectRatio: 1;
        background: white;
        top: ${mouse.y - width / 2}px;
        left: ${mouse.x - width / 2}px;
        transition: ${i * 0.01}s ease-out;
        `;

        mouseDivContainer.appendChild(mouseDiv);
    }
    body.appendChild(mouseDivContainer);
}

addElement();

function drawMouse() {
    const mouseDivArr = document.querySelectorAll('.mouse');
    for (let i = 0; i < mouseDivArr.length; i++) {
        const mouseDiv = mouseDivArr[i];
        mouseDiv.style.top = `${mouse.y - (BASE_RADIUS * (MOUSE_COUNT - i)) / 2}px`;
        mouseDiv.style.left = `${mouse.x - (BASE_RADIUS * (MOUSE_COUNT - i)) / 2}px`;
    }
    // console.log(mouseDivArr.length);
}

//MAIN FUNCTION
function drawApp() {
    drawMouse();
    // recall function
    window.requestAnimationFrame(drawApp);
}
drawApp();
