window.addEventListener("DOMContentLoaded", () => {
  class Page {
    constructor() {
      this.element = document.querySelector("#main-content");
      this.accWheel = 5;
      this.accKeys = 1;
      this.accPage = 10;
      this.scrollAcc = this.accWheel;
      this.scrollDec = this.accWheel * 0;
      this.scrollVel = 0;
      this.scrollVelMin = 0.1;
      this.scrollUp = 0;
      this.scrollDown = 0;
      this.scrollDir = this.scrollUp - this.scrollDown;
      this.isWheel = false;
      this.wheelTimeout;
      this.scrollY = document.scrollingElement.scrollTop;
      this.scrollYMax = this.element.scrollHeight - window.innerHeight;
      this.scrollYBounce = 0.1;
      console.dir(window.document);
    }
    mousemoveHandler(e) {
      this.x = e.clientX;
      this.y = e.clientY;
    }
    wheelHandler(e) {
      e.preventDefault();
      this.scrollAcc = this.accWheel;
      this.isWheel = true;
      if (e.deltaY < 0) {
        this.scrollUp = 1;
        setTimeout(() => {
          this.scrollUp = 0;
        }, 100);
      } else if (e.deltaY > 0) {
        this.scrollDown = 1;
        setTimeout(() => {
          this.scrollDown = 0;
          this.isWheel = false;
        }, 100);
      }
    }
    scrollHandler(e) {
      e.preventDefault();
    }
    update() {
      this.scrollDir = this.scrollDown - this.scrollUp;

      // check if the scroll velocity is less than the minimum and set it to 0
      if (
        this.scrollDir == 0 &&
        this.scrollVel < this.scrollVelMin &&
        this.scrollVel > -this.scrollVelMin
      ) {
        this.scrollVel = 0;
      }

      //   check if the scroll position is at the top or bottom and move accordingly
      if (this.scrollY <= 0) {
        this.scrollY = 0;
      }
      if (this.scrollY >= this.scrollYMax) {
        this.scrollY = this.scrollYMax;
      }

      if (this.scrollY < 0 || this.scrollY > this.scrollYMax) {
        this.scrollVel -= this.scrollVel * this.scrollDec;
      } else {
        this.scrollVel +=
          this.scrollAcc * this.scrollDir - this.scrollVel * this.scrollDec;
      }

      this.scrollY += this.scrollVel;
      page.element.style.transform = `translateY(${-this.scrollY}px)`;

      this.scrollY += this.scrollVel;
      page.element.style.transform = `translateY(${-this.scrollY}px)`;

      // change the nav bar style when scrolling
      if (this.scrollY > 100) {
        document.querySelector("#nav").classList.add("nav-scrolled");
      } else {
        document.querySelector("#nav").classList.remove("nav-scrolled");
      }
    }
    debug() {
      console.log(
        `scrollAcc: ${this.scrollAcc}\nscrollDec: ${this.scrollDec}\nscrollVel: ${this.scrollVel}\nscrollDir: ${this.scrollDir}\nscrollY: ${this.scrollY}\nscrollYMax: ${this.scrollYMax}\nscrollTop: ${document.scrollingElement.scrollTop}\nscrollHeight: ${this.element.scrollHeight}\nscrollUp: ${this.scrollUp}\nscrollDown: ${this.scrollDown}`
      );
    }
  }

  const page = new Page();
  window.scrollTo(0, 0);
  window.addEventListener("mousemove", (e) => page.mousemoveHandler(e));
  window.addEventListener("wheel", (e) => page.wheelHandler(e), {
    passive: false,
  });
  window.addEventListener("scroll", (e) => page.scrollHandler(e));
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        page.scrollAcc = page.accKeys;
        page.scrollUp = 1;
        break;
      case "ArrowDown":
        page.scrollAcc = page.accKeys;
        page.scrollDown = 1;
        break;
      case "PageUp":
        page.scrollAcc = page.accPage;
        page.scrollUp = 1;
        break;
      case "PageDown":
        page.scrollAcc = page.accPage;
        page.scrollDown = 1;
        break;
      default:
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "PageUp":
        page.scrollUp = 0;
        break;
      case "ArrowDown":
      case "PageDown":
        page.scrollDown = 0;
        break;
      default:
        break;
    }
  });

  function main() {
    page.update();
    page.debug();
    requestAnimationFrame(main);
  }

  main();
});
