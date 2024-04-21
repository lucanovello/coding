class Gear {
  constructor() {
    this.element = document.getElementById("gear");
    this.angle = 0;
    this.acc = 0.05;
    this.decel = 0.01;
    this.vel = 0;
    this.force = 0;
    this.direction = 1;
  }
}

const gear = new Gear();

gear.element.addEventListener("mouseover", (e) => {
  gear.force = 1;
});

gear.element.addEventListener("mouseout", (e) => {
  gear.force = 0;
});

window.addEventListener("mousedown", (e) => {
  e.preventDefault();
  gear.direction = -1;
});
window.addEventListener("mouseup", (e) => {
  e.preventDefault();
  gear.direction = 1;
});

function main() {
  gear.element.style.transform = `rotate(${gear.angle}deg)`;
  gear.vel += gear.acc * gear.force * gear.direction;
  gear.angle += gear.vel - gear.angle * gear.decel;

  requestAnimationFrame(main);
}

main();
