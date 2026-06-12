/**
 * Petites fonctions de validation des données reçues par l'API.
 * Elles renvoient un tableau de messages d'erreur (vide si tout est valide).
 */

const ASSET_TYPES = [
  "Serveur Web",
  "Base de données",
  "Poste utilisateur",
  "Routeur",
  "Pare-feu",
  "Application métier",
];

const CRITICITES = ["faible", "moyenne", "élevée"];

function validateAsset(body, { partial = false } = {}) {
  const errors = [];
  const has = (k) => body[k] !== undefined && body[k] !== null;

  if (!partial || has("nom")) {
    if (typeof body.nom !== "string" || body.nom.trim().length < 2) {
      errors.push("Le nom de l'actif est requis (2 caractères minimum).");
    }
  }
  if (!partial || has("type")) {
    if (!ASSET_TYPES.includes(body.type)) {
      errors.push(`Le type doit être l'un de : ${ASSET_TYPES.join(", ")}.`);
    }
  }
  if (has("exposed") && typeof body.exposed !== "boolean") {
    errors.push("Le champ 'exposed' doit être un booléen.");
  }
  return errors;
}

function validateVulnerability(body) {
  const errors = [];
  if (typeof body.assetId !== "string" || body.assetId.length === 0) {
    errors.push("L'identifiant de l'actif (assetId) est requis.");
  }
  if (typeof body.nom !== "string" || body.nom.trim().length < 2) {
    errors.push("Le nom de la vulnérabilité est requis.");
  }
  if (!CRITICITES.includes(body.criticite)) {
    errors.push(`La criticité doit être l'une de : ${CRITICITES.join(", ")}.`);
  }
  return errors;
}

module.exports = {
  validateAsset,
  validateVulnerability,
  ASSET_TYPES,
  CRITICITES,
};
