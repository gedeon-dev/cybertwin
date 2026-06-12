<script setup>
import { computed } from "vue";

const props = defineProps({
  level: { type: String, required: true }, // faible | moyenne | élevée | moyen | élevé
});

// Mappe les valeurs de criticité ET de niveau de risque vers une classe.
const cls = computed(() => {
  const v = props.level;
  if (v === "élevée" || v === "élevé") return "badge-high";
  if (v === "moyenne" || v === "moyen") return "badge-mid";
  return "badge-low";
});

const label = computed(() => {
  const map = {
    faible: "Faible",
    moyenne: "Moyenne",
    élevée: "Élevée",
    moyen: "Moyen",
    élevé: "Élevé",
  };
  return map[props.level] ?? props.level;
});
</script>

<template>
  <span class="badge" :class="cls">
    <span class="dot" />
    {{ label }}
  </span>
</template>
