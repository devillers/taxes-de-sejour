//app/api/upload-owners/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Owner from '../../models/owners';
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  console.log('[API][owners] POST appelé');
  try {
    await connectDb();
    console.log('[API][owners] DB connectée');

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[API][owners] buffer length:', buffer.length);

    // NE PAS NETTOYER, on laisse parseCsvBuffer gérer
    const rows = await parseCsvBuffer(
      buffer,
      row => {
        const id = row['Id Propriétaires']?.trim();
        if (!id) return null;
        return {
          ownerId: id,
          prenom: row['Prénom']?.trim() || '',
          nom: row['Nom']?.trim() || '',
          adresse: row['Adresse']?.trim() || '',
          codePostal: row['Code postal']?.trim() || '',
          ville: row['Ville']?.trim() || '',
          pays: row['Pays']?.trim() || '',
          email: row['E-mail']?.trim() || '',
          telephone: row['Téléphone']?.trim() || '',
          siret: row['SIRET']?.trim() || '',
          emailIntranet: row['Email Intranet']?.trim() || '',
        };
      },
      'auto', // <-- autodetecte séparateur (',' ou ';')
      ['Id Propriétaires'] // <-- détecte la bonne ligne de header
    );

    if (rows[0]) console.log('[API][owners] Première ligne parsée:', rows[0]);
    console.log('[API][owners] lignes valides :', rows.length);

    let count = 0;
    for (const data of rows) {
      await Owner.updateOne(
        { ownerId: data.ownerId },
        { $set: data },
        { upsert: true }
      );
      count++;
    }

    return NextResponse.json({ message: `${count} propriétaires importés ou mis à jour.` });
  } catch (e) {
    console.error('[API][owners] Erreur:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
