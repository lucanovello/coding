const body = document.getElementById('body');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = body.clientWidth;
ctx.canvas.height = body.clientHeight;
const MAX_BRIGHTNESS = 30;
const BRIGHTNESS_INCREASE = MAX_BRIGHTNESS;
const BRIGHTNESS_DECREASE = BRIGHTNESS_INCREASE * 0.04;
const PANEL_SHRINK_AMT = 1.5;
const RADIUS_MULTIPLIER = 24;
const RADIUS =
    ctx.canvas.width / (Math.ceil(ctx.canvas.width / ctx.canvas.height) * RADIUS_MULTIPLIER);

const grid = {
    rows: ctx.canvas.height / RADIUS,
    columns: ctx.canvas.width / RADIUS,
    panelRadius: RADIUS,
    hue: 200,
};

const mouse = {
    x: -grid.panelRadius,
    y: -grid.panelRadius,
};

let currentHighlighted = -1;
let currentBrightness = 0;
let gridArr = [];

//Window Handlers
function onResizeHandler() {
    ctx.canvas.width = body.clientWidth;
    ctx.canvas.height = body.clientHeight;
    grid.panelRadius =
        ctx.canvas.width / (Math.ceil(ctx.canvas.width / ctx.canvas.height) * RADIUS_MULTIPLIER);
    grid.rows = ctx.canvas.height / grid.panelRadius;
    grid.columns = ctx.canvas.width / grid.panelRadius;
    mouse.x = -grid.panelRadius;
    mouse.y = -grid.panelRadius;
    initGridArr(grid.rows, grid.columns, grid.panelRadius);
}
//Mouse Handlers
function onMousemoveHandler(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}
function onTouchmoveHandler(e) {
    mouse.x = e.changedTouches[0].clientX;
    mouse.y = e.changedTouches[0].clientY;
}
function onTouchendHandler() {
    mouse.x = -grid.panelRadius;
    mouse.y = -grid.panelRadius;
    currentHighlighted = -1;
}

// EVENT LISTENERS
window.addEventListener('resize', onResizeHandler);
window.addEventListener('mousemove', onMousemoveHandler);
document.addEventListener('mouseleave', onTouchendHandler);
window.addEventListener('touchstart', onTouchmoveHandler);
window.addEventListener('touchmove', onTouchmoveHandler);
window.addEventListener('touchend', onTouchendHandler);

//INITIALIZE GRID ARRAY WITH CANVAS
function initGridArr(rows, columns, radius) {
    currentBrightness = gridArr[currentHighlighted] ? gridArr[currentHighlighted].brightness : 0;
    gridArr = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            gridArr.push({
                x: j * radius,
                y: i * radius,
                brightness: 0,
            });
        }
    }
    gridArr[currentHighlighted] && (gridArr[currentHighlighted].brightness = currentBrightness);
}

initGridArr(grid.rows, grid.columns, grid.panelRadius, true);

//MAIN FUNCTION
function drawApp() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < gridArr.length; i++) {
        const gridItem = gridArr[i];
        if (
            mouse.x >= gridItem.x &&
            mouse.x < gridItem.x + grid.panelRadius &&
            mouse.y >= gridItem.y &&
            mouse.y < gridItem.y + grid.panelRadius &&
            gridItem.brightness <= MAX_BRIGHTNESS &&
            currentHighlighted != i
        ) {
            gridItem.brightness += BRIGHTNESS_INCREASE;
            currentHighlighted = i;
        } else {
            gridItem.brightness -= BRIGHTNESS_DECREASE;
        }

        if (gridItem.brightness <= 0) {
            gridItem.brightness = 0;
        }
        if (gridItem.brightness >= MAX_BRIGHTNESS) {
            gridItem.brightness = MAX_BRIGHTNESS;
            onTouchendHandler();
        }

        const color = `hsla(${grid.hue},15%,5%, ${1 - gridItem.brightness * 0.02})`;
        // ctx.fillStyle = `hsl(200,25%,${5 + gridItem.brightness}%)`;
        ctx.lineWidth = 1;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        //Square Shape Shrinkage
        ctx.rect(
            gridItem.x + (gridItem.brightness * PANEL_SHRINK_AMT) / 2,
            gridItem.y + (gridItem.brightness * PANEL_SHRINK_AMT) / 2,
            grid.panelRadius - gridItem.brightness * PANEL_SHRINK_AMT,
            grid.panelRadius - gridItem.brightness * PANEL_SHRINK_AMT
        );
        //Square Shape Normal
        // ctx.rect(gridItem.x, gridItem.y, grid.panelRadius, grid.panelRadius);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    window.requestAnimationFrame(drawApp);
}

drawApp();
