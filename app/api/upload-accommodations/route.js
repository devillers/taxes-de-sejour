import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Accommodation from '@/models/accommodation';
import Owner from '@/models/owners';
import { parseCsvBuffer } from '@/lib/parseCsvBuffer';

await mongoose.connect(process.env.MONGODB_URI);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const rows = await parseCsvBuffer(buffer, (row) => {
    if (!row["Id Propriétaires"] || !row["Code"]) return null;
    return row;
  });

  let imported = 0;

  for (const row of rows) {
    // Cherche le propriétaire par ID (string)
    const owner = await Owner.findOne({ id: row["Id Propriétaires"] });

    if (!owner) continue; // pas de correspondance, on ignore

    const data = {
      owner: owner._id,
      code: row["Code"],
      etat: row["État"],
      logement: row["Logement"],
      type: row["Type"],
      capaciteTotale: parseInt(row["Capacité totale"]) || 0,
      tarif: row["Tarif"],
      edifice: row["Édifice"],
      regrouperParGalerie: row["Regrouper par Galerie Photos"],
      localite: row["Localité"],
      quartier: row["Quartier"],
      codePostal: row["Code postal"],
      typeVoie: row["Type de voie"],
      adresse: row["Adresse"],
      numero: row["Numéro"],
      escalier: row["Escalier"],
      etage: row["Étage"],
      porte: row["Porte"],
      nomProprietaire: row["Propriétaire"],
      numeroRegistreTouristique: row["Numéro de registre touristique"],
      commentairesAdditionnels: row["Commentaires additionnels"],
      referenceCadastrale: row["Référence cadastrale"],
    };

    // Upsert par combinaison propriétaire + code logement
    await Accommodation.updateOne(
      { code: data.code, owner: owner._id },
      { $set: data },
      { upsert: true }
    );

    imported++;
  }

  return NextResponse.json({ message: `${imported} logements importés ou mis à jour.` });
}
