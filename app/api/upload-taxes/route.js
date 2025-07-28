// app/api/upload-taxes/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Tax from '../../models/taxes'; // <- attention au nom du modèle (singulier !)
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

export async function POST(req) {
  console.log('[API][taxes] POST appelé');
  try {
    await connectDb();
    console.log('[API][taxes] DB connectée');

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      console.warn('[API][taxes] Aucun fichier reçu');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }

    // -------- CLEAN CSV --------
    let buffer = Buffer.from(await file.arrayBuffer());
    let csvStr = buffer.toString('utf-8');
    let lines = csvStr.replace(/^\uFEFF/, '').split(/\r?\n/);

    // Cherche la première ligne qui COMMENCE par "Réservation;"
    const headerIdx = lines.findIndex(l =>
      l.trim().startsWith('Réservation;')
    );

    if (headerIdx < 0) {
      console.warn('[API][taxes] Aucun header "Réservation;" détecté dans le CSV');
      return NextResponse.json({ error: 'CSV invalide ou header manquant' }, { status: 400 });
    }

    csvStr = lines.slice(headerIdx).join('\n');
    buffer = Buffer.from(csvStr, 'utf-8');

    console.log('--- HEADER UTILISÉ ---');
    console.log(lines[headerIdx]);
    console.log('----------------------');
    console.log(csvStr.split('\n').slice(0, 3).join('\n')); // affiche les 3 premières lignes pour debug

    // -------- PARSING --------
    let firstHeaderKeys = [];
    const rows = await parseCsvBuffer(
      buffer,
      row => {
        if (!firstHeaderKeys.length) {
          firstHeaderKeys = Object.keys(row);
          console.log('[API][taxes] Colonnes détectées (première ligne):', firstHeaderKeys);
        }
        if (!row['Réservation']) return null;
        return {
          reservationId: row['Réservation'],
          nom:           row['Nom'],
          logement:      row['Logement'],
          montant:       parseFloat((row['Montant'] || '0').replace(',', '.')),
          prixNuitee:    parseFloat((row['Prix / nuit'] || row['Prix Nuitée'] || row['Tarif unitaire'] || '0').replace(',', '.')),
          datePaiement:  row['Date de paiement'],
          proprietaire:  row['Propriétaire'],
          dateArrivee:   row["Date d'arrivée"],
          dateDepart:    row["Date de sortie"],
          nuits:         parseInt(row['Nuits'] || '0', 10),
          adultes:       parseInt(row['Adultes'] || '0', 10),
          enfants:       parseInt(row['Enfants'] || '0', 10),
          bebes:         parseInt(row['Bébés'] || '0', 10),
          typeReservation: row['Type de réservation'],
          // Ajoute d'autres champs utiles si besoin
        };
      },
      ';',
      ['Réservation']
    );

    if (rows[0]) {
      console.log('[API][taxes] Première ligne parsée:', rows[0]);
    }
    console.log('[API][taxes] Lignes valides parsées:', rows.length);

    let count = 0;
    for (const data of rows) {
      await Tax.updateOne(
        { reservationId: data.reservationId },
        { $set: data },
        { upsert: true }
      );
      count++;
    }
    console.log('[API][taxes] Import terminé:', count);
    return NextResponse.json({ message: `${count} taxes importées ou mises à jour.` });

  } catch (e) {
    console.error('[API][taxes] Erreur:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
