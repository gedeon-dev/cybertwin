<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanyStore } from "../stores/company";
import { useAssetsStore } from "../stores/assets";
import { useVulnerabilitiesStore } from "../stores/vulnerabilities";
import { useRiskStore } from "../stores/risk";
import RiskGauge from "../components/RiskGauge.vue";
import AnimatedNumber from "../components/AnimatedNumber.vue";

const router = useRouter();
const company = useCompanyStore();
const assets = useAssetsStore();
const vulns = useVulnerabilitiesStore();
const risk = useRiskStore();

onMounted(() => {
  if (!risk.result) risk.calculate();
});

const companyName = computed(() => company.company?.nom ?? "votre PME");

const steps = [
  { n: "01", t: "Décrire l'entreprise", d: "Secteur, taille, infrastructure et services exposés sur Internet. Le profil de l'organisation pose les bases de l'analyse.", to: "/entreprise", cta: "Configurer l'entreprise" },
  { n: "02", t: "Cartographier les actifs", d: "Serveurs, bases de données, postes, routeurs, pare-feux. Chaque actif est un nœud du jumeau numérique.", to: "/actifs", cta: "Gérer les actifs" },
  { n: "03", t: "Révéler les vulnérabilités", d: "Rattachez les faiblesses à leurs actifs et qualifiez leur criticité. La surface de risque devient visible.", to: "/vulnerabilites", cta: "Voir les vulnérabilités" },
  { n: "04", t: "Mesurer le risque", d: "Le moteur calcule un score global et propose des recommandations concrètes, prêtes à l'action.", to: "/tableau-de-bord", cta: "Ouvrir le tableau de bord" },
];
</script>

<template>
  <div class="home">
    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <div class="eyebrow reveal-instant">Simulateur de risque cyber · PME</div>
          <h1 class="hero-title">
            Le <span class="gradient-text">jumeau numérique</span><br />
            de votre sécurité.
          </h1>
          <p class="hero-sub">
            CyberTwin modélise {{ companyName }} — ses actifs, ses vulnérabilités,
            son exposition — et transforme la complexité du risque cyber en un
            score clair et des décisions évidentes.
          </p>
          <div class="hero-cta">
            <button class="btn btn-primary" @click="router.push('/tableau-de-bord')">
              Lancer l'analyse
            </button>
            <button class="btn" @click="router.push('/entreprise')">
              Explorer l'entreprise
            </button>
          </div>
        </div>

        <div class="hero-visual">
          <div class="gauge-frame">
            <RiskGauge :score="risk.score ?? 0" :level="risk.level ?? 'faible'" :size="280" />
          </div>
          <div class="hero-pills mono">
            <span class="pill">{{ assets.total }} actifs</span>
            <span class="pill">{{ vulns.total }} vulnérabilités</span>
          </div>
        </div>
      </div>

      <div class="scroll-cue">
        <span>Défiler</span>
        <div class="cue-line"><i /></div>
      </div>
    </section>

    <!-- ===================== BANDE STATS ===================== -->
    <section class="band">
      <div class="band-inner">
        <div class="band-item" v-reveal>
          <div class="band-num"><AnimatedNumber :value="assets.total" /></div>
          <div class="band-label">Actifs cartographiés</div>
        </div>
        <div class="band-item" v-reveal="{ delay: 90 }">
          <div class="band-num"><AnimatedNumber :value="vulns.total" /></div>
          <div class="band-label">Vulnérabilités suivies</div>
        </div>
        <div class="band-item" v-reveal="{ delay: 180 }">
          <div class="band-num"><AnimatedNumber :value="assets.exposedCount" /></div>
          <div class="band-label">Actifs exposés</div>
        </div>
        <div class="band-item" v-reveal="{ delay: 270 }">
          <div class="band-num" :class="'lvl-' + (risk.level || 'faible')">
            <AnimatedNumber :value="risk.score ?? 0" />
          </div>
          <div class="band-label">Score de risque</div>
        </div>
      </div>
    </section>

    <!-- ===================== ÉTAPES ===================== -->
    <section class="steps">
      <div class="section-head" v-reveal>
        <div class="eyebrow">Le déroulé</div>
        <h2>Quatre étapes, une vision complète du risque.</h2>
      </div>

      <div class="step-list">
        <article
          v-for="(s, i) in steps"
          :key="s.n"
          class="step-card"
          :class="{ alt: i % 2 === 1 }"
          v-reveal
        >
          <div class="step-num mono">{{ s.n }}</div>
          <div class="step-body">
            <h3>{{ s.t }}</h3>
            <p>{{ s.d }}</p>
            <button class="btn btn-sm btn-ghost step-link" @click="router.push(s.to)">
              {{ s.cta }} →
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- ===================== CTA FINALE ===================== -->
    <section class="final" v-reveal>
      <div class="final-card panel">
        <h2>Prêt à voir où se cache le risque ?</h2>
        <p class="muted">
          Le rapport complet attend : inventaire, vulnérabilités, score et
          recommandations de sécurité — exportable en un clic.
        </p>
        <div class="row wrap final-cta">
          <button class="btn btn-primary" @click="router.push('/tableau-de-bord')">Tableau de bord</button>
          <button class="btn" @click="router.push('/rapport')">Générer le rapport</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { width: 100%; }

/* --- HERO --- */
.hero {
  position: relative;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.6rem;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 2.5rem;
  width: 100%;
}

.hero-title {
  font-size: clamp(2.5rem, 6.5vw, 4.8rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  margin: 0.6rem 0 1.2rem;
  animation: rise 1s var(--ease) both;
}
.hero-sub {
  color: var(--text-muted);
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  max-width: 46ch;
  animation: rise 1s var(--ease) 0.12s both;
}
.hero-cta { display: flex; gap: 0.8rem; margin-top: 2rem; flex-wrap: wrap; animation: rise 1s var(--ease) 0.24s both; }
.reveal-instant { animation: rise 0.9s var(--ease) both; }

.hero-visual {
  display: flex; flex-direction: column; align-items: center; gap: 1.4rem;
  animation: fadein 1.2s var(--ease) 0.3s both;
}
.gauge-frame {
  padding: 1.5rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.03), transparent 65%);
}
.hero-pills { display: flex; gap: 0.6rem; }
.pill {
  font-size: 0.78rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: var(--glass-strong);
  border: 1px solid var(--border);
  color: var(--text-muted);
  backdrop-filter: blur(10px);
}

.scroll-cue {
  position: absolute; bottom: 1.6rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--text-faint);
  animation: fadein 1s ease 1s both;
}
.cue-line { width: 1px; height: 38px; background: var(--border); position: relative; overflow: hidden; }
.cue-line i {
  position: absolute; top: -50%; left: 0; width: 1px; height: 50%;
  background: var(--accent-2);
  animation: cue 1.8s var(--ease) infinite;
}

/* --- BANDE STATS --- */
.band { padding: 4rem 1.6rem; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); }
.band-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center;
}
.band-num { font-family: var(--font-mono); font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 700; line-height: 1; }
.band-num.lvl-élevé { color: var(--risk-high); }
.band-num.lvl-moyen { color: var(--risk-mid); }
.band-num.lvl-faible { color: var(--risk-low); }
.band-label { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem; }

/* --- ÉTAPES --- */
.steps { max-width: 1000px; margin: 0 auto; padding: 6rem 1.6rem 2rem; }
.section-head { text-align: center; margin-bottom: 3rem; }
.section-head h2 { font-size: clamp(1.8rem, 3.5vw, 2.6rem); margin-top: 0.6rem; }

.step-list { display: flex; flex-direction: column; gap: 1.3rem; }
.step-card {
  display: flex; align-items: center; gap: 2rem;
  background: var(--glass);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 2.2rem;
  backdrop-filter: blur(18px);
  transition: transform 0.5s var(--ease), border-color 0.4s, box-shadow 0.5s var(--ease);
}
.step-card:hover { transform: translateY(-4px); border-color: var(--border); box-shadow: var(--shadow-glow); }
.step-card.alt { flex-direction: row-reverse; text-align: right; }
.step-card.alt .step-link { margin-left: auto; }

.step-num {
  font-size: 3.2rem; font-weight: 700;
  background: var(--accent-grad);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  flex-shrink: 0; line-height: 1; opacity: 0.9;
}
.step-body h3 { font-size: 1.4rem; margin-bottom: 0.5rem; }
.step-body p { color: var(--text-muted); margin: 0 0 1rem; max-width: 52ch; }
.step-link { padding-left: 0; }

/* --- CTA FINALE --- */
.final { max-width: 1000px; margin: 0 auto; padding: 4rem 1.6rem 6rem; }
.final-card { text-align: center; padding: 3.5rem 2rem; }
.final-card h2 { font-size: clamp(1.7rem, 3vw, 2.4rem); }
.final-card p { max-width: 50ch; margin: 1rem auto 0; }
.final-cta { justify-content: center; margin-top: 2rem; }

@keyframes rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
@keyframes cue { 0% { top: -50%; } 100% { top: 100%; } }

@media (max-width: 860px) {
  .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .hero-text { order: 2; }
  .hero-visual { order: 1; }
  .hero-cta { justify-content: center; }
  .hero-sub { margin-left: auto; margin-right: auto; }
  .band-inner { grid-template-columns: repeat(2, 1fr); gap: 2.5rem 1.5rem; }
  .step-card, .step-card.alt { flex-direction: column; text-align: center; gap: 1rem; }
  .step-card.alt .step-link, .step-link { margin: 0 auto; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-title, .hero-sub, .hero-cta, .hero-visual, .reveal-instant, .scroll-cue { animation: none; }
  .cue-line i { animation: none; }
}
</style>
