import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { reveal } from "./composables/reveal";
import "./assets/styles.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.directive("reveal", reveal); // directive globale d'animation au scroll
app.mount("#app");
