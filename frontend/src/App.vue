<script setup>
import { onMounted } from "vue";
import AppNav from "./components/AppNav.vue";
import ToastHost from "./components/ToastHost.vue";
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
  <div class="shell">
    <AppNav />
    <main class="content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <ToastHost />
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
}

.content {
  min-width: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 860px) {
  .shell {
    grid-template-columns: 1fr;
  }
}
</style>
