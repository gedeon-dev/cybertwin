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

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  colors: { type: Array, default: () => ["#34d399", "#fbbf24", "#f87171"] },
});

const canvas = ref(null);
let chart = null;

function render() {
  if (!canvas.value) return;
  if (chart) chart.destroy();
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
          backgroundColor: "#1b2440",
          borderColor: "#25304d",
          borderWidth: 1,
          bodyFont: { family: "JetBrains Mono" },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8a97b3", font: { family: "Inter", size: 12 } },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#5d6a86", stepSize: 1, font: { family: "JetBrains Mono" } },
          grid: { color: "#1d273f" },
        },
      },
    },
  });
}

onMounted(render);
watch(() => [props.labels, props.data], render, { deep: true });
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
