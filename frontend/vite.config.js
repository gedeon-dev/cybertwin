import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Le proxy redirige les appels API du front (port 5173) vers le backend
// Express (port 3000) en développement, ce qui évite tout souci de CORS.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      "/company": "http://localhost:3000",
      "/assets": "http://localhost:3000",
      "/vulnerabilities": "http://localhost:3000",
      "/risk": "http://localhost:3000",
    },
  },
});
