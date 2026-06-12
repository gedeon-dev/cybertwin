<script setup>
defineProps({
  title: { type: String, default: "" },
});
const emit = defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="modal panel" role="dialog" aria-modal="true">
        <div class="row-between modal-head">
          <h3>{{ title }}</h3>
          <button class="btn btn-ghost btn-sm" @click="emit('close')" aria-label="Fermer">✕</button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 18, 0.7);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  z-index: 900;
  animation: fade 0.15s ease;
}

.modal {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: pop 0.16s ease;
}

.modal-head {
  margin-bottom: 1.2rem;
}

@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes pop {
  from { opacity: 0; transform: scale(0.97) translateY(6px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
