/**
 * Client d'API basé sur la Fetch API (technologie imposée par le cahier
 * des charges). Centralise les appels REST vers le backend Express.
 *
 * On cible le backend en absolu (127.0.0.1) pour éviter les soucis de
 * résolution localhost IPv6/IPv4 sous Windows. CORS est activé côté serveur.
 */

const BASE = "http://127.0.0.1:3000";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.error || data?.errors?.join(" ") || `Erreur HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Entreprise
  getCompany: () => request("/company"),
  updateCompany: (payload) =>
    request("/company", { method: "PUT", body: JSON.stringify(payload) }),

  // Actifs
  getAssets: () => request("/assets"),
  createAsset: (payload) =>
    request("/assets", { method: "POST", body: JSON.stringify(payload) }),
  updateAsset: (id, payload) =>
    request(`/assets/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteAsset: (id) => request(`/assets/${id}`, { method: "DELETE" }),

  // Vulnérabilités
  getVulnerabilities: () => request("/vulnerabilities"),
  createVulnerability: (payload) =>
    request("/vulnerabilities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteVulnerability: (id) =>
    request(`/vulnerabilities/${id}`, { method: "DELETE" }),

  // Risque
  calculateRisk: () => request("/risk/calculate", { method: "POST", body: "{}" }),
  getReport: () => request("/risk/report"),
};
