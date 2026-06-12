<script setup>
import { ref, reactive, computed } from "vue";
import { useAssetsStore } from "../stores/assets";
import { useVulnerabilitiesStore } from "../stores/vulnerabilities";
import { useUiStore } from "../stores/ui";
import RiskBadge from "../components/RiskBadge.vue";
import BaseModal from "../components/BaseModal.vue";

const assets = useAssetsStore();
const vulns = useVulnerabilitiesStore();
const ui = useUiStore();

const CRITICITES = ["faible", "moyenne", "élevée"];

// Suggestions courantes (issues du cahier des charges) pour gagner du temps.
const SUGGESTIONS = [
  "Logiciel obsolète",
  "Mot de passe faible",
  "Port exposé",
  "Absence de sauvegarde",
];

const modalOpen = ref(false);
const form = reactive({ assetId: "", nom: "", criticite: "moyenne" });
const errors = ref([]);
const filterAsset = ref("");

function openCreate() {
  if (!assets.total) {
    ui.error("Ajoutez d'abord au moins un actif.");
    return;
  }
  Object.assign(form, {
    assetId: assets.items[0].id,
    nom: "",
    criticite: "moyenne",
  });
  errors.value = [];
  modalOpen.value = true;
}

async function submit() {
  errors.value = [];
  if (!form.nom || form.nom.trim().length < 2) {
    errors.value.push("Le nom de la vulnérabilité est requis.");
    return;
  }
  try {
    await vulns.create({ ...form });
    modalOpen.value = false;
  } catch (e) {
    errors.value.push(e.message);
  }
}

async function remove(v) {
  if (confirm(`Supprimer la vulnérabilité « ${v.nom} » ?`)) {
    await vulns.remove(v.id);
  }
}

// Liste filtrée + enrichie du nom de l'actif.
const rows = computed(() =>
  vulns.items
    .filter((v) => !filterAsset.value || v.assetId === filterAsset.value)
    .map((v) => ({ ...v, assetName: assets.nameById(v.assetId) }))
);
</script>

<template>
  <div class="page">
    <div class="page-head row-between wrap">
      <div>
        <div class="eyebrow">Faiblesses de sécurité</div>
        <h1>Vulnérabilités</h1>
        <p>Associez des vulnérabilités à vos actifs et définissez leur niveau de criticité.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ Associer une vulnérabilité</button>
    </div>

    <div class="row-between wrap mb">
      <div class="row">
        <label class="filter-label">Filtrer par actif</label>
        <select v-model="filterAsset" class="filter-select">
          <option value="">Tous les actifs</option>
          <option v-for="a in assets.items" :key="a.id" :value="a.id">{{ a.nom }}</option>
        </select>
      </div>
      <div class="muted mono">{{ rows.length }} vulnérabilité(s)</div>
    </div>

    <div class="panel" v-if="rows.length">
      <table>
        <thead>
          <tr>
            <th>Vulnérabilité</th>
            <th>Actif concerné</th>
            <th>Criticité</th>
            <th class="right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in rows" :key="v.id">
            <td class="strong">{{ v.nom }}</td>
            <td class="muted">{{ v.assetName }}</td>
            <td><RiskBadge :level="v.criticite" /></td>
            <td class="right">
              <button class="btn btn-sm btn-danger" @click="remove(v)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      Aucune vulnérabilité {{ filterAsset ? "pour cet actif" : "enregistrée" }}.
    </div>

    <!-- Formulaire -->
    <BaseModal v-if="modalOpen" title="Associer une vulnérabilité" @close="modalOpen = false">
      <div class="field">
        <label>Actif concerné</label>
        <select v-model="form.assetId">
          <option v-for="a in assets.items" :key="a.id" :value="a.id">{{ a.nom }} — {{ a.type }}</option>
        </select>
      </div>
      <div class="field">
        <label>Nom de la vulnérabilité</label>
        <input v-model="form.nom" type="text" placeholder="Ex. Logiciel obsolète" />
        <div class="suggest">
          <button
            v-for="s in SUGGESTIONS"
            :key="s"
            class="suggest-chip"
            type="button"
            @click="form.nom = s"
          >{{ s }}</button>
        </div>
      </div>
      <div class="field">
        <label>Niveau de criticité</label>
        <select v-model="form.criticite">
          <option v-for="c in CRITICITES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <ul v-if="errors.length" class="errs">
        <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
      </ul>

      <div class="row mt">
        <button class="btn btn-primary" @click="submit">Associer</button>
        <button class="btn btn-ghost" @click="modalOpen = false">Annuler</button>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.strong { font-weight: 600; }
.right { text-align: right; }
.mb { margin-bottom: 1rem; }

.filter-label { font-size: 0.82rem; color: var(--text-muted); }
.filter-select { width: auto; min-width: 200px; }

.suggest { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
.suggest-chip {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-muted);
  background: var(--bg-2);
  border: 1px solid var(--border-soft);
  padding: 0.25rem 0.55rem;
  border-radius: 7px;
  cursor: pointer;
}
.suggest-chip:hover { border-color: var(--accent-dim); color: var(--accent); }

.errs {
  margin: 0.8rem 0 0;
  padding: 0.7rem 0.9rem 0.7rem 1.6rem;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 9px;
  color: var(--risk-high);
  font-size: 0.84rem;
}
</style>
