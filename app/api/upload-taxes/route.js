
// app/api/upload-taxes/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Tax from '../../models/taxes';  // <- attention au nom du modèle (singulier !)
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
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[API][taxes] buffer length:', buffer.length);

    let firstHeaderKeys = [];
    const rows = await parseCsvBuffer(buffer, row => {
      if (!firstHeaderKeys.length) {
        firstHeaderKeys = Object.keys(row);
        console.log('[API][taxes] Colonnes détectées (première ligne):', firstHeaderKeys);
      }
      // Vérifie juste l’ID unique
      if (!row['Réservation']) return null;
      return {
        reservationId: row['Réservation'],
        nom:           row['Nom'],
        logement:      row['Logement'],
        montant:       parseFloat((row['Montant'] || '0').replace(',', '.')),
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
   }, ';', ['Réservation']);

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
