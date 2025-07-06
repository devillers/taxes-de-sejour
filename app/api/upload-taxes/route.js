// app/api/upload-taxes/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Tax from '../../models/taxes';
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    await connectDb();
    console.log('[API] DB connected (taxes)');

    const formData = await req.formData();
    const file = formData.get('file');
    const delimiter = formData.get('delimiter') || ';';

    if (!file) {
      console.log('[API] No file uploaded (taxes)');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rows = await parseCsvBuffer(
      buffer,
      (row) => {
        if (!row['Hébergement ID'] || !row['Montant']) return null;
        return {
          hebergementId: row['Hébergement ID'],
          montant: parseFloat(row['Montant'].replace(',', '.')),
          datePerception: row['Date de la perception'],
          debutSejour: row['Début séjour'],
          nbrePersonnes: row['Nombre de personnes'],
          nbreNuitees: row['Nombre de nuitées'],
          tarifUnitaire: parseFloat(row['Tarif unitaire'].replace(',', '.')),
        };
      },
      delimiter
    );

    const validRows = rows.filter(Boolean);
    console.log(`[API] ${validRows.length} lignes de taxes parsées`);

    let imported = 0;
    for (const taxData of validRows) {
      await Tax.updateOne(
        { hebergementId: taxData.hebergementId, debutSejour: taxData.debutSejour },
        { $set: taxData },
        { upsert: true }
      );
      imported++;
    }

    console.log(`[API] FIN : ${imported} taxes importées ou mises à jour.`);
    return NextResponse.json({ message: `${imported} taxes importées ou mises à jour.` });
  } catch (err) {
    console.error('❌ Erreur dans /api/upload-taxes :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}