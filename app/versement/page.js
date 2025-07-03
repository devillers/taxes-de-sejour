// app/versement/page.js
export const dynamic = 'force-dynamic';

import VersementByLocalite from './VersementByLocalite';
import { connectDb } from '../lib/db';
import Accommodation from '../models/accomodations';

export default async function VersementPage() {
  await connectDb();

  // Récupère tous les logements avec leur owner
  const accommodations = await Accommodation
    .find()
    .populate('owner')
    .lean();

  // Construit les lignes à afficher
  const rows = accommodations
    .filter((a) => a.etat?.startsWith('Activé'))
    .map((a) => ({
      ownerId: a.owner?.id || '',
      nomProprietaire:
        a.nomProprietaire ||
        `${a.owner?.prenom || ''} ${a.owner?.nom || ''}`.trim(),
      logement: a.logement,
      adresse: [a.numero, a.adresse].filter(Boolean).join(' '),
      localite: a.localite,
      codePostal: a.codePostal,
      numeroRegistreTouristique: a.numeroRegistreTouristique || '',
      classement: a.numeroRegistreTouristique ? 'Classé' : 'Non classé',
      prixNuitee: a.prixNuitee,
      sejourDebut: a.sejourDebut ? a.sejourDebut.toISOString() : null,
      sejourDuree: a.sejourDuree,
      nbPersonnes: a.nbPersonnes,
      nbNuitees: a.nbNuitees,
      tarifUnitaireTaxe: a.tarifUnitaireTaxe,
      montantTaxe: a.montantTaxe,
    }));

  const localites = [...new Set(rows.map(r => r.localite).filter(Boolean))];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Taxe de séjour à reverser par commune </h1>
      {rows.length > 0 ? (
        <VersementByLocalite rows={rows} localites={localites} />
      ) : (
        <p className="text-gray-600">Aucun logement activé à reverser.</p>
      )}
    </div>
  );
}
