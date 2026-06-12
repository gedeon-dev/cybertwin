/**
 * CyberTwin - Serveur backend (Node.js + Express)
 *
 * Expose l'API REST de gestion de l'entreprise, des actifs, des
 * vulnérabilités et du calcul de risque cyber.
 */

const express = require("express");
const cors = require("cors");

const companyRoutes = require("./src/routes/company.routes");
const assetsRoutes = require("./src/routes/assets.routes");
const vulnerabilitiesRoutes = require("./src/routes/vulnerabilities.routes");
const riskRoutes = require("./src/routes/risk.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globaux ---------------------------------------------------
app.use(cors());
app.use(express.json());

// Journalisation minimale des requêtes.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// --- Routes ----------------------------------------------------------------
// Les chemins respectent le cahier des charges : /company, /assets, etc.
app.get("/", (req, res) => {
  res.json({
    name: "CyberTwin API",
    description: "Simulateur de risque cyber pour PME",
    endpoints: [
      "GET    /company",
      "PUT    /company",
      "GET    /assets",
      "POST   /assets",
      "PUT    /assets/:id",
      "DELETE /assets/:id",
      "GET    /vulnerabilities",
      "POST   /vulnerabilities",
      "DELETE /vulnerabilities/:id",
      "POST   /risk/calculate",
      "GET    /risk/report",
    ],
  });
});

app.use("/company", companyRoutes);
app.use("/assets", assetsRoutes);
app.use("/vulnerabilities", vulnerabilitiesRoutes);
app.use("/risk", riskRoutes);

// --- Gestion des erreurs ---------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur." });
});

app.listen(PORT, () => {
  console.log(`CyberTwin API démarrée sur http://localhost:${PORT}`);
});

module.exports = app;
