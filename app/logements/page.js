// app/logements/page.js

export const dynamic = 'force-dynamic';

import { connectDb } from '../lib/db';
import Accommodation from '../models/properties';
import LogementManager from './LogementManager';

export default async function LogementsPage() {
  await connectDb();
  const raw = await Accommodation.find().lean();

  const accommodations = raw.map(doc => {
    // Owner field might be a BSON type; convert to primitive number or string
    let ownerId;
    if (doc.owner != null) {
      if (typeof doc.owner.valueOf === 'function') {
        ownerId = doc.owner.valueOf();
      } else {
        ownerId = doc.owner;
      }
    } else {
      ownerId = null;
    }

    return {
      _id: doc._id.toString(),
      ownerId,
      nomProprietaire: doc.nomProprietaire || '',
      logement: doc.logement || '',
      adresse: doc.adresse || '',
      localite: doc.localite || '',
      codePostal: doc.codePostal || '',
      numeroRegistreTouristique: doc.numeroRegistreTouristique || '',
      classement: doc.numeroRegistreTouristique ? 'Classé' : 'Non classé',
      prixNuitee: doc.prixNuitee ?? null,
      sejourDebut: doc.sejourDebut ? doc.sejourDebut.toISOString() : null,
      sejourDuree: doc.sejourDuree ?? null,
      nbPersonnes: doc.nbPersonnes ?? null,
      nbNuitees: doc.nbNuitees ?? null,
      tarifUnitaireTaxe: doc.tarifUnitaireTaxe ?? null,
      montantTaxe: doc.montantTaxe ?? null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des logements</h1>
      <LogementManager initialAccommodations={accommodations} />
    </div>
  );
}
