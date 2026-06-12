<script setup>
import { computed, onMounted } from "vue";
import { useRiskStore } from "../stores/risk";
import RiskBadge from "../components/RiskBadge.vue";
import RiskGauge from "../components/RiskGauge.vue";

const risk = useRiskStore();

onMounted(() => risk.fetchReport());

const report = computed(() => risk.report);

const dateStr = computed(() => {
  if (!report.value) return "";
  return new Date(report.value.generatedAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

// Export PDF via la boîte d'impression du navigateur (fonctionnalité bonus).
function exportPdf() {
  window.print();
}
</script>

<template>
  <div class="page">
    <div class="page-head row-between wrap no-print">
      <div>
        <div class="eyebrow">Document de synthèse</div>
        <h1>Rapport final</h1>
        <p>Rapport d'analyse de risque cyber, prêt à présenter ou à exporter en PDF.</p>
      </div>
      <div class="row">
        <button class="btn" @click="risk.fetchReport()">Régénérer</button>
        <button class="btn btn-primary" @click="exportPdf">Exporter en PDF</button>
      </div>
    </div>

    <div v-if="report" class="report panel" v-reveal>
      <!-- En-tête -->
      <header class="rep-head">
        <div>
          <div class="rep-kicker mono">RAPPORT D'ANALYSE · CYBERTWIN</div>
          <h2 class="rep-title">{{ report.company.nom }}</h2>
          <div class="muted">{{ report.company.secteur }} · généré le {{ dateStr }}</div>
        </div>
        <RiskGauge
          :score="report.risk.score"
          :level="report.risk.level"
          :size="150"
        />
      </header>

      <!-- 1. Présentation -->
      <section class="rep-section">
        <h3 class="rep-h">1 · Présentation de l'entreprise</h3>
        <p class="muted">{{ report.company.description }}</p>
        <div class="facts">
          <div><span class="mono">{{ report.company.nbEmployes }}</span><label>Employés</label></div>
          <div><span class="mono">{{ report.company.nbServeurs }}</span><label>Serveurs</label></div>
          <div><span class="mono">{{ report.company.nbPostesClients }}</span><label>Postes clients</label></div>
          <div><span class="mono">{{ report.company.servicesExposes.length }}</span><label>Services exposés</label></div>
        </div>
      </section>

      <!-- 2. Inventaire -->
      <section class="rep-section">
        <h3 class="rep-h">2 · Inventaire des actifs ({{ report.assets.length }})</h3>
        <table>
          <thead>
            <tr><th>Actif</th><th>Type</th><th>Exposition</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in report.assets" :key="a.id">
              <td class="strong">{{ a.nom }}</td>
              <td class="muted">{{ a.type }}</td>
              <td>{{ a.exposed ? "Exposé sur Internet" : "Interne" }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 3. Vulnérabilités -->
      <section class="rep-section">
        <h3 class="rep-h">3 · Vulnérabilités détectées ({{ report.vulnerabilities.length }})</h3>
        <table>
          <thead>
            <tr><th>Vulnérabilité</th><th>Actif</th><th>Criticité</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in report.vulnerabilities" :key="v.id">
              <td class="strong">{{ v.nom }}</td>
              <td class="muted">{{ v.assetName }}</td>
              <td><RiskBadge :level="v.criticite" /></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 4. Niveau de risque -->
      <section class="rep-section">
        <h3 class="rep-h">4 · Niveau de risque</h3>
        <div class="risk-line">
          <RiskBadge :level="report.risk.level" />
          <span class="mono big">{{ report.risk.score }}/100</span>
          <span class="muted">
            {{ report.risk.stats.totalVulnerabilities }} vulnérabilités sur
            {{ report.risk.stats.totalAssets }} actifs ·
            {{ report.risk.stats.exposedServices }} services exposés
          </span>
        </div>
      </section>

      <!-- 5. Recommandations -->
      <section class="rep-section">
        <h3 class="rep-h">5 · Recommandations de sécurité</h3>
        <ol class="rep-recos">
          <li v-for="(r, i) in report.risk.recommendations" :key="i">{{ r }}</li>
        </ol>
      </section>

      <footer class="rep-foot muted mono">
        CyberTwin · Simulateur de risque cyber pour PME · {{ report.company.nom }}
      </footer>
    </div>

    <div v-else class="empty">Génération du rapport…</div>
  </div>
</template>

<style scoped>
.report { padding: 2rem; }
.rep-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.rep-kicker { font-size: 0.72rem; letter-spacing: 0.16em; color: var(--accent); }
.rep-title { font-size: 1.8rem; margin: 0.3rem 0 0.2rem; }

.rep-section { padding: 1.4rem 0; border-bottom: 1px solid var(--border-soft); }
.rep-section:last-of-type { border-bottom: none; }
.rep-h {
  font-size: 1.05rem;
  color: var(--text);
  margin-bottom: 0.9rem;
  font-family: var(--font-display);
}

.facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem; }
.facts > div {
  background: var(--bg-2);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 0.9rem;
  text-align: center;
}
.facts span { font-size: 1.5rem; font-weight: 700; display: block; }
.facts label { font-size: 0.76rem; color: var(--text-muted); }

.strong { font-weight: 600; }

.risk-line { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.big { font-size: 1.4rem; font-weight: 700; }

.rep-recos { margin: 0; padding-left: 1.2rem; display: grid; gap: 0.5rem; }
.rep-recos li { padding-left: 0.3rem; }

.rep-foot { margin-top: 1.4rem; font-size: 0.74rem; text-align: center; }

/* --- Impression / export PDF -------------------------------------------- */
@media print {
  .no-print { display: none !important; }
  .report { border: none; box-shadow: none; background: #fff; color: #111; }
}
</style>
