<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
});

const canvas = ref(null);
let chart = null;

// Palette dérivée de l'accent : variations froides cohérentes avec le thème.
const PALETTE = [
  "#22d3ee",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#34d399",
  "#f472b6",
];

function render() {
  if (!canvas.value) return;
  if (chart) chart.destroy();
  chart = new Chart(canvas.value, {
    type: "doughnut",
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: PALETTE,
          borderColor: "#0e1428",
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#8a97b3",
            font: { family: "Inter", size: 12 },
            boxWidth: 12,
            padding: 12,
          },
        },
        tooltip: {
          backgroundColor: "#1b2440",
          borderColor: "#25304d",
          borderWidth: 1,
          titleFont: { family: "Space Grotesk" },
          bodyFont: { family: "JetBrains Mono" },
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
