<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  hint: { type: String, default: "" },
  accent: { type: String, default: "var(--accent)" },
});
</script>

<template>
  <div class="stat">
    <div class="stat-bar" :style="{ background: accent }" />
    <div class="stat-body">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value mono">{{ value }}</div>
      <div v-if="hint" class="stat-hint">{{ hint }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  gap: 0.9rem;
  background: linear-gradient(180deg, var(--panel), var(--bg-2));
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 1.2rem;
  box-shadow: var(--shadow);
}

.stat-bar {
  width: 4px;
  border-radius: 4px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  margin-top: 0.2rem;
}

.stat-hint {
  font-size: 0.78rem;
  color: var(--text-faint);
  margin-top: 0.2rem;
}
</style>
