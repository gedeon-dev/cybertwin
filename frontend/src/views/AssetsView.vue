<script setup>
import { ref, reactive, computed } from "vue";
import { useAssetsStore } from "../stores/assets";
import { useVulnerabilitiesStore } from "../stores/vulnerabilities";
import BaseModal from "../components/BaseModal.vue";

const assets = useAssetsStore();
const vulns = useVulnerabilitiesStore();

const ASSET_TYPES = [
  "Serveur Web",
  "Base de données",
  "Poste utilisateur",
  "Routeur",
  "Pare-feu",
  "Application métier",
];

const modalOpen = ref(false);
const editingId = ref(null);
const form = reactive({ nom: "", type: ASSET_TYPES[0], exposed: false });
const errors = ref([]);

const isEdit = computed(() => editingId.value !== null);

function openCreate() {
  editingId.value = null;
  Object.assign(form, { nom: "", type: ASSET_TYPES[0], exposed: false });
  errors.value = [];
  modalOpen.value = true;
}

function openEdit(asset) {
  editingId.value = asset.id;
  Object.assign(form, { nom: asset.nom, type: asset.type, exposed: asset.exposed });
  errors.value = [];
  modalOpen.value = true;
}

async function submit() {
  errors.value = [];
  if (!form.nom || form.nom.trim().length < 2) {
    errors.value.push("Le nom de l'actif est requis (2 caractères minimum).");
    return;
  }
  try {
    if (isEdit.value) {
      await assets.update(editingId.value, { ...form });
    } else {
      await assets.create({ ...form });
    }
    modalOpen.value = false;
  } catch (e) {
    errors.value.push(e.message);
  }
}

async function remove(asset) {
  const count = vulns.forAsset(asset.id).length;
  const msg =
    count > 0
      ? `Supprimer « ${asset.nom} » et ses ${count} vulnérabilité(s) ?`
      : `Supprimer « ${asset.nom} » ?`;
  if (confirm(msg)) await assets.remove(asset.id);
}

const vulnCount = (id) => vulns.forAsset(id).length;
</script>

<template>
  <div class="page">
    <div class="page-head row-between wrap">
      <div>
        <div class="eyebrow">Inventaire</div>
        <h1>Actifs</h1>
        <p>Gérez les actifs informatiques de l'entreprise : serveurs, bases, postes et équipements réseau.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ Ajouter un actif</button>
    </div>

    <div class="panel" v-if="assets.total" v-reveal>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Exposition</th>
            <th>Vulnérabilités</th>
            <th class="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in assets.items" :key="a.id">
            <td class="strong">{{ a.nom }}</td>
            <td><span class="type-tag">{{ a.type }}</span></td>
            <td>
              <span v-if="a.exposed" class="badge badge-high"><span class="dot" />Exposé</span>
              <span v-else class="badge"><span class="dot" />Interne</span>
            </td>
            <td class="mono">{{ vulnCount(a.id) }}</td>
            <td class="right">
              <button class="btn btn-sm btn-ghost" @click="openEdit(a)">Modifier</button>
              <button class="btn btn-sm btn-danger" @click="remove(a)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      Aucun actif pour l'instant. Cliquez sur « Ajouter un actif » pour commencer.
    </div>

    <!-- Formulaire -->
    <BaseModal
      v-if="modalOpen"
      :title="isEdit ? 'Modifier l\'actif' : 'Ajouter un actif'"
      @close="modalOpen = false"
    >
      <div class="field">
        <label>Nom de l'actif</label>
        <input v-model="form.nom" type="text" placeholder="Ex. Serveur Web Nginx" />
      </div>
      <div class="field">
        <label>Type d'actif</label>
        <select v-model="form.type">
          <option v-for="t in ASSET_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <label class="check">
        <input v-model="form.exposed" type="checkbox" />
        <span>Exposé sur Internet</span>
      </label>

      <ul v-if="errors.length" class="errs">
        <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
      </ul>

      <div class="row mt">
        <button class="btn btn-primary" @click="submit">{{ isEdit ? "Enregistrer" : "Ajouter" }}</button>
        <button class="btn btn-ghost" @click="modalOpen = false">Annuler</button>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.strong { font-weight: 600; }
.right { text-align: right; }
.right .btn { margin-left: 0.4rem; }

.type-tag {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--text-muted);
  background: var(--bg-2);
  border: 1px solid var(--border-soft);
  padding: 0.2rem 0.5rem;
  border-radius: 7px;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0.4rem 0;
}
.check input { width: auto; }

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
