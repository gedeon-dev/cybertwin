import { defineStore } from "pinia";
import { api } from "../api/client";
import { useUiStore } from "./ui";

/** Store du risque cyber : score courant, rapport, et historique d'analyses. */
export const useRiskStore = defineStore("risk", {
  state: () => ({
    result: null, // dernier calcul
    report: null, // rapport complet
    history: [], // historique des analyses (fonctionnalité bonus)
    loading: false,
  }),
  getters: {
    score: (s) => s.result?.score ?? null,
    level: (s) => s.result?.level ?? null,
  },
  actions: {
    async calculate() {
      this.loading = true;
      try {
        this.result = await api.calculateRisk();
        this.history.push({
          at: this.result.computedAt,
          score: this.result.score,
          level: this.result.level,
        });
        return this.result;
      } catch (e) {
        useUiStore().error(e.message);
      } finally {
        this.loading = false;
      }
    },
    async fetchReport() {
      this.loading = true;
      try {
        this.report = await api.getReport();
        this.result = this.report.risk;
        return this.report;
      } catch (e) {
        useUiStore().error(e.message);
      } finally {
        this.loading = false;
      }
    },
  },
});
