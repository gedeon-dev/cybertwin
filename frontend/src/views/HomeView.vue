<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanyStore } from "../stores/company";
import { useAssetsStore } from "../stores/assets";
import { useVulnerabilitiesStore } from "../stores/vulnerabilities";
import { useRiskStore } from "../stores/risk";
import RiskGauge from "../components/RiskGauge.vue";

const router = useRouter();
const company = useCompanyStore();
const assets = useAssetsStore();
const vulns = useVulnerabilitiesStore();
const risk = useRiskStore();

onMounted(() => {
  if (!risk.result) risk.calculate();
});

const steps = [
  { n: "01", t: "Décrire l'entreprise", d: "Renseigner le secteur, la taille et les services exposés sur Internet.", to: "/entreprise" },
  { n: "02", t: "Inventorier les actifs", d: "Lister serveurs, bases, postes et équipements réseau.", to: "/actifs" },
  { n: "03", t: "Associer les vulnérabilités", d: "Rattacher des faiblesses à chaque actif avec un niveau de criticité.", to: "/vulnerabilites" },
  { n: "04", t: "Analyser le risque", d: "Calculer le score global et lire les recommandations.", to: "/tableau-de-bord" },
];

const companyName = computed(() => company.company?.nom ?? "votre PME");
</script>

<template>
  <div class="page">
    <section class="hero panel">
      <div class="hero-text">
        <div class="eyebrow">Simulateur de risque cyber · PME</div>
        <h1>Modélisez le risque cyber de {{ companyName }}, en clair.</h1>
        <p>
          CyberTwin construit le jumeau numérique d'une entreprise : ses actifs,
          ses vulnérabilités et son exposition. Le moteur d'analyse en déduit un
          score de risque et des recommandations de sécurité concrètes.
        </p>
        <div class="row wrap mt">
          <button class="btn btn-primary" @click="router.push('/tableau-de-bord')">
            Voir le tableau de bord
          </button>
          <button class="btn" @click="router.push('/entreprise')">
            Configurer l'entreprise
          </button>
        </div>
      </div>

      <div class="hero-gauge">
        <RiskGauge
          :score="risk.score ?? 0"
          :level="risk.level ?? 'faible'"
          :size="200"
        />
        <div class="hero-stats mono">
          <span>{{ assets.total }} actifs</span>
          <span class="sep">·</span>
          <span>{{ vulns.total }} vulnérabilités</span>
        </div>
      </div>
    </section>

    <section class="mt-2">
      <div class="eyebrow">Déroulé de l'analyse</div>
      <div class="grid grid-4 mt">
        <button
          v-for="s in steps"
          :key="s.n"
          class="step"
          @click="router.push(s.to)"
        >
          <div class="step-n mono">{{ s.n }}</div>
          <div class="step-t">{{ s.t }}</div>
          <div class="step-d">{{ s.d }}</div>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  align-items: center;
  padding: 2.4rem;
  overflow: hidden;
  position: relative;
}

.hero h1 {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  line-height: 1.1;
  margin: 0.4rem 0 0.8rem;
}

.hero-text p {
  color: var(--text-muted);
  max-width: 52ch;
}

.hero-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.hero-stats {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.sep { margin: 0 0.5rem; color: var(--text-faint); }

.step {
  text-align: left;
  background: linear-gradient(180deg, var(--panel), var(--bg-2));
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 1.2rem;
  cursor: pointer;
  transition: transform 0.14s ease, border-color 0.14s ease;
  color: inherit;
  font: inherit;
}
.step:hover { transform: translateY(-3px); border-color: var(--accent-dim); }

.step-n {
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 700;
}
.step-t {
  font-family: var(--font-display);
  font-weight: 600;
  margin: 0.5rem 0 0.3rem;
}
.step-d {
  font-size: 0.84rem;
  color: var(--text-muted);
}

@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; }
}
</style>
