// app/api/upload-properties/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Property from '../../models/properties'; // <-- correction ici
import { parseCsvBuffer } from '../../lib/parseCsvBuffer';

export async function POST(req) {
  console.log('[API][properties] POST appelé');
  try {
    await connectDb();
    console.log('[API][properties] DB connectée');

    const formData = await req.formData();
    const file = formData.get('file');
    const delimiter = formData.get('delimiter') || ';';
    if (!file) {
      console.warn('[API][properties] Aucun fichier dans formData');
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[API][properties] buffer length:', buffer.length);

    // Log des colonnes de la première ligne
    let firstHeaderKeys = [];
    const rows = await parseCsvBuffer(buffer, row => {
      if (!firstHeaderKeys.length) {
        firstHeaderKeys = Object.keys(row);
        console.log('[API][properties] Colonnes détectées (première ligne):', firstHeaderKeys);
      }
      if (!row['Id Propriétaires'] || !row['Logement']) return null;
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
  }, ';', ['Id Propriétaires']);

    if (rows[0]) {
      console.log('[API][properties] Première ligne parsée:', rows[0]);
    }
    console.log(`[API][properties] ${rows.length} lignes valides parsées`);

    let count = 0;
    for (const data of rows) {
      await Property.updateOne(
        { ownerId: data.ownerId, logement: data.logement },
        { $set: data },
        { upsert: true }
      );
      count++;
    }
    console.log(`[API][properties] Import terminé : ${count} enregistrements`);
    return NextResponse.json({ message: `${count} propriétés importées/mises à jour.` });

  } catch (e) {
    console.error('[API][properties] Erreur inattendue :', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}