import { defineStore } from "pinia";
import { api } from "../api/client";
import { useUiStore } from "./ui";

/** Store des vulnérabilités associées aux actifs. */
export const useVulnerabilitiesStore = defineStore("vulnerabilities", {
  state: () => ({
    items: [],
    loading: false,
  }),
  getters: {
    total: (s) => s.items.length,
    forAsset: (s) => (assetId) => s.items.filter((v) => v.assetId === assetId),
    /** Comptage par niveau de criticité (pour les graphiques). */
    byCriticity: (s) => {
      const base = { faible: 0, moyenne: 0, élevée: 0 };
      for (const v of s.items) base[v.criticite] = (base[v.criticite] || 0) + 1;
      return base;
    },
  },
  actions: {
    async fetch() {
      this.loading = true;
      try {
        this.items = await api.getVulnerabilities();
      } catch (e) {
        useUiStore().error(e.message);
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const vuln = await api.createVulnerability(payload);
      this.items.push(vuln);
      useUiStore().success("Vulnérabilité associée.");
      return vuln;
    },
    async remove(id) {
      await api.deleteVulnerability(id);
      this.items = this.items.filter((v) => v.id !== id);
      useUiStore().success("Vulnérabilité supprimée.");
    },
  },
});
