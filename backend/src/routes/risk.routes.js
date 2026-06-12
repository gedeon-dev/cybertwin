const express = require("express");
const store = require("../data/store");
const { computeRisk } = require("../services/riskEngine");

const router = express.Router();

/** Rassemble le contexte courant à analyser. */
function currentContext() {
  return {
    company: store.getCompany(),
    assets: store.getAssets(),
    vulnerabilities: store.getVulnerabilities(),
  };
}

// POST /api/risk/calculate -> calcul du score de risque
// Sans corps : analyse les données stockées.
// Avec corps { company, assets, vulnerabilities } : analyse à la demande.
router.post("/calculate", (req, res) => {
  const ctx = currentContext();
  const company = req.body.company ?? ctx.company;
  const assets = req.body.assets ?? ctx.assets;
  const vulnerabilities = req.body.vulnerabilities ?? ctx.vulnerabilities;

  const result = computeRisk({ company, assets, vulnerabilities });
  res.json(result);
});

// GET /api/risk/report -> rapport complet prêt à afficher / exporter
router.get("/report", (req, res) => {
  const ctx = currentContext();
  const risk = computeRisk(ctx);

  // Répartition des actifs par type (utile au tableau de bord et au rapport).
  const repartition = ctx.assets.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  // Vulnérabilités enrichies avec le nom de leur actif.
  const assetName = new Map(ctx.assets.map((a) => [a.id, a.nom]));
  const vulnerabilities = ctx.vulnerabilities.map((v) => ({
    ...v,
    assetName: assetName.get(v.assetId) || "Actif supprimé",
  }));

  res.json({
    company: ctx.company,
    assets: ctx.assets,
    vulnerabilities,
    repartition,
    risk,
    generatedAt: new Date().toISOString(),
  });
});

module.exports = router;
