import { defineStore } from "pinia";

const STORAGE_KEY = "cybertwin-theme";

/**
 * Store du thème (sombre / clair).
 * - Mémorise le choix de l'utilisateur dans localStorage.
 * - Par défaut, suit la préférence du système d'exploitation.
 * - Applique le thème via l'attribut data-theme sur <html>.
 */
export const useThemeStore = defineStore("theme", {
  state: () => ({ mode: "dark" }),
  getters: {
    isDark: (s) => s.mode === "dark",
  },
  actions: {
    init() {
      let mode;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") {
          mode = saved;
        } else {
          mode = window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
        }
      } catch {
        mode = "dark";
      }
      this.apply(mode, false);
    },
    apply(mode, persist = true) {
      this.mode = mode;
      document.documentElement.setAttribute("data-theme", mode);
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, mode);
        } catch {
          /* stockage indisponible : on ignore silencieusement */
        }
      }
    },
    toggle() {
      this.apply(this.mode === "dark" ? "light" : "dark");
    },
  },
});
