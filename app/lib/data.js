/* app/lib/data.js */
import fs from 'fs';
import path from 'path';

// Utility to read raw CSV content
const readCsv = (filename) =>
  fs.readFileSync(path.join(process.cwd(), `data/${filename}`), 'utf-8');

// Count records by skipping title and header lines
const countRecords = (csvContent) => {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length <= 2) return 0;
  return lines.slice(2).filter(line => line.trim() !== '').length;
};

// Sum the tax amounts by looking up the 'montant' column dynamically
const sumTaxes = (csvContent) => {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length <= 2) return 0;

  // Determine header columns from second line
  const headerParts = lines[1].split(';').map(h => h.trim().toLowerCase());
  const montantIdx = headerParts.indexOf('montant');
  if (montantIdx === -1) {
    console.warn('Colonne "montant" non trouvée dans le CSV de taxes');
    return 0;
  }

  // Sum values from that column in each data row
  return lines.slice(2)
    .map(line => {
      const parts = line.split(';');
      const raw = parts[montantIdx] || '';
      const val = raw.replace(/\s/g, '').replace(',', '.');
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    })
    .reduce((sum, cur) => sum + cur, 0);
};

export function getStats() {
  const ownersCsv = readCsv('owners.csv');
  const accommodationsCsv = readCsv('properties.csv');
  const taxesCsv = readCsv('taxes.csv');

  const ownersCount = countRecords(ownersCsv);
  const accommodationsCount = countRecords(accommodationsCsv);
  const totalTaxes = sumTaxes(taxesCsv);

  return { ownersCount, accommodationsCount, totalTaxes };
}