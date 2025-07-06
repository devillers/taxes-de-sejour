// app/api/upload-owners/route.js

// app/api/upload-owners/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Owner from '../../models/owners';
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

// --- Helper pour nettoyer le buffer CSV avant le parsing
function cleanCsvBuffer(buffer, headerKey = 'Id Propriétaires', sep = ';') {
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);
  let headerIdx = lines.findIndex(line =>
    line.replace(/"/g, '').includes(headerKey)
  );
  if (headerIdx === -1) headerIdx = 0;
  // Supprime les lignes vides
  const useful = lines.slice(headerIdx).filter(l => l.trim().length > 0);
  return Buffer.from(useful.join('\n'), 'utf8');
}

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  console.log('[API][owners] POST appelé');
  try {
    await connectDb();
    console.log('[API][owners] DB connectée');
    const formData = await req.formData();
    const delimiter = formData.get("delimiter") || ";"
    const file = formData.get('file');
    if (!file) {
      console.warn('[API][owners] Aucun fichier reçu');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // Nettoyage du CSV (header & lignes vides)
    const cleanedBuffer = cleanCsvBuffer(buffer, 'Id Propriétaires', ';');

    // Pour debug : affiche début du CSV “nettoyé”
    console.log('[DEBUG CSV Owners clean début]:', cleanedBuffer.toString('utf8').slice(0, 500));

    let firstHeaderKeys = [];
    const rows = await parseCsvBuffer(cleanedBuffer, row => {
      if (!firstHeaderKeys.length) {
        firstHeaderKeys = Object.keys(row);
        console.log('[API][owners] 🔎 Colonnes détectées (première ligne):', firstHeaderKeys);
      }
      if (!row['Id Propriétaires'] || !row['Id Propriétaires'].trim()) return null;
      return {
        ownerId:    row['Id Propriétaires']?.trim(),
        prenom:     row['Prénom']?.trim() || '',
        nom:        row['Nom']?.trim() || '',
        adresse:    row['Adresse']?.trim() || '',
        codePostal: row['Code postal']?.trim() || '',
        ville:      row['Ville']?.trim() || '',
        email:      row['E-mail']?.trim() || '',
        telephone:  row['Téléphone']?.trim() || '',
        siret:      row['SIRET']?.trim() || '',
        mandat:     row['Mandat']?.trim() || ''
      };
    }, ';');

    if (rows[0]) {
      console.log('[API][owners] Première ligne parsée:', rows[0]);
    }
    console.log('[API][owners] Lignes valides:', rows.length);

    let count = 0;
    for (const data of rows) {
      await Owner.updateOne(
        { ownerId: data.ownerId },
        { $set: data },
        { upsert: true }
      );
      count++;
    }
    console.log('[API][owners] Import terminé, total:', count);
    return NextResponse.json({ message: `${count} propriétaires importés ou mis à jour.` });
  } catch (e) {
    console.error('[API][owners] Erreur:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
