<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useCompanyStore } from "../stores/company";

const company = useCompanyStore();
const companyName = computed(() => company.company?.nom ?? "—");

const scrolled = ref(false);
const mobileOpen = ref(false);

const links = [
  { to: "/", label: "Accueil" },
  { to: "/entreprise", label: "Entreprise" },
  { to: "/actifs", label: "Actifs" },
  { to: "/vulnerabilites", label: "Vulnérabilités" },
  { to: "/tableau-de-bord", label: "Tableau de bord" },
  { to: "/rapport", label: "Rapport" },
];

function onScroll() {
  scrolled.value = window.scrollY > 12;
}
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="topbar" :class="{ scrolled }">
    <div class="bar">
      <RouterLink to="/" class="brand" @click="mobileOpen = false">
        <span class="logo">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" fill="none"
              stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor"
              stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">CyberTwin</span>
          <span class="brand-sub mono">{{ companyName }}</span>
        </span>
      </RouterLink>

      <nav class="links" :class="{ open: mobileOpen }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="link"
          :class="{ active: $route.path === link.to }"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button class="burger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <span :class="{ x: mobileOpen }" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.4s var(--ease), border-color 0.4s, backdrop-filter 0.4s;
  border-bottom: 1px solid transparent;
}
.topbar.scrolled {
  background: rgba(8, 10, 18, 0.62);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-bottom-color: var(--border-soft);
}

.bar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.85rem 1.6rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand { display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0; }
.logo {
  width: 38px; height: 38px; display: grid; place-items: center;
  border-radius: 11px; color: var(--accent);
  background: rgba(56, 225, 240, 0.1);
  border: 1px solid rgba(56, 225, 240, 0.22);
}
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-name { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; }
.brand-sub { font-size: 0.66rem; color: var(--text-muted); }

.links { display: flex; align-items: center; gap: 0.2rem; margin-left: auto; }
.link {
  position: relative;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  transition: color 0.25s, background 0.25s;
}
.link:hover { color: var(--text); background: rgba(255,255,255,0.04); }
.link.active { color: var(--text); }
.link.active::after {
  content: "";
  position: absolute;
  left: 50%; bottom: 2px;
  width: 18px; height: 2px;
  transform: translateX(-50%);
  background: var(--accent-grad);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(91,140,255,0.8);
}

.burger { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
.burger span, .burger span::before, .burger span::after {
  content: ""; display: block; width: 22px; height: 2px;
  background: var(--text); border-radius: 2px; transition: 0.3s var(--ease);
}
.burger span::before { transform: translateY(-7px); }
.burger span::after { transform: translateY(5px); }
.burger span.x { background: transparent; }
.burger span.x::before { transform: rotate(45deg); }
.burger span.x::after { transform: rotate(-45deg) translateY(-1px); }

@media (max-width: 820px) {
  .burger { display: block; margin-left: auto; }
  .links {
    position: absolute;
    top: 100%; left: 0; right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0.2rem;
    padding: 0.8rem 1.2rem 1.2rem;
    background: rgba(8, 10, 18, 0.9);
    backdrop-filter: blur(22px);
    border-bottom: 1px solid var(--border-soft);
    margin-left: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s var(--ease), padding 0.4s var(--ease);
    padding-top: 0; padding-bottom: 0;
  }
  .links.open { max-height: 380px; padding-top: 0.8rem; padding-bottom: 1.2rem; }
  .link { padding: 0.7rem 0.9rem; }
  .link.active::after { left: 0.9rem; transform: none; }
}
</style>
