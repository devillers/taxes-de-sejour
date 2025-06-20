// app/lib/parseCsvBuffer.js
import { parse } from 'csv-parse';
import { Readable } from 'stream';

/**
 * Parse un buffer CSV et le mappe avec une fonction.
 * @param {Buffer} buffer - Le contenu du fichier CSV
 * @param {Function} mapRow - Fonction de mapping ligne → objet
 * @param {String} [delimiter=';'] - Délimiteur CSV (par défaut `;`)
 * @returns {Promise<Array<Object>>}
 */
export async function parseCsvBuffer(
  buffer,
  mapRow,
  delimiter = ';'         // ← point-virgule par défaut
) {
  const rows = [];
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter,
    relax_column_count: true,
    skip_records_with_error: true,
    from_line: 3,           // ← Commence à la 3e ligne (header CSV correct)
  });

  const stream = Readable.from(buffer).pipe(parser);
  for await (const row of stream) {
    const mapped = mapRow(row);
    if (mapped) rows.push(mapped);
  }
  return rows;
}
