import { parse } from 'csv-parse';
import { Readable } from 'stream';

/**
 * Parse un buffer CSV et le mappe avec une fonction.
 * @param {Buffer} buffer - Le contenu du fichier CSV
 * @param {Function} mapRow - Fonction de mapping ligne → objet
 * @param {String} delimiter - Par défaut `;` pour les fichiers FR
 * @returns {Promise<Array<Object>>}
 */
export async function parseCsvBuffer(buffer, mapRow, delimiter = ';') {
  const rows = [];

  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter,
  });

  const stream = Readable.from(buffer).pipe(parser);

  for await (const row of stream) {
    const mapped = mapRow(row);
    if (mapped) rows.push(mapped);
  }

  return rows;
}
