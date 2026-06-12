<script setup>
import { computed } from "vue";

const props = defineProps({
  score: { type: Number, default: 0 },
  level: { type: String, default: "faible" },
  size: { type: Number, default: 220 },
});

// Arc semi-circulaire (270°) : on dessine la jauge sur un cercle ouvert.
const RADIUS = 80;
const CIRC = 2 * Math.PI * RADIUS;
const ARC_FRACTION = 0.75; // 270° sur 360°
const ARC_LEN = CIRC * ARC_FRACTION;

const color = computed(() => {
  if (props.level === "élevé") return "var(--risk-high)";
  if (props.level === "moyen") return "var(--risk-mid)";
  return "var(--risk-low)";
});

// Longueur remplie proportionnelle au score (0-100).
const filled = computed(() => (props.score / 100) * ARC_LEN);
const dashArray = computed(() => `${filled.value} ${CIRC}`);

const levelLabel = computed(() => {
  const map = { faible: "Faible", moyen: "Moyen", élevé: "Élevé" };
  return map[props.level] ?? props.level;
});
</script>

<template>
  <div class="gauge" :style="{ width: size + 'px' }">
    <svg viewBox="0 0 200 200" :width="size" :height="size">
      <!-- l'arc commence en bas à gauche, ouverture de 90° vers le bas -->
      <g transform="rotate(135 100 100)">
        <!-- piste -->
        <circle
          cx="100"
          cy="100"
          :r="RADIUS"
          fill="none"
          stroke="var(--border)"
          stroke-width="14"
          stroke-linecap="round"
          :stroke-dasharray="`${ARC_LEN} ${CIRC}`"
        />
        <!-- valeur -->
        <circle
          cx="100"
          cy="100"
          :r="RADIUS"
          fill="none"
          :stroke="color"
          stroke-width="14"
          stroke-linecap="round"
          :stroke-dasharray="dashArray"
          class="value-arc"
        />
      </g>
    </svg>

    <div class="readout">
      <div class="score mono" :style="{ color }">{{ score }}</div>
      <div class="outof mono">/ 100</div>
      <div class="level" :style="{ color }">Risque {{ levelLabel }}</div>
    </div>
  </div>
</template>

<style scoped>
.gauge {
  position: relative;
  display: grid;
  place-items: center;
}

.value-arc {
  transition: stroke-dasharray 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.readout {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.score {
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1;
}

.outof {
  font-size: 0.85rem;
  color: var(--text-faint);
  margin-top: 0.1rem;
}

.level {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}
</style>
