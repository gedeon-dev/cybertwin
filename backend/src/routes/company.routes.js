const express = require("express");
const store = require("../data/store");

const router = express.Router();

// GET /api/company -> fiche de l'entreprise
router.get("/", (req, res) => {
  res.json(store.getCompany());
});

// PUT /api/company -> mise à jour de la fiche entreprise
router.put("/", (req, res) => {
  const allowed = [
    "nom",
    "secteur",
    "nbEmployes",
    "nbServeurs",
    "nbPostesClients",
    "servicesExposes",
    "description",
  ];
  const patch = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  }
  res.json(store.updateCompany(patch));
});

module.exports = router;
