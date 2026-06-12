import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CompanyView from "../views/CompanyView.vue";
import AssetsView from "../views/AssetsView.vue";
import VulnerabilitiesView from "../views/VulnerabilitiesView.vue";
import DashboardView from "../views/DashboardView.vue";
import ReportView from "../views/ReportView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView, meta: { title: "Accueil" } },
  { path: "/entreprise", name: "company", component: CompanyView, meta: { title: "Entreprise" } },
  { path: "/actifs", name: "assets", component: AssetsView, meta: { title: "Actifs" } },
  { path: "/vulnerabilites", name: "vulnerabilities", component: VulnerabilitiesView, meta: { title: "Vulnérabilités" } },
  { path: "/tableau-de-bord", name: "dashboard", component: DashboardView, meta: { title: "Tableau de bord" } },
  { path: "/rapport", name: "report", component: ReportView, meta: { title: "Rapport" } },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `CyberTwin · ${to.meta.title}`
    : "CyberTwin";
});

export default router;
