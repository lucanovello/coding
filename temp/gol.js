// Setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height; // Grid settings
const gridSize = 50; // Cells per side
const cellSize = width / gridSize; // Pixel size of each cell
const grid = []; // 2D array for energy values
// Initialize grid with uniform energy (e.g., 10)
for (let i = 0; i < gridSize; i++) {
  grid[i] = [];
  for (let j = 0; j < gridSize; j++) {
    grid[i][j] = 10; // Base energy level
  }
}

// Place a "mass" at a fixed point (e.g., near center)
const massX = Math.floor(gridSize / 2);
const massY = Math.floor(gridSize / 2);
grid[massX][massY] = -10; // Low energy at mass point
// Particle for motion simulation
let particle = {
  x: gridSize - 2, // Start near edge
  y: gridSize / 2,
  vx: -1, // Velocity x
  vy: -1, // Velocity y
};

// Smooth energy gradient around mass
function updateGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (i === massX && j === massY) continue; // Skip mass itself
      // Energy increases with distance from mass
      const dx = i - massX;
      const dy = j - massY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(2, 10 - distance); // Min energy 2, max 10

      grid[i][j] = influence;
    }
  }
}

// Move particle based on energy gradient (gravitational pull)
function moveParticle() {
  const px = Math.floor(particle.x);
  const py = Math.floor(particle.y); // Simple gradient-based "force" toward lower energy
  const left = px > 0 ? grid[px - 1][py] : grid[px][py];
  const right = px < gridSize - 1 ? grid[px + 1][py] : grid[px][py];
  const up = py > 0 ? grid[px][py - 1] : grid[px][py];
  const down = py < gridSize - 1 ? grid[px][py + 1] : grid[px][py]; // Accelerate toward lower energy
  particle.vx += (left - right) * 0.05; // Compare horizontal neighbors
  particle.vy += (up - down) * 0.05; // Compare vertical neighbors
  // Update position
  particle.x += parseFloat(particle.vx.toFixed(1));
  particle.y += parseFloat(particle.vy.toFixed(1)); // Damping to prevent wild oscillation
  particle.vx *= 0.9;
  particle.vy *= 0.9; // Keep particle in bounds
  particle.x = Math.max(0, Math.min(gridSize - 1, particle.x));
  particle.y = Math.max(0, Math.min(gridSize - 1, particle.y));
}

// Draw the grid and particle
function draw() {
  ctx.clearRect(0, 0, width, height); // Draw grid cells with color based on energy
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const energy = grid[i][j]; // Color: blue (high energy) to red (low energy)
      //   const r = Math.floor(359 * (1 - energy / 10));
      //   const b = Math.floor(359 * (energy / 10));
      const h = Math.floor(359 * (1 - energy / 10));
      const s = Math.floor(100 * (energy / 10));
      //   ctx.fillStyle = `rgb(${r}, 0, ${b})`;
      ctx.fillStyle = `hsl(${h}, 100%, ${s}%)`;
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }

  // Draw particle as a white dot
  ctx.fillStyle = "white";
  ctx.beginPath();
  //   ctx.arc(
  //     particle.x * cellSize + cellSize / 2,
  //     particle.y * cellSize + cellSize / 2,
  //     cellSize,
  //     0,
  //     Math.PI * 2
  //   );
  ctx.rect(particle.x * cellSize, particle.y * cellSize, cellSize, cellSize);
  ctx.fill();
}

// Animation loop
function loop() {
  updateGrid(); // Recalculate energy gradient
  moveParticle(); // Move particle toward mass
  draw(); // Render the scene
  //   requestAnimationFrame(loop);
}

// Start the simulation
// loop();

setInterval(() => {
  loop();
}, 100);
