<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  value: { type: Number, default: 0 },
  duration: { type: Number, default: 1100 },
  decimals: { type: Number, default: 0 },
});

const display = ref(0);
const root = ref(null);
let frame = null;
let started = false;

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Interpolation avec une courbe ease-out (rendu « premium »).
function animateTo(target, from = display.value) {
  if (reduced) {
    display.value = target;
    return;
  }
  cancelAnimationFrame(frame);
  const start = performance.now();
  const delta = target - from;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / props.duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    display.value = from + delta * eased;
    if (t < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          animateTo(props.value, 0);
          io.unobserve(root.value);
        }
      });
    },
    { threshold: 0.4 }
  );
  if (root.value) io.observe(root.value);
  root.value._io = io;
});

// Réanime quand la valeur change (ex. recalcul du risque).
watch(
  () => props.value,
  (v) => {
    if (started) animateTo(v);
  }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  root.value?._io?.disconnect();
});

const formatted = () => display.value.toFixed(props.decimals);
</script>

<template>
  <span ref="root" class="mono">{{ formatted() }}</span>
</template>
