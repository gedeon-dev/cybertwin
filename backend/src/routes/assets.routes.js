const express = require("express");
const store = require("../data/store");
const { validateAsset } = require("../middleware/validate");

const router = express.Router();

// GET /api/assets -> liste des actifs
router.get("/", (req, res) => {
  res.json(store.getAssets());
});

// GET /api/assets/:id -> un actif
router.get("/:id", (req, res) => {
  const asset = store.getAsset(req.params.id);
  if (!asset) return res.status(404).json({ error: "Actif introuvable." });
  res.json(asset);
});

// POST /api/assets -> création d'un actif
router.post("/", (req, res) => {
  const errors = validateAsset(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const asset = store.addAsset(req.body);
  res.status(201).json(asset);
});

// PUT /api/assets/:id -> mise à jour d'un actif
router.put("/:id", (req, res) => {
  const errors = validateAsset(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ errors });
  const asset = store.updateAsset(req.params.id, req.body);
  if (!asset) return res.status(404).json({ error: "Actif introuvable." });
  res.json(asset);
});

// DELETE /api/assets/:id -> suppression d'un actif (et de ses vulnérabilités)
router.delete("/:id", (req, res) => {
  const ok = store.deleteAsset(req.params.id);
  if (!ok) return res.status(404).json({ error: "Actif introuvable." });
  res.status(204).send();
});

module.exports = router;
