<script setup>
import { computed, onMounted } from "vue";
import { useAssetsStore } from "../stores/assets";
import { useVulnerabilitiesStore } from "../stores/vulnerabilities";
import { useRiskStore } from "../stores/risk";
import StatCard from "../components/StatCard.vue";
import RiskGauge from "../components/RiskGauge.vue";
import DonutChart from "../components/DonutChart.vue";
import BarChart from "../components/BarChart.vue";

const assets = useAssetsStore();
const vulns = useVulnerabilitiesStore();
const risk = useRiskStore();

onMounted(() => risk.calculate());

// Données graphiques.
const donutLabels = computed(() => Object.keys(assets.byType));
const donutData = computed(() => Object.values(assets.byType));

const critOrder = ["faible", "moyenne", "élevée"];
const barLabels = ["Faible", "Moyenne", "Élevée"];
const barData = computed(() => critOrder.map((c) => vulns.byCriticity[c] || 0));

const components = computed(() => risk.result?.components ?? null);
const recommendations = computed(() => risk.result?.recommendations ?? []);
</script>

<template>
  <div class="page">
    <div class="page-head row-between wrap">
      <div>
        <div class="eyebrow">Synthèse</div>
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de la posture de sécurité et du score de risque cyber global.</p>
      </div>
      <button class="btn btn-primary" @click="risk.calculate()" :disabled="risk.loading">
        {{ risk.loading ? "Calcul…" : "Recalculer le risque" }}
      </button>
    </div>

    <!-- Statistiques clés -->
    <div class="grid grid-4">
      <StatCard label="Actifs" :value="assets.total" hint="dont exposés" :accent="'var(--accent)'" />
      <StatCard label="Actifs exposés" :value="assets.exposedCount" hint="sur Internet" :accent="'var(--risk-mid)'" />
      <StatCard label="Vulnérabilités" :value="vulns.total" hint="toutes criticités" :accent="'var(--risk-high)'" />
      <StatCard
        label="Score de risque"
        :value="risk.score ?? '—'"
        :hint="risk.level ? 'niveau ' + risk.level : ''"
        :accent="'var(--accent)'"
      />
    </div>

    <!-- Jauge + composantes -->
    <div class="grid grid-2 mt-2">
      <div class="panel gauge-panel">
        <div class="panel-title">Score de risque global</div>
        <RiskGauge :score="risk.score ?? 0" :level="risk.level ?? 'faible'" :size="240" />
      </div>

      <div class="panel">
        <div class="panel-title">Composantes du score</div>
        <div v-if="components" class="stack components">
          <div class="comp">
            <div class="row-between">
              <span>Vulnérabilités &amp; criticité</span>
              <span class="mono">{{ components.vulnerabilities }}</span>
            </div>
            <div class="bar"><i :style="{ width: Math.min(100, components.vulnerabilities) + '%', background: 'var(--risk-high)' }" /></div>
          </div>
          <div class="comp">
            <div class="row-between">
              <span>Surface d'attaque (actifs)</span>
              <span class="mono">{{ components.surface }}</span>
            </div>
            <div class="bar"><i :style="{ width: Math.min(100, components.surface) + '%', background: 'var(--risk-mid)' }" /></div>
          </div>
          <div class="comp">
            <div class="row-between">
              <span>Exposition Internet</span>
              <span class="mono">{{ components.exposure }}</span>
            </div>
            <div class="bar"><i :style="{ width: Math.min(100, components.exposure) + '%', background: 'var(--accent)' }" /></div>
          </div>
          <p class="muted small mt">
            Le score combine la criticité des vulnérabilités (facteur dominant),
            la surface d'attaque et l'exposition publique, plafonné à 100.
          </p>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-2 mt-2">
      <div class="panel">
        <div class="panel-title">Répartition des actifs par type</div>
        <DonutChart v-if="donutData.length" :labels="donutLabels" :data="donutData" />
        <div v-else class="empty">Aucun actif à représenter.</div>
      </div>
      <div class="panel">
        <div class="panel-title">Vulnérabilités par criticité</div>
        <BarChart :labels="barLabels" :data="barData" />
      </div>
    </div>

    <!-- Recommandations -->
    <div class="panel mt-2" v-if="recommendations.length">
      <div class="panel-title">Recommandations de sécurité</div>
      <ul class="recos">
        <li v-for="(r, i) in recommendations" :key="i">
          <span class="reco-mark mono">{{ String(i + 1).padStart(2, "0") }}</span>
          <span>{{ r }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.gauge-panel { display: flex; flex-direction: column; align-items: center; }

.components { margin-top: 0.4rem; }
.comp { font-size: 0.88rem; }
.bar {
  margin-top: 0.4rem;
  height: 8px;
  background: var(--bg-2);
  border-radius: 6px;
  overflow: hidden;
}
.bar i { display: block; height: 100%; border-radius: 6px; transition: width 0.6s ease; }
.small { font-size: 0.8rem; }

.recos { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.7rem; }
.recos li {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  padding: 0.7rem 0.9rem;
  background: var(--bg-2);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 0.9rem;
}
.reco-mark { color: var(--accent); font-weight: 700; font-size: 0.82rem; flex-shrink: 0; }

@media (min-width: 720px) {
  .recos { grid-template-columns: 1fr 1fr; }
}
</style>
