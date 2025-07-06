// app/api/upload-accommodations/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Property from '../../models/properties';
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

export const config = { api: { bodyParser: false } };

// Ajout d’un GET pour tester la route
export async function GET() {
  console.log('[API] GET /api/upload-accommodations appelée');
  return NextResponse.json({ message: 'Endpoint upload-accommodations OK' });
}

export async function POST(req) {
  console.log('[API] POST /api/upload-accommodations appelée');
  try {
    await connectDb();
    console.log('[API] DB connectée (accommodations)');

    const formData = await req.formData();
    console.log('[API] formData reçue, clés :', Array.from(formData.keys()));

    const file = formData.get('file');
    const delimiter = formData.get('delimiter') || ';';
    console.log(`[API] Delimiter : "${delimiter}"`);

    if (!file) {
      console.warn('[API] Aucun fichier dans formData');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[API] Taille du buffer :', buffer.length);

    const rows = await parseCsvBuffer(buffer, row => {
      // vérifier présence des champs essentiels
      if (!row['Id Propriétaires'] || !row['Logement']) {
        console.warn('[API] Lignes ignorée (champs manquants) :', row);
        return null;
      }
      return {
        ownerId:                row['Id Propriétaires'],
        code:                   row['Code'],
        etat:                   row['État'],
        logement:               row['Logement'],
        type:                   row['Type'],
        capacite:               parseInt(row['Capacité totale'] || '0', 10),
        tarif:                  row['Tarif'],
        edifice:                row['Édifice'],
        galerie:                row['Regrouper par Galerie Photos'],
        localite:               row['Localité'],
        quartier:               row['Quartier'],
        codePostal:             row['Code postal'],
        typeVoie:               row['Type de voie'],
        adresse:                row['Adresse'],
        numero:                 row['Numéro'],
        escalier:               row['Escalier'],
        etage:                  row['Étage'],
        porte:                  row['Porte'],
        proprietaire:           row['Propriétaire'],
        registreTouristique:    row['Numéro de registre touristique'],
        commentaires:           row['Commentaires additionnels'],
        referenceCadastrale:    row['Référence cadastrale'],
      };
    }, delimiter);

    const validRows = rows.filter(Boolean);
    console.log(`[API] ${validRows.length} lignes valides parsées`);

    let count = 0;
    for (const data of validRows) {
      console.log('[API] Upsert propriété :', data.ownerId, data.logement);
      await Property.updateOne(
        { ownerId: data.ownerId, logement: data.logement },
        { $set: data },
        { upsert: true }
      );
      count++;
    }

    console.log(`[API] Import terminé : ${count} enregistrements`);
    return NextResponse.json({ message: `${count} propriétés importées/mises à jour.` });

  } catch (e) {
    console.error('[API] Erreur inattendue :', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
  