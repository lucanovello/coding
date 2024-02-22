const body = document.querySelector('#body');
const imageContainer = document.querySelector('.image-container');

let dragDegXPrev = 0;
let dragDegYPrev = 0;
let dragDegXFinal = 0;
let dragDegYFinal = -10;

let mainScaleSpeed = 0.7;
let mainScaleAcc = 0.1;
let maxSpeed = 2;
let acc = 0.1;
let decel = 0.001;
let decelY = 0.005;
let speed = 0;
let speedY = 0;
let keyUp = 0;
let keyDown = 0;
let keyLeft = 0;
let keyRight = 0;
let isShiftDown = false;
let isDragFromTop = false;

let directionX = 0;
let directionY = 0;

let prevScreenX = 0;
let prevScreenY = 0;

const setdragDegPrev = (x, y) => {
  dragDegXPrev = x;
  dragDegYPrev = y;
};

// MOUSE DRAG CONTROLS
window.onmousedown = (e) => {
  e.preventDefault();
  body.classList = 'grabbing';
  isShiftDown = e.shiftKey;
  maxSpeed = 5;
  prevScreenX = e.x;
  prevScreenY = e.y;
  e.y < e.view.innerHeight / 2
    ? (isDragFromTop = true)
    : (isDragFromTop = false);
  window.onmousemove = (e) => mouseDragHandler(e);
};

window.onmouseup = (e) => {
  e.preventDefault();
  isShiftDown = e.shiftKey;
  decel = maxSpeed / 80;
  body.classList = 'grab';
  window.onmousemove = null;
  setdragDegPrev(dragDegXFinal, dragDegYFinal);
};

const mouseDragHandler = (e) => {
  e.preventDefault();
  isShiftDown = e.shiftKey;
  if (isShiftDown) speedY = 0;
  rotateContainer(e, true);
  isShiftDown && rotateContainer(e, false);
  prevScreenX = e.x;
  prevScreenY = e.y;
};

// ROTATE ONDRAG FUNCTION
const rotateContainer = (e = e, isX = true) => {
  const dragResolution = 12;
  const dragDirection = isDragFromTop ? -1 : 1;
  if (isX) {
    const dragDifferenceX = e.x - prevScreenX;
    const dragRatioX = dragDifferenceX / dragResolution;
    speed = dragRatioX * dragDirection;
    if (speed >= maxSpeed) speed = maxSpeed;
    if (speed <= -maxSpeed) speed = -maxSpeed;
  } else {
    const dragDifferenceY = e.y - prevScreenY;
    const dragRatioY = dragDifferenceY / dragResolution;
    speedY = dragRatioY;
    if (speedY >= maxSpeed) speedY = maxSpeed;
    if (speedY <= -maxSpeed) speedY = -maxSpeed;
  }
};

// ONKEY HANDLERS
const keyDownHandler = (e) => {
  maxSpeed = 1.5;
  acc = maxSpeed / 150;
  decel = maxSpeed / 50;
  if (e.repeat === false) {
    switch (e.code) {
      case 'KeyA':
      case 'ArrowLeft':
        keyLeft = 1;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keyRight = 1;
        break;
      case 'KeyW':
      case 'ArrowUp':
        keyUp = 1;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keyDown = 1;
        break;
      case 'ShiftLeft':
        isShiftDown = true;
        break;
    }
  }
};
const keyUpHandler = (e) => {
  if (e.repeat === false) {
    switch (e.code) {
      case 'KeyA':
      case 'ArrowLeft':
        keyLeft = 0;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keyRight = 0;
        break;
      case 'KeyW':
      case 'ArrowUp':
        keyUp = 0;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keyDown = 0;
        break;
      case 'ShiftLeft':
        isShiftDown = false;
        break;
    }
  }
};

// DECELERATION
const decelerationX = () => {
  if (speed > 0) {
    speed -= decel;
    if (speed <= 0) {
      speed = 0;
      setdragDegPrev(dragDegXFinal, dragDegYFinal);
    }
  } else if (speed < 0) {
    speed += decel;
    if (speed >= 0) {
      speed = 0;
      setdragDegPrev(dragDegXFinal, dragDegYFinal);
    }
  } else {
    speed = 0;
  }
};
const decelerationY = () => {
  if (speedY > 0) {
    speedY -= decelY;
    if (speedY <= 0) {
      speedY = 0;
      setdragDegPrev(dragDegXFinal, dragDegYFinal);
    }
  } else if (speedY < 0) {
    speedY += decelY;
    if (speedY >= 0) {
      speedY = 0;
      setdragDegPrev(dragDegXFinal, dragDegYFinal);
    }
  } else {
    speedY = 0;
  }
};

// MAIN FUNCTION
const wasdControls = () => {
  directionX = keyRight - keyLeft;
  directionY = keyUp - keyDown;
  if (speed >= maxSpeed) speed = maxSpeed;
  if (speedY >= maxSpeed) speedY = maxSpeed;
  if (speed <= -maxSpeed) speed = -maxSpeed;
  if (speedY <= -maxSpeed) speedY = -maxSpeed;

  if (directionX != 0) {
    speed += acc * directionX * 0.6;
  } else {
    decelerationX();
  }

  if (isShiftDown) {
    if (directionY != 0) {
      speedY += acc * directionY;
    } else {
      decelerationY();
    }
  } else {
    imageScaler(0.01, directionY, 1.5);
  }

  imageContainer.style.transform = `perspective(var(--perspective)) rotateX(${(dragDegYFinal -=
    speedY)}deg) rotateY(${(dragDegXFinal += speed)}deg)
   scale3d(${mainScaleSpeed},${mainScaleSpeed},${mainScaleSpeed})`;
};

const onWheelHandler = (e) => {
  maxSpeed = 10;
  acc = maxSpeed / 10;
  decel = maxSpeed / 120;
  decelY = maxSpeed / 100;
  if (e.shiftKey) {
    imageScaler(0.1, e.wheelDelta, 1.5);
    maxSpeed = 0;
  } else {
    if (e.wheelDelta > 0) {
      speed += acc;
    }
    if (e.wheelDelta < 0) {
      speed -= acc;
    }
  }
};

const imageScaler = (mainScaleAcc, input, mainScaleSpeedMax) => {
  if (input > 0) {
    mainScaleSpeed >= mainScaleSpeedMax
      ? (mainScaleSpeed = mainScaleSpeedMax)
      : (mainScaleSpeed += mainScaleAcc);
  }
  if (input < 0) {
    mainScaleSpeed <= 0.1
      ? (mainScaleSpeed = 0.1)
      : (mainScaleSpeed -= mainScaleAcc);
  }
};
const runtime = setInterval(wasdControls, 1);
window.addEventListener('keydown', (e) => keyDownHandler(e));
window.addEventListener('keyup', (e) => keyUpHandler(e));
window.addEventListener('wheel', (e) => onWheelHandler(e));
