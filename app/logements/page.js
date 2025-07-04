// app/logements/page.js

export const dynamic = 'force-dynamic';

import { connectDb } from '../lib/db';
import Accommodation from '../models/accomodations';
import LogementManager from './LogementManager';

export default async function LogementsPage() {
<<<<<<< HEAD
  // 1) Connect to database
  await connectDb();

  // 2) Fetch raw accommodations (owner stored as numeric ID)
  const raw = await Accommodation.find().lean();

  // 3) Normalize for client (convert ObjectId and Dates to plain values)
  const accommodations = raw.map(doc => {
    const { _id, owner, createdAt, updatedAt, sejourDebut, sejourDuree, nbPersonnes, nbNuitees, tarifUnitaireTaxe, montantTaxe, prixNuitee, nomProprietaire, logement, adresse, localite, codePostal, numeroRegistreTouristique } = doc;
    return {
      _id: _id.toString(),
      ownerId: typeof owner === 'string' || typeof owner === 'number' ? owner : owner.toString(),
      nomProprietaire: nomProprietaire || '',
      logement: logement || '',
      adresse: adresse || '',
      localite: localite || '',
      codePostal: codePostal || '',
      numeroRegistreTouristique: numeroRegistreTouristique || '',
      classement: numeroRegistreTouristique ? 'Classé' : 'Non classé',
      prixNuitee: prixNuitee ?? null,
      sejourDebut: sejourDebut ? new Date(sejourDebut).toISOString() : null,
      sejourDuree: sejourDuree ?? null,
      nbPersonnes: nbPersonnes ?? null,
      nbNuitees: nbNuitees ?? null,
      tarifUnitaireTaxe: tarifUnitaireTaxe ?? null,
      montantTaxe: montantTaxe ?? null,
      createdAt: new Date(createdAt).toISOString(),
      updatedAt: new Date(updatedAt).toISOString(),
    };
  });
=======
  try {
    // 1) Ensure DB is connected
    await connectDb();

    // 2) Fetch as plain JS objects
    const raw = await Accommodation.find()
      .populate('owner')
      .lean();

    // 3) Convert ObjectIds and Dates into strings/ISO formats
    const accommodations = raw.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
      localite: doc.localite,
      ownerId: doc.owner ? doc.owner.id : null,
      owner: doc.owner
        ? {
            ...doc.owner,
            _id: doc.owner._id.toString(),
            createdAt: doc.owner.createdAt.toISOString(),
            updatedAt: doc.owner.updatedAt.toISOString(),
          }
        : null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
>>>>>>> 46fb1caaee79111565319f70a81b12be09983fd4

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Gestion des logements</h1>
        {/* Now safe to pass only plain JS objects */}
        <LogementManager initialAccommodations={accommodations} />
      </div>
    );
  } catch (err) {
    console.error('[logements] Error fetching accommodations:', err);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Gestion des logements</h1>
        <p className="text-red-600">Impossible de récupérer les logements.</p>
      </div>
    );
  }
}
