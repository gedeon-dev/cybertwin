const express = require("express");
const store = require("../data/store");
const { validateVulnerability } = require("../middleware/validate");

const router = express.Router();

// GET /api/vulnerabilities -> toutes les vulnérabilités
// GET /api/vulnerabilities?assetId=... -> filtrées par actif
router.get("/", (req, res) => {
  const { assetId } = req.query;
  if (assetId) {
    return res.json(store.getVulnerabilitiesByAsset(assetId));
  }
  res.json(store.getVulnerabilities());
});

// POST /api/vulnerabilities -> association d'une vulnérabilité à un actif
router.post("/", (req, res) => {
  const errors = validateVulnerability(req.body);
  if (errors.length) return res.status(400).json({ errors });

  if (!store.getAsset(req.body.assetId)) {
    return res.status(400).json({ errors: ["L'actif ciblé n'existe pas."] });
  }

  const vuln = store.addVulnerability(req.body);
  res.status(201).json(vuln);
});

// DELETE /api/vulnerabilities/:id
router.delete("/:id", (req, res) => {
  const ok = store.deleteVulnerability(req.params.id);
  if (!ok) return res.status(404).json({ error: "Vulnérabilité introuvable." });
  res.status(204).send();
});

module.exports = router;
