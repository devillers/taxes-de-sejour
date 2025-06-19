import { NextResponse } from 'next/server';
import Owner from '../../models/owners';
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';
import { connectDb } from '../../lib/db'; // ✅ nouvelle import

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  await connectDb(); // ✅ appelée dans la requête

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const rows = await parseCsvBuffer(buffer, (row) => {
    if (!row["Id Propriétaires"] || !row["Nom"]) return null;

    return {
      id: row["Id Propriétaires"],
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
  });

  let imported = 0;

  for (const ownerData of rows) {
    await Owner.updateOne(
      { id: ownerData.id },
      { $set: ownerData },
      { upsert: true }
    );
    imported++;
  }

  return NextResponse.json({ message: `${imported} propriétaires importés ou mis à jour.` });
}
