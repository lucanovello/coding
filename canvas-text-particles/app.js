class Text {
  constructor(
    text,
    width = window.innerWidth * 0.3,
    height = window.innerHeight * 0.3,
    x = window.innerWidth * 0.5 - width * 0.5,
    y = window.innerHeight * 0.5 - height * 0.5,
    color = "white"
  ) {
    this.canvas;
    this.context;
    this.text = text.toString();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hue = 45;
    this.saturation = 100;
    this.brightness = 50;
    this.alpha = 1;
    this.fontWeight = 900;
    this.fontSize = 40;
    this.fontFamily = "Poppins";
    this.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.data;
    this.imageData;
    this.imageOutput = [];
    this.pixelWidth = 1;
    this.initCanvas();
    this.draw();
  }
  initCanvas() {
    // Initialize Player Canvas **************************************************************************************************************
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = "canvas-text";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = ctx;

    this.imageData = this.context.getImageData(
      this.x,
      this.y - this.fontSize,
      Math.ceil(this.context.measureText(this.text).width) * 4,
      this.fontSize
    );

    this.data = this.imageData.data;
    for (let i = 0; i < this.data.length; i += 4) {
      const pixel = this.data[i];
      if (pixel > 0) {
        this.imageOutput.push(1);
      } else {
        this.imageOutput.push(0);
      }
    }
  }
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
    this.context.font = this.font;
    this.context.fillText(this.text, this.x, this.y);
    this.context.closePath();

    const width = Math.ceil(this.context.measureText(this.text).width) * 4;
    const height = this.fontSize;

    const pixelStart = { x: 10, y: 100 };
    for (let i = 0; i < this.data.length; i++) {
      const pixel = this.data[i];
      const x = pixelStart.x + (i % width) * this.pixelWidth;
      const y = pixelStart.y + Math.floor(i / width) * this.pixelWidth;
      this.context.beginPath();
      if (pixel > 0) {
        const pixelColor = `green`;
        this.context.strokeStyle = "white";
        this.context.lineWidth = 1;
        this.context.rect(x, y, this.pixelWidth, this.pixelWidth);
        this.context.fill();
        // this.context.stroke();
        this.context.closePath();
      }
    }

    // this.pixelWidth += 0.01;
    // this.alpha -= 0.01;
  }
}

const text = new Text("LucaNovello");

// MAIN FUNCTION **********************************************************************************************************************************
function animate() {
  text.draw();

  requestAnimationFrame(animate);
}
animate();
