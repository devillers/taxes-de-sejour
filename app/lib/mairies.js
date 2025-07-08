// /app/lib/mairies.js

// Objet contenant les emails des mairies, avec clés NORMALISÉES
export const mairies = {
  "chamonix-mont-blanc": "davidevillers@gmail.com",
  "les-houches": "mairie@leshouches.fr",
  "saint-gervais-les-bains": "mairie@saintgervais.com",
  // Ajoute ici toutes tes autres villes au format normalisé
  "megeve": "mairie@megeve.fr"
};

// Fonction utilitaire : normalise un nom de ville pour correspondre aux clés de l'objet mairies
export function normalizeVille(ville) {
  if (!ville) return "";
  return ville
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève accents
    .replace(/\s+/g, "-")            // espaces → tirets
    .replace(/-+/g, "-")             // plusieurs tirets → 1 seul
    .trim();
}

// Petite fonction test (peut être supprimée après debug)
export function logVilleDebug(ville) {
  const norm = normalizeVille(ville);
  const email = mairies[norm];
  console.log(`Test ville: "${ville}" => "${norm}" | email: ${email || "NON TROUVÉ"}`);
}
