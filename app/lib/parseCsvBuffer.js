// app/lib/parseCsvBuffer.js
import { parse } from 'csv-parse';
import { Readable } from 'stream';

export async function parseCsvBuffer(buffer, mapRow, delimiter = ';', headerKeywords = []) {
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);

  // ➜ Ignore les lignes vides et celles qui ne contiennent pas un des keywords (même entre guillemets)
  let headerLineIdx = 0;
  if (headerKeywords.length) {
    headerLineIdx = lines.findIndex(l =>
      headerKeywords.some(key =>
        l.replace(/"/g, '').includes(key)
      )
    );
    if (headerLineIdx === -1) headerLineIdx = 0;
  }

  // Skip avant header
  const cleanBuffer = Buffer.from(lines.slice(headerLineIdx).join('\n'), 'utf-8');
  // (option) Log la ligne détectée :
  // console.log('[DEBUG][parseCsvBuffer] Header ligne détectée:', lines[headerLineIdx]);

  const rows = [];
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax: true,
    relax_quotes: true,
    skip_records_with_error: true,
    bom: true,
    delimiter,
  });

  const stream = Readable.from(cleanBuffer).pipe(parser);
  for await (const row of stream) {
    const mapped = mapRow(row);
    if (mapped) rows.push(mapped);
  }
  return rows;
}
