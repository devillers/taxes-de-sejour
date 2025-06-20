export const dynamic = 'force-dynamic';

import { connectDb } from '@/lib/db';
import Accommodation from '@/models/accomodations';
import VersementTable from './VersementTable';

export default async function VersementPage() {
  await connectDb();
  const accommodations = await Accommodation.find().populate('owner').lean();

  const rows = accommodations
    .filter((a) => a.etat && a.etat.startsWith('Activé'))
    .map((a) => ({
      ownerId: a.owner?.id || '',
      nomProprietaire: a.nomProprietaire || `${a.owner?.prenom || ''} ${a.owner?.nom || ''}`.trim(),
      logement: a.logement,
      adresse: [a.numero, a.adresse].filter(Boolean).join(' '),
      codePostal: a.codePostal,
      numeroRegistreTouristique: a.numeroRegistreTouristique || '',
      classement: a.numeroRegistreTouristique ? 'Classé' : 'Non classé',
    }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Logements à reverser</h1>
      <VersementTable rows={rows} />
    </div>
  );
}
