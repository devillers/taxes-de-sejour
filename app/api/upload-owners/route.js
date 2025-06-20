// app/api/upload-owners/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Owner from '../../models/owners';
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    await connectDb();
    console.log('[API] DB connected');

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('[API] No file uploaded');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ⚠️ Vérifie si ton CSV est séparé par des virgules (,) ou des points-virgules (;)
    // Par défaut, Excel FR exporte avec des ;
    const rows = await parseCsvBuffer(
      buffer,
      (row) => {
        if (!row["Id Propriétaires"] || !row["Nom"]) return null;

        return {
          id: row["Id Propriétaires"],         // 🟢 Le champ utilisé pour l'upsert (doit exister dans le modèle Owner)
          prenom: row["Prénom"],
          nom: row["Nom"],
          adresse: row["Adresse"],
          codePostal: row["Code postal"],
          ville: row["Ville"],
          email: row["E-mail"],
          telephone: row["Téléphone"],
          siret: row["SIRET"],
          mandat: row["Mandat"],
        };
      },
      ',' // ← Mets ';' si Excel/LibreOffice, sinon ',' pour CSV US/Google Sheets
    );

    // Filtrer les éventuelles lignes nulles
    const validRows = rows.filter(Boolean);
    console.log(`[API] ${validRows.length} propriétaires parsés, exemple:`, validRows[0]);

    let imported = 0;

    for (const ownerData of validRows) {
      // log ownerData pour debug si souci
      console.log('[API] Upsert owner:', ownerData);

      await Owner.updateOne(
        { id: ownerData.id },
        { $set: ownerData },
        { upsert: true }
      );
      imported++;
    }

    console.log(`[API] FIN : ${imported} propriétaires importés ou mis à jour.`);
    return NextResponse.json({ message: `${imported} propriétaires importés ou mis à jour.` });

  } catch (err) {
    console.error('❌ Erreur dans /api/upload-owners :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
