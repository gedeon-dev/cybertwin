<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  score: { type: Number, default: 0 },
  level: { type: String, default: "faible" },
  size: { type: Number, default: 220 },
});

const RADIUS = 80;
const CIRC = 2 * Math.PI * RADIUS;
const ARC_FRACTION = 0.75; // 270°
const ARC_LEN = CIRC * ARC_FRACTION;

const color = computed(() => {
  if (props.level === "élevé") return "var(--risk-high)";
  if (props.level === "moyen") return "var(--risk-mid)";
  return "var(--risk-low)";
});

const glowColor = computed(() => {
  if (props.level === "élevé") return "rgba(255,107,125,0.55)";
  if (props.level === "moyen") return "rgba(255,207,92,0.5)";
  return "rgba(52,226,160,0.5)";
});

const filled = computed(() => (props.score / 100) * ARC_LEN);
const dashArray = computed(() => `${filled.value} ${CIRC}`);

const levelLabel = computed(() => {
  const map = { faible: "Faible", moyen: "Moyen", élevé: "Élevé" };
  return map[props.level] ?? props.level;
});

// Compteur animé du score.
const shown = ref(0);
let raf = null;
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animate(to, from = shown.value) {
  if (reduced) { shown.value = to; return; }
  cancelAnimationFrame(raf);
  const start = performance.now();
  const delta = to - from;
  const step = (now) => {
    const t = Math.min(1, (now - start) / 1100);
    const eased = 1 - Math.pow(1 - t, 3);
    shown.value = Math.round(from + delta * eased);
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

onMounted(() => animate(props.score, 0));
watch(() => props.score, (v) => animate(v));
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <div class="gauge" :style="{ width: size + 'px', height: size + 'px' }">
    <svg viewBox="0 0 200 200" :width="size" :height="size">
      <g transform="rotate(135 100 100)">
        <circle cx="100" cy="100" :r="RADIUS" fill="none" class="track"
          stroke-width="13" stroke-linecap="round" :stroke-dasharray="`${ARC_LEN} ${CIRC}`" />
        <circle cx="100" cy="100" :r="RADIUS" fill="none" :stroke="color"
          stroke-width="13" stroke-linecap="round" :stroke-dasharray="dashArray"
          class="value-arc" :style="{ filter: `drop-shadow(0 0 10px ${glowColor})` }" />
      </g>
    </svg>

    <div class="readout">
      <div class="score mono" :style="{ color }">{{ shown }}</div>
      <div class="outof mono">/ 100</div>
      <div class="level" :style="{ color }">Risque {{ levelLabel }}</div>
    </div>

    <div class="halo" :style="{ background: `radial-gradient(circle, ${glowColor}, transparent 70%)` }" />
  </div>
</template>

<style scoped>
.gauge { position: relative; display: grid; place-items: center; }
.track { stroke: var(--track); }
.value-arc { transition: stroke-dasharray 1s var(--ease); }

.readout {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
}
.score { font-size: 3.4rem; font-weight: 700; line-height: 1; }
.outof { font-size: 0.85rem; color: var(--text-faint); margin-top: 0.15rem; }
.level { font-family: var(--font-display); font-weight: 600; font-size: 0.98rem; margin-top: 0.55rem; }

.halo {
  position: absolute; inset: 14%;
  border-radius: 50%; opacity: 0.5;
  filter: blur(26px); z-index: -1;
  animation: pulse 3.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.32; transform: scale(0.94); }
  50% { opacity: 0.55; transform: scale(1.04); }
}
@media (prefers-reduced-motion: reduce) { .halo { animation: none; } }
</style>
