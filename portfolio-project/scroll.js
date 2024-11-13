const body = document.querySelector("body");

const ACC_BASE = 5;
const ACC_DAMP = ACC_BASE * 0.1;
const DEC_BASE = 0.05;
const DEC_DAMP = DEC_BASE * 0.01;

function debug(user) {
  console.log(`scrollAcc: ${user.scrollAcc}
scrollDec: ${user.scrollDec}
scrollVel: ${user.scrollVel}
scrollVelMin: ${user.scrollVelMin}
scrollDir: ${user.scrollDir}
scrollY: ${user.scrollY}
scrollYMax: ${user.scrollYMax}
scrollYMinRange: ${user.scrollYMinRange}
scrollYDiff: ${user.scrollYDiff}
                `);
}

const mouse = {
  x: 0,
  y: 0,
  scrollAcc: ACC_BASE,
  scrollDec: DEC_BASE,
  scrollVel: 0,
  scrollVelMin: 0.1,
  scrollDir: 0,
  scrollY: window.scrollY,
  scrollYMax: document.body.clientHeight - window.innerHeight,
  scrollYMinRange: 100,
  scrollYDiff: this.scrollYMax - this.scrollY,
  scrollYNorm: this.scrollY / this.scrollYMax,
  scrollYNormAdj: (this.scrollYNorm - 0.5) * -4 * (this.scrollYNorm - 0.5) + 1,
  scrollYNormAdjMin: 0.1,

  mousemoveHandler(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  },
  wheelHandler(e) {
    e.preventDefault();
    this.scrollDir = Math.sign(e.deltaY);
  },
  scrollHandler(e) {
    e.preventDefault();
    this.scrollY = window.scrollY;
  },
  update() {
    if (this.scrollDir === 0 && this.scrollVel == 0) return;
    this.scrollYDiff = this.scrollYMax - this.scrollY;
    // check if scroll is at the top or bottom and set velocity to 0
    if (
      ((this.scrollYDiff == this.scrollYMax && this.scrollVel < 0) ||
        (this.scrollYDiff == 0 && this.scrollVel > 0)) &&
      this.scrollDir == 0
    ) {
      this.scrollVel = 0;
    } else {
      // check if scroll velocity is below minimum threshold and set to 0
      if (
        this.scrollDir == 0 &&
        this.scrollVel < this.scrollVelMin &&
        this.scrollVel > -this.scrollVelMin
      ) {
        this.scrollVel = 0;
      }

      // dampen scroll acceleration and deceleration when at the top or bottom
      if (
        (this.scrollYDiff > this.scrollYMax - this.scrollYMinRange &&
          this.scrollVel < 0) ||
        (this.scrollYDiff < this.scrollYMinRange && this.scrollVel > 0)
      ) {
        this.scrollAcc = ACC_DAMP;
        this.scrollDec = DEC_DAMP;
        this.scrollVel *= 0.9;
      } else {
        this.scrollDec = 0;
        this.scrollAcc = ACC_BASE;
        this.scrollDec = DEC_BASE;
      }

      // update scroll velocity
      this.scrollVel +=
        this.scrollAcc * this.scrollDir - this.scrollVel * this.scrollDec;
      const finalScrollVel = this.scrollY + this.scrollVel;
      window.scroll(0, finalScrollVel);
    }

    debug(this);
    // reset scroll direction
    this.scrollDir = 0;
  },
};

window.addEventListener("mousemove", (e) => mouse.mousemoveHandler(e));
window.addEventListener("wheel", (e) => mouse.wheelHandler(e), {
  passive: false,
});
window.addEventListener("scroll", (e) => mouse.scrollHandler(e));

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      mouse.scrollDir = -1;
      break;
    case "s":
    case "ArrowDown":
      mouse.scrollDir = 1;
      break;
    default:
      break;
  }
});

function main() {
  mouse.update();
  requestAnimationFrame(main);
}

main();
