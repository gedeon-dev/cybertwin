/**
 * Stockage des données en mémoire.
 *
 * Pour rester simple à exécuter (aucune base de données à installer), les
 * données sont conservées en mémoire et réinitialisées au démarrage avec
 * l'entreprise fictive JQGM-Solutions et un inventaire d'exemple.
 *
 * Le store expose une petite API CRUD utilisée par les routes Express.
 */

const { randomUUID } = require("crypto");

/** Génère l'état initial (entreprise + actifs + vulnérabilités). */
function seed() {
  const company = {
    id: "jqgm-solutions",
    nom: "JQGM-Solutions",
    secteur: "Éditeur de logiciels (SaaS)",
    nbEmployes: 28,
    nbServeurs: 6,
    nbPostesClients: 32,
    servicesExposes: [
      "Site web public",
      "API REST (clients SaaS)",
      "Webmail",
      "VPN d'accès distant",
    ],
    description:
      "PME française éditrice d'une solution SaaS de gestion des congés. " +
      "L'infrastructure mêle serveurs hébergés dans le cloud et un petit parc " +
      "interne, avec plusieurs services exposés à ses clients.",
  };

  const assetsSeed = [
    { nom: "Serveur Web Nginx", type: "Serveur Web", exposed: true },
    { nom: "Base PostgreSQL Production", type: "Base de données", exposed: false },
    { nom: "API Node.js (Posé)", type: "Application métier", exposed: true },
    { nom: "Poste développeur #1", type: "Poste utilisateur", exposed: false },
    { nom: "Poste comptabilité", type: "Poste utilisateur", exposed: false },
    { nom: "Routeur principal", type: "Routeur", exposed: true },
    { nom: "Pare-feu périmétrique", type: "Pare-feu", exposed: true },
  ];

  const assets = assetsSeed.map((a) => ({ id: randomUUID(), ...a }));
  const byName = (name) => assets.find((a) => a.nom === name).id;

  const vulnerabilitiesSeed = [
    { assetId: byName("Serveur Web Nginx"), nom: "Logiciel obsolète (Nginx non à jour)", criticite: "élevée" },
    { assetId: byName("Serveur Web Nginx"), nom: "Port d'administration exposé", criticite: "moyenne" },
    { assetId: byName("Base PostgreSQL Production"), nom: "Absence de sauvegarde chiffrée", criticite: "élevée" },
    { assetId: byName("Base PostgreSQL Production"), nom: "Mot de passe faible sur compte admin", criticite: "élevée" },
    { assetId: byName("API Node.js (Posé)"), nom: "Dépendances npm vulnérables", criticite: "moyenne" },
    { assetId: byName("API Node.js (Posé)"), nom: "Absence de chiffrement TLS sur un endpoint", criticite: "moyenne" },
    { assetId: byName("Poste comptabilité"), nom: "Antivirus obsolète", criticite: "faible" },
    { assetId: byName("Routeur principal"), nom: "Mot de passe par défaut non changé", criticite: "élevée" },
  ];

  const vulnerabilities = vulnerabilitiesSeed.map((v) => ({
    id: randomUUID(),
    ...v,
  }));

  return { company, assets, vulnerabilities };
}

// État courant (mutable).
let state = seed();

const store = {
  // --- Entreprise ---------------------------------------------------------
  getCompany() {
    return state.company;
  },
  updateCompany(patch) {
    state.company = { ...state.company, ...patch, id: state.company.id };
    return state.company;
  },

  // --- Actifs -------------------------------------------------------------
  getAssets() {
    return state.assets;
  },
  getAsset(id) {
    return state.assets.find((a) => a.id === id) || null;
  },
  addAsset(data) {
    const asset = {
      id: randomUUID(),
      nom: data.nom,
      type: data.type,
      exposed: Boolean(data.exposed),
    };
    state.assets.push(asset);
    return asset;
  },
  updateAsset(id, patch) {
    const asset = store.getAsset(id);
    if (!asset) return null;
    Object.assign(asset, {
      nom: patch.nom ?? asset.nom,
      type: patch.type ?? asset.type,
      exposed: patch.exposed ?? asset.exposed,
    });
    return asset;
  },
  deleteAsset(id) {
    const idx = state.assets.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    state.assets.splice(idx, 1);
    // On supprime aussi les vulnérabilités rattachées à cet actif.
    state.vulnerabilities = state.vulnerabilities.filter(
      (v) => v.assetId !== id
    );
    return true;
  },

  // --- Vulnérabilités -----------------------------------------------------
  getVulnerabilities() {
    return state.vulnerabilities;
  },
  getVulnerabilitiesByAsset(assetId) {
    return state.vulnerabilities.filter((v) => v.assetId === assetId);
  },
  addVulnerability(data) {
    const vuln = {
      id: randomUUID(),
      assetId: data.assetId,
      nom: data.nom,
      criticite: data.criticite,
    };
    state.vulnerabilities.push(vuln);
    return vuln;
  },
  deleteVulnerability(id) {
    const idx = state.vulnerabilities.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    state.vulnerabilities.splice(idx, 1);
    return true;
  },

  // --- Utilitaire (tests / démo) -----------------------------------------
  reset() {
    state = seed();
  },
};

module.exports = store;
