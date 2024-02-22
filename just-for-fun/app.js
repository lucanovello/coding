const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const PLAYER_RADIUS = 7;
const GRAVITY = 0.618;
const MAX_FORCE = 4;
const FRICTION = 0.005;

const slingshot = {
    x: (window.innerWidth * 0.2) / window.innerWidth,
    y: (window.innerHeight * 0.7) / window.innerHeight,
    size: PLAYER_RADIUS,
};

const ball = {
    x: slingshot.x,
    y: slingshot.y,
    radius: PLAYER_RADIUS,
    mass: 50,
    velocity: {
        x: 0,
        y: 0,
    },
    acceleration: 0.1,
    friction: FRICTION,
    airFriction: FRICTION,
    groundFriction: FRICTION * 3,
    isMovingCounter: 0,
    bounce: 0.85,
};

const player = {
    startPos: {
        x: 0,
        y: 0,
    },
    posDifference: {
        x: 0,
        y: 0,
    },
};

const ground = {
    x: -ctx.lineWidth,
    y: ctx.canvas.height * 0.8,
};

//Window Handlers
function onResizeHandler() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}
//Mouse Handlers
function onMousemoveHandler(e) {
    if (ball.isMovingCounter === 1) {
        player.posDifference.x = e.screenX - player.startPos.x;
        player.posDifference.y = e.screenY - player.startPos.y;
    }
}
function onMousedownHandler(e) {
    if (ball.isMovingCounter === 0) {
        player.startPos.x = e.screenX;
        player.startPos.y = e.screenY;
    }
    ball.isMovingCounter += 1;
    window.onmousemove = (e) => onMousemoveHandler(e);
}
function onMouseupHandler(e) {
    window.onmousemove = null;

    if (ball.isMovingCounter === 2) {
        player.posDifference.x = e.screenX - player.startPos.x;
        player.posDifference.y = e.screenY - player.startPos.y;
    }

    ball.isMovingCounter += 1;
}

// Key Handler
function onResetHandler(e) {
    e.code === 'Space' && (ball.isMovingCounter = 0);
    ball.velocity = { x: 0, y: 0 };
    player.startPos = {
        x: 0,
        y: 0,
    };
    player.posDifference = {
        x: 0,
        y: 0,
    };
}

// EVENT LISTENERS
window.addEventListener('resize', onResizeHandler);
window.addEventListener('mousedown', onMousedownHandler);
window.addEventListener('mouseup', onMouseupHandler);
window.addEventListener('keydown', onResetHandler);

//MAIN FUNCTION
function drawApp() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw line for ball
    if (ball.isMovingCounter === 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 10]);
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(
            slingshot.x * ctx.canvas.width - slingshot.size / 2,
            slingshot.y * ctx.canvas.height - slingshot.size / 2
        );
        ctx.stroke();
        ctx.closePath();
    }
    ctx.setLineDash([]);

    // Draw Slingshot
    ctx.beginPath();
    slingshot;
    ctx.fillStyle = 'hsl(25, 50%, 23%)';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = slingshot.size * 0.07;
    ctx.rect(
        slingshot.x * ctx.canvas.width - slingshot.size / 2,
        slingshot.y * ctx.canvas.height - slingshot.size / 2,
        slingshot.size,
        slingshot.size * 25
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw Ball
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = ball.radius * 0.07;
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw ground
    ctx.beginPath();
    ctx.fillStyle = 'hsl(130, 60%, 20%)';
    ctx.strokeStyle = 'hsl(150, 40%, 5%)';
    ctx.lineWidth = ball.radius * 0.01;
    ctx.rect(
        ground.x,
        ground.y,
        ctx.canvas.width + ctx.lineWidth * 4,
        ctx.canvas.height + ctx.lineWidth * 4
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Calculate ball physics
    if (ball.isMovingCounter === 1) {
        ball.x = slingshot.x * ctx.canvas.width + player.posDifference.x;
        ball.y = slingshot.y * ctx.canvas.height + player.posDifference.y;
    } else if (ball.isMovingCounter > 1) {
        ball.velocity.x += player.posDifference.x / MAX_FORCE - ball.velocity.x * ball.friction;
        ball.velocity.y += -player.posDifference.y / MAX_FORCE + GRAVITY;

        ball.x += -ball.velocity.x;
        ball.y += ball.velocity.y;

        player.posDifference.x = 0;
        player.posDifference.y = 0;
    } else {
        ball.x = slingshot.x * ctx.canvas.width;
        ball.y = slingshot.y * ctx.canvas.height;
    }

    ball.friction = ball.airFriction;

    // ball collision
    if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.velocity.x = -ball.velocity.x * ball.bounce;
    }
    if (ball.x + ball.radius >= ctx.canvas.width) {
        ball.x = ctx.canvas.width - ball.radius;
        ball.velocity.x = -ball.velocity.x * ball.bounce;
    }
    if (ball.y + ball.radius <= 0) {
        ball.y = ball.radius;
        ball.velocity.y = -ball.velocity.y * ball.bounce;
    }
    if (ball.y + ball.radius >= ground.y) {
        ball.y = ground.y - ball.radius;
        ball.velocity.y = -ball.velocity.y * ball.bounce;
        ball.friction = ball.groundFriction;
    }

    // recall function
    window.requestAnimationFrame(drawApp);
}
drawApp();
