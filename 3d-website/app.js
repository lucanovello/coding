const body = document.querySelector(".body");
const subContainer = document.querySelector(".sub-container");

// let rotZ = 0;
// let rotResolution = 90;

window.addEventListener("wheel", (e) => onWheelHandler(e));

const onWheelHandler = (e) => {
  const newMaxSpeed = 3;
  if (e.wheelDelta > 0) {
    maxSpeed = newMaxSpeed;
    speed = 90;
    console.log("up");
  }

  if (e.wheelDelta < 0) {
    maxSpeed = newMaxSpeed;
    speed = -90;
    console.log("down");
  }
};

// MOUSE DRAG CONTROLS
let dragDegXPrev = 0;
let dragDegYPrev = 0;
let dragDegXFinal = 0;
let dragDegYFinal = 0;

const setdragDegPrev = (x, y) => {
  dragDegXPrev = x;
  dragDegYPrev = y;
};

window.onmousedown = (e) => {
  e.preventDefault();
  isShiftDown = e.shiftKey;
  maxSpeed = 10;
  body.classList = "grabbing";
  prevScreenX = e.screenX;
  prevScreenY = e.screenY;
  window.onmousemove = (e) => mouseDragHandler(e);
};

window.onmouseup = (e) => {
  e.preventDefault();
  isShiftDown = e.shiftKey;
  decel = maxSpeed / 61.8;
  body.classList = "grab";
  window.onmousemove = null;
  setdragDegPrev(dragDegXFinal, dragDegYFinal);
};

const mouseDragHandler = (e) => {
  e.preventDefault();
  isShiftDown = e.shiftKey;
  if (isShiftDown) speedY = 0;
  rotateContainer(e, true);
  isShiftDown && rotateContainer(e, false);
  prevScreenX = e.screenX;
  prevScreenY = e.screenY;
};

const rotateContainer = (e = e, isX = true) => {
  const dragResolution = 12;
  if (isX) {
    const dragDifferenceX = e.screenX - prevScreenX;
    const dragRatioX = dragDifferenceX / dragResolution;
    speed = dragRatioX;
    if (speed >= maxSpeed) speed = maxSpeed;
    if (speed <= -maxSpeed) speed = -maxSpeed;
  } else {
    const dragDifferenceY = e.screenY - prevScreenY;
    const dragRatioY = dragDifferenceY / dragResolution;
    speedY = dragRatioY;
    if (speedY >= maxSpeed) speedY = maxSpeed;
    if (speedY <= -maxSpeed) speedY = -maxSpeed;
  }
};

// WASD CONTROLS

let maxSpeed = 2;
let acc = 0.1;
let decel = 0.1;
let delelY = decel * 2;
let speed = 0;
let speedY = 0;
let keyUp = 0;
let keyDown = 0;
let keyLeft = 0;
let keyRight = 0;
let isShiftDown = false;

let directionX = 0;
let directionY = 0;

let prevScreenX = 0;
let prevScreenY = 0;

const keyDownHandler = (e) => {
  maxSpeed = 3;
  acc = maxSpeed / 60;
  decel = maxSpeed / 80;
  if (e.repeat === false) {
    switch (e.code) {
      case "KeyA":
        keyLeft = 1;
        break;
      case "KeyD":
        keyRight = 1;
        break;
      case "KeyW":
        keyUp = 1;
        break;
      case "KeyS":
        keyDown = 1;
        break;
      case "ArrowLeft":
        keyLeft = 1;
        break;
      case "ArrowRight":
        keyRight = 1;
        break;
      case "ArrowUp":
        keyUp = 1;
        break;
      case "ArrowDown":
        keyDown = 1;
        break;
      case "ShiftLeft":
        isShiftDown = true;
        break;
    }
  }
};
const keyUpHandler = (e) => {
  if (e.repeat === false) {
    switch (e.code) {
      case "KeyA":
        keyLeft = 0;
        break;
      case "KeyD":
        keyRight = 0;
        break;
      case "KeyW":
        keyUp = 0;
        break;
      case "KeyS":
        keyDown = 0;
        break;
      case "ArrowLeft":
        keyLeft = 0;
        break;
      case "ArrowRight":
        keyRight = 0;
        break;
      case "ArrowUp":
        keyUp = 0;
        break;
      case "ArrowDown":
        keyDown = 0;
        break;
      case "ShiftLeft":
        isShiftDown = false;
        break;
    }
  }
};

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
    speedY -= delelY;
    if (speedY <= 0) {
      speedY = 0;
      setdragDegPrev(dragDegXFinal, dragDegYFinal);
    }
  } else if (speedY < 0) {
    speedY += delelY;
    if (speedY >= 0) {
      speedY = 0;
      setdragDegPrev(dragDegXFinal, dragDegYFinal);
    }
  } else {
    speedY = 0;
  }
};

const wasdControls = () => {
  directionX = keyRight - keyLeft;
  directionY = keyDown - keyUp;
  if (speed >= maxSpeed) speed = maxSpeed;
  if (speedY >= maxSpeed) speedY = maxSpeed;
  if (speed <= -maxSpeed) speed = -maxSpeed;
  if (speedY <= -maxSpeed) speedY = -maxSpeed;

  if (directionX != 0) {
    speed += acc * directionX;
  } else {
    decelerationX();
  }
  if (isShiftDown)
    if (directionY != 0) {
      speedY += acc * directionY;
    } else {
      decelerationY();
    }

  subContainer.style.transform = `rotateX(-90deg) rotateZ(${(dragDegXFinal +=
    speed)}deg)`;

  //   subContainer.style.transform = `rotateX(-90deg) rotateZ(${(rotZ +=
  //     i)}deg) translateY(0vw)`;

  //   console.log(`isShiftDown: ${isShiftDown}`);
  //   console.log(`speedY: ${speedY}`);
  //   console.log(`maxSpeed: ${maxSpeed}`);
  //   console.log(`decel: ${decel}`);
};

window.addEventListener("keydown", (e) => keyDownHandler(e));
window.addEventListener("keyup", (e) => keyUpHandler(e));
const runtime = setInterval(wasdControls, 10);
