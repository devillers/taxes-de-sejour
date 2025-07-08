// app/lib/cleanCsv.js
/**
 * Nettoie un buffer CSV pour ne garder que la partie à parser, en supprimant les pollutions éventuelles.
 * - Enlève tous les guillemets
 * - Commence à la ligne qui débute vraiment le header (Id Propriétaires,...)
 * - Ignore toutes les lignes vides
 * @param {Buffer} buffer
 * @param {string} headerKey - ex: 'Id Propriétaires'
 * @param {string} delimiter - ex: ';'
 * @returns {Buffer}
 */
export function cleanCsv(buffer, headerKey = 'Id Propriétaires', delimiter = ';') {
  let text = buffer.toString('utf8').replace(/"/g, '');

  // Découpe en lignes
  const lines = text.split(/\r?\n/);

  // Cherche la 1ère ligne qui commence VRAIMENT par "Id Propriétaires" (header attendu)
  let headerIdx = lines.findIndex(
    line => line.trim().startsWith(headerKey)
  );
  if (headerIdx === -1) {
    // Fallback : toute ligne contenant le header quelque part
    headerIdx = lines.findIndex(line => line.includes(headerKey));
  }
  if (headerIdx === -1) headerIdx = 0;

  // Enlève toutes les lignes vides après le header
  const useful = lines.slice(headerIdx).filter(l => l.trim().length > 0);

  // (debug)
  console.log('[CLEAN][PREVIEW_HEADER]', useful[0]);

  return Buffer.from(useful.join('\n'), 'utf8');
}
