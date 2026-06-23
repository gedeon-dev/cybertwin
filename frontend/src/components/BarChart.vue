<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useThemeStore } from "../stores/theme";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  colors: { type: Array, default: () => ["#34d399", "#fbbf24", "#f87171"] },
});

const theme = useThemeStore();
const canvas = ref(null);
let chart = null;

const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function render() {
  if (!canvas.value) return;
  if (chart) chart.destroy();
  const tickColor = cssVar("--text-muted") || "#8a97b3";
  const faint = cssVar("--text-faint") || "#5d6a86";
  const grid = cssVar("--border-soft") || "#1d273f";
  chart = new Chart(canvas.value, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: props.colors,
          borderRadius: 6,
          barThickness: 46,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cssVar("--bg-3") || "#1b2440",
          titleColor: cssVar("--text") || "#fff",
          bodyColor: tickColor,
          borderColor: cssVar("--border") || "#25304d",
          borderWidth: 1,
          bodyFont: { family: "JetBrains Mono" },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { family: "Inter", size: 12 } },
        },
        y: {
          beginAtZero: true,
          ticks: { color: faint, stepSize: 1, font: { family: "JetBrains Mono" } },
          grid: { color: grid },
        },
      },
    },
  });
}

onMounted(render);
watch(() => [props.labels, props.data], render, { deep: true });
watch(() => theme.mode, render);
onBeforeUnmount(() => chart && chart.destroy());
</script>

<template>
  <div class="chart-box">
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
  height: 260px;
}
</style>
