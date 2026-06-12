<script setup>
import { computed } from "vue";
import { useCompanyStore } from "../stores/company";

const company = useCompanyStore();
const companyName = computed(() => company.company?.nom ?? "—");

const links = [
  { to: "/", label: "Accueil", icon: "M3 11l9-8 9 8M5 10v9h5v-6h4v6h5v-9" },
  { to: "/entreprise", label: "Entreprise", icon: "M4 21V8l8-5 8 5v13M9 21v-6h6v6" },
  { to: "/actifs", label: "Actifs", icon: "M3 7h18v5H3zM3 14h18v5H3" },
  { to: "/vulnerabilites", label: "Vulnérabilités", icon: "M12 3l9 16H3zM12 10v4M12 17v.5" },
  { to: "/tableau-de-bord", label: "Tableau de bord", icon: "M3 13h7V3H3zM14 21h7V11h-7zM14 3v6h7V3zM3 21h7v-4H3z" },
  { to: "/rapport", label: "Rapport", icon: "M6 3h9l4 4v14H6zM14 3v5h5" },
];
</script>

<template>
  <aside class="nav">
    <div class="brand">
      <div class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path
            d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div>
        <div class="brand-name">CyberTwin</div>
        <div class="brand-sub">{{ companyName }}</div>
      </div>
    </div>

    <nav class="links">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="link"
        active-class="active"
        :exact-active-class="link.to === '/' ? 'active' : ''"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" class="link-icon">
          <path :d="link.icon" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="nav-foot">
      <div class="mono">v1.0 · binôme</div>
      <div class="mono muted">Vue 3 · Node.js</div>
    </div>
  </aside>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.4rem 1rem;
  background: linear-gradient(180deg, #0d1326, #0a0f1f);
  border-right: 1px solid var(--border-soft);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 0.4rem 1.4rem;
  margin-bottom: 0.6rem;
  border-bottom: 1px solid var(--border-soft);
}

.logo {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: var(--accent);
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.25);
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
}
.brand-sub {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.7rem;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 0.92rem;
  font-weight: 500;
  transition: background 0.12s ease, color 0.12s ease;
}

.link:hover {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
}

.link.active {
  background: rgba(34, 211, 238, 0.1);
  color: var(--accent);
}
.link.active .link-icon {
  color: var(--accent);
}

.nav-foot {
  padding: 0.8rem 0.4rem 0;
  border-top: 1px solid var(--border-soft);
  font-size: 0.72rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

@media (max-width: 860px) {
  .nav {
    position: static;
    height: auto;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .brand { border: none; padding: 0 0.6rem 0 0; margin: 0; }
  .links { flex-direction: row; flex-wrap: wrap; flex: 1 1 100%; }
  .nav-foot { display: none; }
}
</style>
