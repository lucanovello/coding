// Written by ChatGPT
// Prompt 1: write me a JavaScript project that uses the canvas API to simulate quark fluctuations
// Prompt 2: use real scientific formulas to represent a meson and how confinement would work.  add adjustable variables from the real scientific formulas that can be adjusted by the user to see how it would change the interaction.  make everything based off of the most advanced understanding we have regarding quarks

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants based on Quantum Chromodynamics (QCD)
const k = 0.9; // String tension (GeV/fm)
const alpha_s = 0.3; // Strong coupling constant
const quarkMass = { u: 2.2, d: 4.7, s: 95 }; // Quark masses in MeV
const c = 299792458; // Speed of light in m/s

// User-adjustable parameters
let stringTension = k * 0.1;
let strongCoupling = alpha_s * 1000;

const colors = { u: "red", d: "blue", s: "green" };
const quarks = [];

class Quark {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 5 + 5;
    this.color = colors[type];
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Meson {
  constructor(q1, q2) {
    this.q1 = q1;
    this.q2 = q2;
  }

  computeForce() {
    let dx = this.q2.x - this.q1.x;
    let dy = this.q2.y - this.q1.y;
    let r = Math.sqrt(dx * dx + dy * dy);

    // QCD potential: V(r) = - (4/3) * (alpha_s / r) + k * r
    let V = (-4 / 3) * (strongCoupling / r) + stringTension * r;
    let force = -dV_dr(r); // Confinement force
    let fx = (dx / r) * force;
    let fy = (dy / r) * force;

    this.q1.vx += fx;
    this.q1.vy += fy;
    this.q2.vx -= fx;
    this.q2.vy -= fy;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.q1.x, this.q1.y);
    ctx.lineTo(this.q2.x, this.q2.y);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function dV_dr(r) {
  return (4 / 3) * (strongCoupling / (r * r)) - stringTension;
}

function init() {
  let q1 = new Quark(
    "u",
    Math.random() * canvas.width,
    Math.random() * canvas.height
  );
  let q2 = new Quark(
    "d",
    Math.random() * canvas.width,
    Math.random() * canvas.height
  );
  quarks.push(q1, q2);
  meson = new Meson(q1, q2);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  meson.computeForce();
  quarks.forEach((quark) => {
    quark.move();
    quark.draw();
  });
  meson.draw();
  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// UI to adjust parameters
document
  .getElementById("stringTensionSlider")
  .addEventListener("input", (e) => {
    stringTension = parseFloat(e.target.value);
  });

document
  .getElementById("strongCouplingSlider")
  .addEventListener("input", (e) => {
    strongCoupling = parseFloat(e.target.value);
  });
