// cleanCsv.js
export function cleanCsvBuffer(buffer, headerKey = 'Id Propriétaires', separator = ',') {
  // Convertit le buffer en texte
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);

  // 1. Cherche la première ligne contenant le headerKey (ex : 'Id Propriétaires', 'Réservation', etc)
  let headerIndex = lines.findIndex(line =>
    line.replace(/"/g, '').includes(headerKey)
  );
  if (headerIndex === -1) headerIndex = 0; // fallback: tout garder

  // 2. Garde uniquement header + lignes suivantes non vides
  let usefulLines = lines.slice(headerIndex).filter(l => l.trim().length > 0);

  // 3. Enlève les guillemets début/fin de champ, si séparateur = ','
  if (separator === ',') {
    usefulLines = usefulLines.map(line =>
      line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map(field => field.replace(/^"(.*)"$/, '$1'))
        .join(',')
    );
  }
  // Si tu as besoin de gérer les points-virgules aussi (pas de guillemets), ignore cette étape.

  // 4. Retourne le buffer propre
  return Buffer.from(usefulLines.join('\n'), 'utf8');
}
