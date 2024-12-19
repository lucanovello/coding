var _particles = [];
var _canvas, _ctx, _width, _height;

(function () {
  init();
})();

function init() {
  setupParticles(getTextCanvasData());
}

function getTextCanvasData() {
  var w = window.innerWidth,
    h = window.innerHeight,
    ratio = 3;

  _canvas = document.getElementById("textCanvas");
  _canvas.width = w * ratio;
  _canvas.height = h * ratio;
  _canvas.style.width = w + "px";
  _canvas.style.height = h + "px";

  _ctx = _canvas.getContext("2d");
  _ctx.imageSmoothingEnabled = false;
  _ctx.fillStyle = "rgb(0, 154, 253)";
  _ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  var str = "Luca";
  _ctx.font = "900 32px Arial";
  _ctx.fillText(str, 0, 23);

  _width = _canvas.width;
  _height = _canvas.height;

  var pixels = _ctx.getImageData(0, 0, _width, _height).data;
  var data32 = new Uint32Array(pixels.buffer);
  var positions = [];
  for (i = 0; i < data32.length; i++) {
    if (data32[i] & 0xffff0000) {
      positions.push({
        x: i % _width,
        y: (i / _width) | 0,
        a: pixels[i * 4 + 3] / 255,
      });
    }
  }

  return positions;
}

function setupParticles(positions) {
  var i = positions.length;
  while (i--) {
    var p = new Particle();
    p.init(positions[i]);
    _particles.push(p);

    drawParticle(p);
  }
}

function drawParticle(particle, hue) {
  var x = particle.x;
  var y = particle.y;
  var hue = getRandomFromRange(45, 45);
  var saturation = getRandomFromRange(100, 100);
  var lightness = getRandomFromRange(50, 50);
  var size = 4;

  _ctx.beginPath();
  _ctx.fillStyle = `hsla(${hue},${saturation}%, ${lightness}%, 1)`;

  _ctx.fillRect(x * size, y * size, size * 0.5, size * 0.5);
}

function Particle() {
  this.init = function (pos) {
    this.x = pos.x;
    this.y = pos.y + 30;
    this.x0 = this.x;
    this.y0 = this.y;
    this.xDelta = 0;
    this.yDelta = 0;
    this.alpha = pos.a;
  };
}

function getRandomFromRange(min, max) {
  return Math.random() * (max - min) + min;
}

console.log(_particles);
