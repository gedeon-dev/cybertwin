# CyberTwin — Simulateur de Risque Cyber pour PME

> Projet binôme · Développement Fullstack avec **Vue.js** et **Node.js**
> Entreprise fictive analysée : **JQGM-Solutions**

CyberTwin construit le « jumeau numérique » d'une PME — ses actifs informatiques,
ses vulnérabilités et son exposition Internet — puis évalue **automatiquement**
son niveau de risque cyber et génère des **recommandations de sécurité**.

---

## 1. Présentation du projet

La cybersécurité est un enjeu majeur pour les entreprises. CyberTwin permet de :

- modéliser une entreprise fictive et son infrastructure,
- inventorier ses actifs (serveurs, bases, postes, équipements réseau),
- associer des vulnérabilités à chaque actif avec un niveau de criticité,
- calculer un **score de risque global** (faible / moyen / élevé),
- visualiser le tout dans un **tableau de bord** avec graphiques,
- produire un **rapport final** exportable en PDF.

L'entreprise analysée par défaut est **JQGM-Solutions**, une PME éditrice d'une
solution SaaS, avec 7 actifs et 8 vulnérabilités pré-renseignés pour la démo.

### Stack technique

| Côté | Technologies |
|------|--------------|
| **Frontend** | Vue.js 3, Vue Router, Pinia, Fetch API, Chart.js, Vite |
| **Backend** | Node.js, Express.js |

---

## 2. Architecture

```
cybertwin/
├── backend/                    # API REST (Node.js + Express)
│   ├── server.js               # point d'entrée, montage des routes
│   └── src/
│       ├── routes/             # company, assets, vulnerabilities, risk
│       ├── services/
│       │   └── riskEngine.js   # moteur de calcul du risque + recommandations
│       ├── middleware/
│       │   └── validate.js     # validation des données
│       └── data/
│           └── store.js        # stockage en mémoire (seed : JQGM-Solutions)
│
└── frontend/                   # Interface Vue.js
    ├── index.html
    ├── vite.config.js          # proxy dev vers le backend
    └── src/
        ├── main.js
        ├── App.vue
        ├── api/client.js       # appels REST via Fetch API
        ├── router/index.js     # 6 routes (Accueil, Entreprise, …)
        ├── stores/             # Pinia : company, assets, vulnerabilities, risk, ui
        ├── components/         # RiskGauge, charts, modal, navigation…
        └── views/              # une vue par page
```

---

## 3. Installation

Pré-requis : **Node.js ≥ 18** et **npm**.

```bash
# Backend
cd backend
npm install

# Frontend (dans un autre terminal)
cd frontend
npm install
```

---

## 4. Exécution

Il faut lancer **les deux serveurs** (deux terminaux).

```bash
# Terminal 1 — API backend (port 3000)
cd backend
npm start          # ou : npm run dev  (rechargement automatique)

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Puis ouvrir **http://localhost:5173**.

> En développement, Vite proxifie automatiquement les appels API
> (`/company`, `/assets`, `/vulnerabilities`, `/risk`) vers le backend sur le
> port 3000 — aucune configuration CORS supplémentaire n'est nécessaire.

Pour générer le build de production du frontend :

```bash
cd frontend
npm run build      # sortie dans frontend/dist/
npm run preview
```

---

## 5. Description des fonctionnalités

### Gestion de l'entreprise
Consultation et modification de la fiche : nom, secteur, nombre d'employés,
de serveurs, de postes clients, services exposés sur Internet, description.

### Gestion des actifs
Ajout, modification, suppression et consultation des actifs. Six types
possibles : Serveur Web, Base de données, Poste utilisateur, Routeur, Pare-feu,
Application métier. Un actif peut être marqué « exposé sur Internet ».

### Gestion des vulnérabilités
Association de vulnérabilités à un actif, avec un niveau de criticité
(faible / moyenne / élevée). Filtrage par actif. La suppression d'un actif
supprime automatiquement ses vulnérabilités.

### Calcul du risque cyber
Le moteur d'analyse (`riskEngine.js`) calcule un score borné à 100 :

```
score = clamp(0..100) [
    Σ (poids_criticité × facteur_exposition_actif) × 1.5   ← vulnérabilités
  + (nombre d'actifs) × 1.0                                 ← surface d'attaque
  + (nombre de services exposés) × 2.5                      ← exposition Internet
]
```

- poids de criticité : faible = 1, moyenne = 3, élevée = 5
- un actif exposé sur Internet amplifie ses vulnérabilités (× 1.6)

Niveaux : **faible** (0–33) · **moyen** (34–66) · **élevé** (67–100).
Le calcul prend bien en compte les quatre facteurs imposés : nombre d'actifs,
nombre de vulnérabilités, criticité, exposition Internet.

### Tableau de bord
Statistiques (total actifs, actifs exposés, total vulnérabilités, score),
jauge de risque, décomposition du score, et **deux graphiques** (Chart.js) :
répartition des actifs par type (donut) et vulnérabilités par criticité (barres).

### Rapport final
Document de synthèse : présentation de l'entreprise, inventaire des actifs,
vulnérabilités détectées, niveau de risque et recommandations de sécurité.
Exportable en **PDF** via l'impression du navigateur.

### Fonctionnalités supplémentaires (bonus)
- **Export PDF** du rapport
- **Historique des analyses** (conservé dans le store Pinia `risk`)
- **Dark mode** natif (thème SOC sombre)
- **Notifications** (toasts) sur chaque action

---

## 6. Documentation de l'API REST

Base : `http://localhost:3000`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/company` | Récupère la fiche entreprise |
| `PUT` | `/company` | Met à jour la fiche entreprise |
| `GET` | `/assets` | Liste des actifs |
| `GET` | `/assets/:id` | Détail d'un actif |
| `POST` | `/assets` | Crée un actif |
| `PUT` | `/assets/:id` | Modifie un actif |
| `DELETE` | `/assets/:id` | Supprime un actif (et ses vulnérabilités) |
| `GET` | `/vulnerabilities` | Liste des vulnérabilités (`?assetId=` pour filtrer) |
| `POST` | `/vulnerabilities` | Associe une vulnérabilité à un actif |
| `DELETE` | `/vulnerabilities/:id` | Supprime une vulnérabilité |
| `POST` | `/risk/calculate` | Calcule le score de risque |
| `GET` | `/risk/report` | Rapport complet prêt à afficher |

### Exemples

```bash
# Calcul du risque
curl -X POST http://localhost:3000/risk/calculate

# Création d'un actif
curl -X POST http://localhost:3000/assets \
  -H "Content-Type: application/json" \
  -d '{"nom":"Serveur de sauvegarde","type":"Base de données","exposed":false}'

# Association d'une vulnérabilité
curl -X POST http://localhost:3000/vulnerabilities \
  -H "Content-Type: application/json" \
  -d '{"assetId":"<id>","nom":"Mot de passe faible","criticite":"élevée"}'
```

Les données sont validées côté serveur (types d'actifs et niveaux de criticité
contrôlés) ; une erreur renvoie un code `400` avec la liste des messages.

---

## 7. Répartition du travail

| Étudiant A — Frontend | Étudiant B — Backend |
|-----------------------|----------------------|
| Maquette & intégration HTML/CSS, responsive | Serveur Node.js + configuration Express |
| Composants Vue, formulaires, vues | Endpoints de l'API REST + validation |
| Vue Router (6 routes) & navigation | Stockage des actifs et vulnérabilités |
| Gestion d'état Pinia | Moteur d'analyse (score + recommandations) |
| Dashboard & graphiques | Documentation et tests de l'API |

**Travail commun** : architecture générale, intégration front/back, tests,
débogage, rapport et préparation de la soutenance.

---

## 8. Pistes d'amélioration

- Persistance en base de données (PostgreSQL / SQLite) au lieu de la mémoire
- Authentification utilisateur et gestion multi-entreprises
- Pondérations de risque configurables et référentiel de vulnérabilités (CVE)
- Export PDF natif côté serveur

---

*Projet réalisé dans le cadre du module Développement Fullstack Vue.js / Node.js.*
