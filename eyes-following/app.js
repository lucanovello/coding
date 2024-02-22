const outer = document.getElementById('outer');
const eyeLeft = document.getElementById('innerL');
const eyeRight = document.getElementById('innerR');
const eyes = document.getElementById('eyes');
const eyeLeftPosition = eyeLeft.getBoundingClientRect();
const eyeRightPosition = eyeRight.getBoundingClientRect();
const eyesPosition = eyes.getBoundingClientRect();
const scale = 120;

window.addEventListener('mousemove', mousemoveHandler);

function mousemoveHandler(e) {
  const radianLeft = Math.atan2(
    e.x - eyeLeftPosition.x,
    e.y - eyeLeftPosition.y
  );
  const radianRight = Math.atan2(
    e.x - eyeRightPosition.x,
    e.y - eyeRightPosition.y
  );
  eyeLeft.style.transform = `translate(${Math.sin(radianLeft) * scale}%, ${
    Math.cos(radianLeft) * scale
  }%)`;
  eyeRight.style.transform = `translate(${Math.sin(radianRight) * scale}%, ${
    Math.cos(radianRight) * scale
  }%)`;
}

function calcAngleDegrees(x, y) {
  return (Math.atan2(y, x) * 180) / Math.PI;
}
