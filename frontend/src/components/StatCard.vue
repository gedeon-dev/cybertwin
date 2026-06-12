<script setup>
import { computed } from "vue";
import AnimatedNumber from "./AnimatedNumber.vue";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  hint: { type: String, default: "" },
  accent: { type: String, default: "var(--accent-2)" },
});

const isNumber = computed(() => typeof props.value === "number");
</script>

<template>
  <div class="stat" :style="{ '--c': accent }">
    <div class="stat-glow" />
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">
      <AnimatedNumber v-if="isNumber" :value="value" />
      <span v-else class="mono">{{ value }}</span>
    </div>
    <div v-if="hint" class="stat-hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.stat {
  position: relative;
  background: var(--glass);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 1.4rem 1.4rem 1.2rem;
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: transform 0.5s var(--ease), border-color 0.4s;
}
.stat:hover { transform: translateY(-4px); border-color: var(--border); }
.stat:hover .stat-glow { opacity: 1; }

.stat-glow {
  position: absolute;
  top: -40px; left: -40px;
  width: 120px; height: 120px;
  background: radial-gradient(circle, var(--c), transparent 70%);
  opacity: 0.35;
  filter: blur(30px);
  transition: opacity 0.4s;
  pointer-events: none;
}

.stat-label { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; position: relative; }
.stat-value {
  font-family: var(--font-mono);
  font-size: 2.3rem;
  font-weight: 700;
  line-height: 1.1;
  margin-top: 0.35rem;
  position: relative;
}
.stat-hint { font-size: 0.78rem; color: var(--text-faint); margin-top: 0.3rem; position: relative; }
</style>
