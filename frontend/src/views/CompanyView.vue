<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useCompanyStore } from "../stores/company";

const store = useCompanyStore();
const editing = ref(false);

const form = reactive({
  nom: "",
  secteur: "",
  nbEmployes: 0,
  nbServeurs: 0,
  nbPostesClients: 0,
  description: "",
  servicesExposes: [],
});

const servicesText = ref("");

// Synchronise le formulaire dès que la fiche est chargée / modifiée.
watch(
  () => store.company,
  (c) => {
    if (!c) return;
    Object.assign(form, c);
    servicesText.value = (c.servicesExposes || []).join(", ");
  },
  { immediate: true }
);

const company = computed(() => store.company);

function startEdit() {
  editing.value = true;
}

async function save() {
  const payload = {
    ...form,
    nbEmployes: Number(form.nbEmployes),
    nbServeurs: Number(form.nbServeurs),
    nbPostesClients: Number(form.nbPostesClients),
    servicesExposes: servicesText.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
  await store.save(payload);
  editing.value = false;
}

function cancel() {
  Object.assign(form, store.company);
  servicesText.value = (store.company.servicesExposes || []).join(", ");
  editing.value = false;
}
</script>

<template>
  <div class="page">
    <div class="page-head row-between wrap">
      <div>
        <div class="eyebrow">Fiche entreprise</div>
        <h1>Entreprise</h1>
        <p>Consultez et modifiez les caractéristiques de l'entreprise fictive analysée.</p>
      </div>
      <button v-if="!editing" class="btn btn-primary" @click="startEdit">Modifier la fiche</button>
    </div>

    <!-- Consultation -->
    <div v-if="!editing && company" class="grid grid-2" v-reveal>
      <div class="panel">
        <div class="panel-title">Identité</div>
        <dl class="defs">
          <div><dt>Nom</dt><dd>{{ company.nom }}</dd></div>
          <div><dt>Secteur d'activité</dt><dd>{{ company.secteur }}</dd></div>
          <div><dt>Employés</dt><dd class="mono">{{ company.nbEmployes }}</dd></div>
          <div><dt>Serveurs</dt><dd class="mono">{{ company.nbServeurs }}</dd></div>
          <div><dt>Postes clients</dt><dd class="mono">{{ company.nbPostesClients }}</dd></div>
        </dl>
      </div>

      <div class="panel">
        <div class="panel-title">Exposition Internet</div>
        <div class="chips">
          <span v-for="s in company.servicesExposes" :key="s" class="chip">{{ s }}</span>
          <span v-if="!company.servicesExposes?.length" class="muted">Aucun service exposé.</span>
        </div>
        <div class="panel-title mt-2">Description</div>
        <p class="muted">{{ company.description }}</p>
      </div>
    </div>

    <!-- Édition -->
    <div v-else-if="editing" class="panel">
      <div class="panel-title">Modifier la fiche entreprise</div>
      <div class="grid grid-2">
        <div class="field">
          <label>Nom de l'entreprise</label>
          <input v-model="form.nom" type="text" />
        </div>
        <div class="field">
          <label>Secteur d'activité</label>
          <input v-model="form.secteur" type="text" />
        </div>
        <div class="field">
          <label>Nombre d'employés</label>
          <input v-model.number="form.nbEmployes" type="number" min="0" />
        </div>
        <div class="field">
          <label>Nombre de serveurs</label>
          <input v-model.number="form.nbServeurs" type="number" min="0" />
        </div>
        <div class="field">
          <label>Nombre de postes clients</label>
          <input v-model.number="form.nbPostesClients" type="number" min="0" />
        </div>
        <div class="field">
          <label>Services exposés (séparés par des virgules)</label>
          <input v-model="servicesText" type="text" placeholder="Site web, API, Webmail…" />
        </div>
      </div>
      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" rows="3" />
      </div>
      <div class="row">
        <button class="btn btn-primary" @click="save">Enregistrer</button>
        <button class="btn btn-ghost" @click="cancel">Annuler</button>
      </div>
    </div>

    <div v-else class="empty">Chargement de la fiche…</div>
  </div>
</template>

<style scoped>
.defs { margin: 0; display: flex; flex-direction: column; gap: 0.8rem; }
.defs > div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--border-soft); padding-bottom: 0.6rem; }
.defs > div:last-child { border-bottom: none; }
dt { color: var(--text-muted); font-size: 0.86rem; }
dd { margin: 0; font-weight: 500; text-align: right; }

.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chip {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.22);
  color: var(--accent);
}
</style>
