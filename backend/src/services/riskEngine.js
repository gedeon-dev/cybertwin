/**
 * Moteur d'analyse de risque cyber.
 *
 * Le score global est calculé à partir de quatre facteurs imposés par le cahier
 * des charges :
 *   1. le nombre d'actifs        -> surface d'attaque
 *   2. le nombre de vulnérabilités
 *   3. la criticité des vulnérabilités
 *   4. l'exposition Internet     -> au niveau actif ET au niveau entreprise
 *
 * Le score est borné entre 0 et 100 puis traduit en trois niveaux :
 *   faible  (0 - 33), moyen (34 - 66), élevé (67 - 100).
 */

// Poids associés à chaque niveau de criticité d'une vulnérabilité.
const CRITICITY_WEIGHT = {
  faible: 1,
  moyenne: 3,
  élevée: 5,
};

// Un actif exposé sur Internet amplifie l'impact de ses vulnérabilités.
const EXPOSED_ASSET_FACTOR = 1.6;

// Pondérations globales de chaque composante du score.
const W_VULN = 1.5; // poids des vulnérabilités (facteur dominant)
const W_SURFACE = 1; // poids de la surface d'attaque (par actif)
const W_EXPOSURE = 2.5; // poids de chaque service exposé sur Internet

/**
 * Catalogue de recommandations déclenchées par certaines vulnérabilités.
 * La clé est un mot présent dans le nom de la vulnérabilité (insensible à la
 * casse) ; la valeur est la recommandation de remédiation associée.
 */
const RECOMMENDATION_RULES = [
  {
    match: /obsol|à jour|maj|version/i,
    text: "Mettre en place une politique de mises à jour régulières et désactiver les logiciels obsolètes.",
  },
  {
    match: /mot de passe|password|faible/i,
    text: "Imposer des mots de passe robustes et activer l'authentification multifacteur (MFA).",
  },
  {
    match: /port|exposé|ouvert/i,
    text: "Fermer les ports inutiles et placer les services exposés derrière un pare-feu ou un WAF.",
  },
  {
    match: /sauvegarde|backup/i,
    text: "Mettre en place des sauvegardes automatiques chiffrées et tester régulièrement leur restauration.",
  },
  {
    match: /chiffr|tls|ssl|https/i,
    text: "Chiffrer les communications et les données sensibles (TLS, chiffrement au repos).",
  },
  {
    match: /injection|sql|xss/i,
    text: "Valider et assainir systématiquement les entrées utilisateur pour prévenir les injections.",
  },
];

/**
 * Calcule le score de risque cyber d'une entreprise.
 *
 * @param {Object} params
 * @param {Object} params.company         - fiche entreprise
 * @param {Array}  params.assets          - liste des actifs
 * @param {Array}  params.vulnerabilities - liste des vulnérabilités
 * @returns {Object} détail du risque (score, niveau, composantes, recommandations)
 */
function computeRisk({ company, assets, vulnerabilities }) {
  const assetById = new Map(assets.map((a) => [a.id, a]));

  // --- Composante vulnérabilités (criticité + exposition de l'actif) -------
  let vulnScore = 0;
  for (const vuln of vulnerabilities) {
    const weight = CRITICITY_WEIGHT[vuln.criticite] ?? CRITICITY_WEIGHT.moyenne;
    const asset = assetById.get(vuln.assetId);
    const exposureFactor = asset && asset.exposed ? EXPOSED_ASSET_FACTOR : 1;
    vulnScore += weight * exposureFactor;
  }

  // --- Composante surface d'attaque (nombre d'actifs) ----------------------
  const surfaceScore = assets.length * W_SURFACE;

  // --- Composante exposition Internet (au niveau entreprise) ---------------
  const exposedServices = Array.isArray(company?.servicesExposes)
    ? company.servicesExposes.length
    : 0;
  const exposureScore = exposedServices * W_EXPOSURE;

  const raw = vulnScore * W_VULN + surfaceScore + exposureScore;
  const score = Math.min(100, Math.round(raw));
  const level = scoreToLevel(score);

  return {
    score,
    level,
    components: {
      vulnerabilities: Math.round(vulnScore * W_VULN),
      surface: Math.round(surfaceScore),
      exposure: Math.round(exposureScore),
    },
    stats: {
      totalAssets: assets.length,
      totalVulnerabilities: vulnerabilities.length,
      exposedAssets: assets.filter((a) => a.exposed).length,
      exposedServices,
      criticalVulnerabilities: vulnerabilities.filter(
        (v) => v.criticite === "élevée"
      ).length,
    },
    recommendations: buildRecommendations({
      company,
      assets,
      vulnerabilities,
      level,
    }),
    computedAt: new Date().toISOString(),
  };
}

/** Traduit un score numérique en niveau qualitatif. */
function scoreToLevel(score) {
  if (score <= 33) return "faible";
  if (score <= 66) return "moyen";
  return "élevé";
}

/** Construit une liste de recommandations adaptées au contexte analysé. */
function buildRecommendations({ company, assets, vulnerabilities, level }) {
  const recommendations = new Set();

  // Règles déclenchées par le nom des vulnérabilités.
  for (const vuln of vulnerabilities) {
    for (const rule of RECOMMENDATION_RULES) {
      if (rule.match.test(vuln.nom)) {
        recommendations.add(rule.text);
      }
    }
  }

  // Règles contextuelles.
  const exposedAssets = assets.filter((a) => a.exposed);
  if (exposedAssets.length > 0) {
    recommendations.add(
      "Segmenter le réseau et isoler les actifs exposés sur Internet dans une zone démilitarisée (DMZ)."
    );
  }

  if (Array.isArray(company?.servicesExposes) && company.servicesExposes.length >= 3) {
    recommendations.add(
      "Réduire le nombre de services exposés publiquement et auditer ceux qui restent."
    );
  }

  if (level === "élevé") {
    recommendations.add(
      "Établir un plan de remédiation prioritaire et envisager un audit de sécurité externe."
    );
  } else if (level === "moyen") {
    recommendations.add(
      "Surveiller l'évolution des vulnérabilités et corriger en priorité les criticités élevées."
    );
  }

  // Recommandation de fond toujours utile.
  recommendations.add(
    "Sensibiliser les collaborateurs aux risques cyber (phishing, mots de passe, ingénierie sociale)."
  );

  return [...recommendations];
}

module.exports = { computeRisk, scoreToLevel, CRITICITY_WEIGHT };
