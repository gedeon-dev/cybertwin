import { defineStore } from "pinia";
import { api } from "../api/client";
import { useUiStore } from "./ui";

/** Store de l'entreprise fictive (fiche descriptive). */
export const useCompanyStore = defineStore("company", {
  state: () => ({
    company: null,
    loading: false,
  }),
  actions: {
    async fetch() {
      this.loading = true;
      try {
        this.company = await api.getCompany();
      } catch (e) {
        useUiStore().error(e.message);
      } finally {
        this.loading = false;
      }
    },
    async save(payload) {
      try {
        this.company = await api.updateCompany(payload);
        useUiStore().success("Fiche entreprise mise à jour.");
      } catch (e) {
        useUiStore().error(e.message);
        throw e;
      }
    },
  },
});
