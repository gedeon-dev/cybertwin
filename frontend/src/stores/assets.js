import { defineStore } from "pinia";
import { api } from "../api/client";
import { useUiStore } from "./ui";

/** Store des actifs informatiques. */
export const useAssetsStore = defineStore("assets", {
  state: () => ({
    items: [],
    loading: false,
  }),
  getters: {
    total: (s) => s.items.length,
    exposedCount: (s) => s.items.filter((a) => a.exposed).length,
    /** Répartition des actifs par type : { "Serveur Web": 2, ... } */
    byType: (s) =>
      s.items.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {}),
    nameById: (s) => (id) => s.items.find((a) => a.id === id)?.nom ?? "—",
  },
  actions: {
    async fetch() {
      this.loading = true;
      try {
        this.items = await api.getAssets();
      } catch (e) {
        useUiStore().error(e.message);
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const asset = await api.createAsset(payload);
      this.items.push(asset);
      useUiStore().success("Actif ajouté.");
      return asset;
    },
    async update(id, payload) {
      const updated = await api.updateAsset(id, payload);
      const idx = this.items.findIndex((a) => a.id === id);
      if (idx !== -1) this.items[idx] = updated;
      useUiStore().success("Actif modifié.");
      return updated;
    },
    async remove(id) {
      await api.deleteAsset(id);
      this.items = this.items.filter((a) => a.id !== id);
      useUiStore().success("Actif supprimé.");
    },
  },
});
