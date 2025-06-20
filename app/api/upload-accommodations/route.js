// app/api/upload-accommodations/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Accommodation from '../../models/accommodations';
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
    console.log('[API] Connexion DB OK');

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('[API] Aucun fichier reçu');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Lecture du CSV avec ; comme séparateur
    const rows = await parseCsvBuffer(
      buffer,
      (row) => {
        if (!row['Id Propriétaires'] || !row['Code']) return null;
        return {
          ownerId: row['Id Propriétaires'],
          code: row['Code'],
          etat: row['État'],
          logement: row['Logement'],
          type: row['Type'],
          capaciteTotale: parseInt(row['Capacité totale'], 10) || 0,
          tarif: row['Tarif'],
          edifice: row['Édifice'],
          regrouperParGalerie: row['Regrouper par Galerie Photos'],
          localite: row['Localité'],
          quartier: row['Quartier'],
          codePostal: row['Code postal'],
          typeVoie: row['Type de voie'],
          adresse: row['Adresse'],
          numero: row['Numéro'],
          escalier: row['Escalier'],
          etage: row['Étage'],
          porte: row['Porte'],
          nomProprietaire: row['Propriétaire'],
          numeroRegistreTouristique: row['Numéro de registre touristique'],
          commentairesAdditionnels: row['Commentaires additionnels'],
          referenceCadastrale: row['Référence cadastrale'],
        };
      },
      ';'
    );

    // Filtrer les lignes nulles
    const validRows = rows.filter(Boolean);

    console.log(`[API] ${validRows.length} lignes parsées depuis le CSV. Exemple:`, validRows[0]);

    let imported = 0;

    for (const data of validRows) {
      // Correction : on cherche l'owner avec le champ "id" (qui correspond à "Id Propriétaires" dans le CSV)
      const owner = await Owner.findOne({ id: data.ownerId });

      if (!owner) {
        console.log(`[API] ❌ Propriétaire NON TROUVÉ pour id:`, data.ownerId);
        continue;
      }

      // upsert du logement lié à ce propriétaire
      const result = await Accommodation.updateOne(
        { code: data.code, owner: owner._id },
        {
          $set: {
            owner: owner._id,
            etat: data.etat,
            logement: data.logement,
            type: data.type,
            capaciteTotale: data.capaciteTotale,
            tarif: data.tarif,
            edifice: data.edifice,
            regrouperParGalerie: data.regrouperParGalerie,
            localite: data.localite,
            quartier: data.quartier,
            codePostal: data.codePostal,
            typeVoie: data.typeVoie,
            adresse: data.adresse,
            numero: data.numero,
            escalier: data.escalier,
            etage: data.etage,
            porte: data.porte,
            nomProprietaire: data.nomProprietaire,
            numeroRegistreTouristique: data.numeroRegistreTouristique,
            commentairesAdditionnels: data.commentairesAdditionnels,
            referenceCadastrale: data.referenceCadastrale,
          }
        },
        { upsert: true }
      );

      console.log('[API] Résultat upsert:', result);
      imported++;
    }

    console.log(`[API] FIN : ${imported} logements importés ou mis à jour.`);
    return NextResponse.json({ message: `${imported} logements importés ou mis à jour.` });
  } catch (err) {
    console.error('❌ Erreur dans /api/upload-accommodations :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
