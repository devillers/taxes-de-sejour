// app/lib/parseCsvBuffer.js

import { parse } from 'csv-parse';
import { Readable } from 'stream';

function guessDelimiter(line) {
  const delimiters = [',', ';', '\t', '|'];
  let best = ',', bestCount = 0;
  delimiters.forEach(d => {
    const count = (line.match(new RegExp(`\\${d}`, 'g')) || []).length;
    if (count > bestCount) { best = d; bestCount = count; }
  });
  return best;
}

export async function parseCsvBuffer(buffer, mapRow, delimiter = 'auto', headerKeywords = []) {
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);

  // Cherche la vraie ligne de header (genre "Id Propriétaires")
  let headerLineIdx = 0;
  if (headerKeywords.length) {
    headerLineIdx = lines.findIndex(l =>
      headerKeywords.some(key => l.replace(/"/g, '').includes(key))
    );
    if (headerLineIdx === -1) headerLineIdx = 0;
  }
  let delim = delimiter;
  if (delimiter === 'auto' || !delimiter) {
    delim = guessDelimiter(lines[headerLineIdx]);
    console.log('[DEBUG][parseCsvBuffer] Delimiteur détecté:', delim);
  } else {
    console.log('[DEBUG][parseCsvBuffer] Delimiteur imposé:', delim);
  }

  const cleanBuffer = Buffer.from(lines.slice(headerLineIdx).join('\n'), 'utf-8');
  const rows = [];
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax: true,
    relax_quotes: true,
    bom: true,
    delimiter: delim,
  });

  const stream = Readable.from(cleanBuffer).pipe(parser);
  for await (const row of stream) {
    const mapped = mapRow(row);
    if (mapped) rows.push(mapped);
    else console.log('[DEBUG] Ligne ignorée:', row);
  }
  return rows;
}
