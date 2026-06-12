<script setup>
import { onMounted } from "vue";
import AppNav from "./components/AppNav.vue";
import ToastHost from "./components/ToastHost.vue";
import AmbientBackground from "./components/AmbientBackground.vue";
import { useCompanyStore } from "./stores/company";
import { useAssetsStore } from "./stores/assets";
import { useVulnerabilitiesStore } from "./stores/vulnerabilities";

// Au démarrage, on hydrate les stores depuis l'API.
const company = useCompanyStore();
const assets = useAssetsStore();
const vulns = useVulnerabilitiesStore();

onMounted(() => {
  company.fetch();
  assets.fetch();
  vulns.fetch();
});
</script>

<template>
  <AmbientBackground />
  <div class="shell">
    <AppNav />
    <main class="content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <ToastHost />
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content { flex: 1; min-width: 0; }

/* Transition de page fluide (fondu + léger glissement vertical) */
.page-enter-active { transition: opacity 0.5s var(--ease), transform 0.5s var(--ease); }
.page-leave-active { transition: opacity 0.3s var(--ease-soft), transform 0.3s var(--ease-soft); }
.page-enter-from { opacity: 0; transform: translateY(14px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
