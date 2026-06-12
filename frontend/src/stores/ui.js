import { defineStore } from "pinia";

/** Store d'interface : gère les notifications (toasts). */
export const useUiStore = defineStore("ui", {
  state: () => ({
    toasts: [],
    seq: 0,
  }),
  actions: {
    notify(message, type = "info") {
      const id = ++this.seq;
      this.toasts.push({ id, message, type });
      setTimeout(() => this.dismiss(id), 3200);
    },
    success(message) {
      this.notify(message, "success");
    },
    error(message) {
      this.notify(message, "error");
    },
    dismiss(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
