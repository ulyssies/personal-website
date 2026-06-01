// ── PARTICLE NETWORK BACKGROUND ───────────────────────────
const canvas = document.getElementById('particle-network-canvas');
if (canvas) {
const networkRoot = document.documentElement;
const ctx = canvas.getContext('2d');

let networkW = 0;
let networkH = 0;
let networkDpr = 1;
let networkPalette;
const networkParticles = [];
const networkMouse = { x: 0, y: 0, active: false };

const NETWORK_PARTICLE_COUNT = 96;
const NETWORK_LINK_DISTANCE = 150;
const NETWORK_MOUSE_DISTANCE = 175;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createNetworkParticle(x = Math.random() * networkW, y = Math.random() * networkH) {
  const depth = randomBetween(0.58, 1.34);
  const angle = Math.random() * Math.PI * 2;
  const speed = randomBetween(0.07, 0.25) / depth;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(2.2, 4.8) * depth,
    depth,
  };
}

function createNetworkSeedPosition(centers) {
  if (Math.random() > 0.72) {
    return {
      x: Math.random() * networkW,
      y: Math.random() * networkH,
    };
  }

  const center = centers[Math.floor(Math.random() * centers.length)];
  return {
    x: clamp(center.x + randomBetween(-145, 145), 0, networkW),
    y: clamp(center.y + randomBetween(-125, 125), 0, networkH),
  };
}

function seedNetworkParticles() {
  const centers = Array.from({ length: 12 }, () => ({
    x: Math.random() * networkW,
    y: Math.random() * networkH,
  }));

  for (let i = 0; i < NETWORK_PARTICLE_COUNT; i++) {
    const seed = createNetworkSeedPosition(centers);
    networkParticles.push(createNetworkParticle(seed.x, seed.y));
  }
}

function getNetworkPalette() {
  const styles = getComputedStyle(networkRoot);
  return {
    bg: styles.getPropertyValue('--network-bg').trim(),
    dot: styles.getPropertyValue('--network-dot').trim(),
    dotRgb: styles.getPropertyValue('--network-dot-rgb').trim(),
    lineRgb: styles.getPropertyValue('--network-line-rgb').trim(),
    lineAlpha: Number(styles.getPropertyValue('--network-line-alpha')) || 0.3,
  };
}

function refreshNetworkPalette() {
  networkPalette = getNetworkPalette();
}

function resizeNetworkCanvas() {
  const previousW = networkW || window.innerWidth;
  const previousH = networkH || window.innerHeight;

  networkW = window.innerWidth;
  networkH = window.innerHeight;
  networkDpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.max(1, Math.floor(networkW * networkDpr));
  canvas.height = Math.max(1, Math.floor(networkH * networkDpr));
  canvas.style.width = `${networkW}px`;
  canvas.style.height = `${networkH}px`;
  ctx.setTransform(networkDpr, 0, 0, networkDpr, 0, 0);

  if (!networkParticles.length) {
    seedNetworkParticles();
    return;
  }

  const xRatio = networkW / previousW;
  const yRatio = networkH / previousH;
  networkParticles.forEach(particle => {
    particle.x *= xRatio;
    particle.y *= yRatio;
  });
}

function drawNetworkLine(x1, y1, x2, y2, distance, maxDistance, palette, depth = 1) {
  const strength = Math.max(0, 1 - distance / maxDistance);
  const depthStrength = clamp(depth, 0.55, 1.45);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${palette.lineRgb},${palette.lineAlpha * Math.pow(strength, 1.15) * depthStrength})`;
  ctx.lineWidth = 0.45 + strength * 2.4 * depthStrength;
  ctx.stroke();
}

function moveNetworkParticles() {
  networkParticles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x <= particle.radius || particle.x >= networkW - particle.radius) {
      particle.vx *= -1;
      particle.x = Math.max(particle.radius, Math.min(networkW - particle.radius, particle.x));
    }

    if (particle.y <= particle.radius || particle.y >= networkH - particle.radius) {
      particle.vy *= -1;
      particle.y = Math.max(particle.radius, Math.min(networkH - particle.radius, particle.y));
    }
  });
}

function drawNetwork() {
  const palette = networkPalette;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, networkW, networkH);

  moveNetworkParticles();

  for (let i = 0; i < networkParticles.length; i++) {
    for (let j = i + 1; j < networkParticles.length; j++) {
      const first = networkParticles[i];
      const second = networkParticles[j];
      const dx = first.x - second.x;
      const dy = first.y - second.y;
      const distance = Math.hypot(dx, dy);

      if (distance < NETWORK_LINK_DISTANCE) {
        drawNetworkLine(first.x, first.y, second.x, second.y, distance, NETWORK_LINK_DISTANCE, palette, (first.depth + second.depth) / 2);
      }
    }
  }

  if (networkMouse.active) {
    networkParticles.forEach(particle => {
      const dx = particle.x - networkMouse.x;
      const dy = particle.y - networkMouse.y;
      const distance = Math.hypot(dx, dy);

      if (distance < NETWORK_MOUSE_DISTANCE) {
        drawNetworkLine(particle.x, particle.y, networkMouse.x, networkMouse.y, distance, NETWORK_MOUSE_DISTANCE, palette, particle.depth * 1.1);
      }
    });

    ctx.beginPath();
    ctx.arc(networkMouse.x, networkMouse.y, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = palette.dot;
    ctx.fill();
  }

  networkParticles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 1.9, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${palette.dotRgb},${0.08 * particle.depth})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${palette.dotRgb},${0.55 + 0.32 * particle.depth})`;
    ctx.fill();
  });

  requestAnimationFrame(drawNetwork);
}

window.addEventListener('mousemove', e => {
  networkMouse.x = e.clientX;
  networkMouse.y = e.clientY;
  networkMouse.active = true;
}, { passive: true });

window.addEventListener('mouseout', e => {
  if (!e.relatedTarget) networkMouse.active = false;
}, { passive: true });

window.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  if (!touch) return;
  networkMouse.x = touch.clientX;
  networkMouse.y = touch.clientY;
  networkMouse.active = true;
}, { passive: true });

window.addEventListener('touchend', () => {
  networkMouse.active = false;
}, { passive: true });

window.addEventListener('resize', resizeNetworkCanvas, { passive: true });
window.refreshNetworkPalette = refreshNetworkPalette;
refreshNetworkPalette();
resizeNetworkCanvas();
drawNetwork();

}
