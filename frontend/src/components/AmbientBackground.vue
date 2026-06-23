<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useThemeStore } from "../stores/theme";

/**
 * Fond ambiant animé : un réseau de nœuds qui dérivent lentement et se relient
 * lorsqu'ils sont proches — métaphore visuelle des actifs interconnectés de
 * l'entreprise. Quelques nœuds « à risque » pulsent en rouge.
 *
 * 100 % canvas (performant), réactif à la souris (parallaxe douce), et
 * respectueux de la préférence « mouvement réduit ».
 */

const theme = useThemeStore();
const canvas = ref(null);
let ctx, raf, nodes = [];
let w = 0, h = 0, dpr = 1;
const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

// La palette s'adapte au thème (couleurs plus soutenues sur fond clair).
const COLORS = { base: "", line: "", risk: "" };
function applyPalette() {
  if (theme.mode === "light") {
    COLORS.base = "rgba(70, 95, 160, ";
    COLORS.line = "rgba(59, 111, 232, ";
    COLORS.risk = "rgba(224, 59, 86, ";
  } else {
    COLORS.base = "rgba(120, 150, 220, ";
    COLORS.line = "rgba(91, 140, 255, ";
    COLORS.risk = "rgba(255, 107, 125, ";
  }
}
applyPalette();
watch(() => theme.mode, () => {
  applyPalette();
  // En mode « mouvement réduit », la boucle ne tourne pas : on redessine une fois.
  if (ctx && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    frame(0);
    cancelAnimationFrame(raf);
  }
});

function resize() {
  const c = canvas.value;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = c.clientWidth;
  h = c.clientHeight;
  c.width = w * dpr;
  c.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function build() {
  const count = Math.min(58, Math.floor((w * h) / 22000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 1.6 + 0.8,
    risk: Math.random() < 0.16, // ~16 % de nœuds « vulnérables »
    phase: Math.random() * Math.PI * 2,
    depth: Math.random() * 0.6 + 0.4, // pour la parallaxe
  }));
}

function frame(t) {
  ctx.clearRect(0, 0, w, h);

  // lissage du déplacement de la souris (fluidité)
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  const px = (mouse.x - 0.5) * 40;
  const py = (mouse.y - 0.5) * 40;

  // liens entre nœuds proches
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 19000) {
        const alpha = (1 - d2 / 19000) * 0.5;
        ctx.strokeStyle = COLORS.line + alpha * 0.5 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x + px * a.depth, a.y + py * a.depth);
        ctx.lineTo(b.x + px * b.depth, b.y + py * b.depth);
        ctx.stroke();
      }
    }
  }

  // nœuds
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;

    const x = n.x + px * n.depth;
    const y = n.y + py * n.depth;

    if (n.risk) {
      const pulse = (Math.sin(t * 0.0025 + n.phase) + 1) / 2;
      const glow = 6 + pulse * 10;
      ctx.shadowColor = COLORS.risk + "0.9)";
      ctx.shadowBlur = glow;
      ctx.fillStyle = COLORS.risk + (0.55 + pulse * 0.4) + ")";
      ctx.beginPath();
      ctx.arc(x, y, n.r + 0.6 + pulse * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = COLORS.base + "0.55)";
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  raf = requestAnimationFrame(frame);
}

function onMouse(e) {
  mouse.tx = e.clientX / window.innerWidth;
  mouse.ty = e.clientY / window.innerHeight;
}

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  resize();
  build();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    frame(0); // un seul rendu statique
    cancelAnimationFrame(raf);
  } else {
    raf = requestAnimationFrame(frame);
    window.addEventListener("mousemove", onMouse, { passive: true });
  }

  window.addEventListener("resize", () => {
    resize();
    build();
  });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("mousemove", onMouse);
});
</script>

<template>
  <div class="ambient" aria-hidden="true">
    <canvas ref="canvas" class="ambient-canvas" />
    <div class="ambient-glow glow-a" />
    <div class="ambient-glow glow-b" />
    <div class="ambient-grid" />
  </div>
</template>

<style scoped>
.ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background:
    radial-gradient(1200px 700px at 78% -8%, rgba(56, 120, 255, 0.12), transparent 60%),
    radial-gradient(900px 600px at 5% 10%, rgba(139, 123, 255, 0.1), transparent 58%),
    var(--bg);
}

.ambient-canvas { width: 100%; height: 100%; display: block; opacity: 0.85; }

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.5;
  animation: drift 22s ease-in-out infinite alternate;
}
.glow-a {
  width: 540px; height: 540px;
  background: radial-gradient(circle, rgba(56, 225, 240, 0.22), transparent 70%);
  top: -160px; right: -80px;
}
.glow-b {
  width: 620px; height: 620px;
  background: radial-gradient(circle, rgba(139, 123, 255, 0.2), transparent 70%);
  bottom: -220px; left: -120px;
  animation-delay: -8s;
}

.ambient-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 75%);
}

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(40px, 30px) scale(1.12); }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-glow { animation: none; }
}
</style>
