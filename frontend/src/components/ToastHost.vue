<script setup>
import { useUiStore } from "../stores/ui";
const ui = useUiStore();
</script>

<template>
  <div class="toast-wrap">
    <TransitionGroup name="toast-anim">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
        @click="ui.dismiss(t.id)"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.2s ease;
}
.toast-anim-enter-from,
.toast-anim-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
