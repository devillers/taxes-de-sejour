export const dynamic = 'force-dynamic';

import { connectDb } from '../lib/db';
import Accommodation from '../models/accomodations';

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

  const rowCount = rows.length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Logements à reverser</h1>
      <p className="mb-4">Nombre de logements: {rowCount}</p>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">N°</th>
            <th className="border px-2 py-1">ownerId</th>
            <th className="border px-2 py-1">Nom propriétaire</th>
            <th className="border px-2 py-1">Logement</th>
            <th className="border px-2 py-1">Adresse</th>
            <th className="border px-2 py-1">Code postal</th>
            <th className="border px-2 py-1">N° registre touristique</th>
            <th className="border px-2 py-1">Classement</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="border-t">
              <td className="border px-2 py-1 text-center">{idx + 1}</td>
              <td className="border px-2 py-1">{r.ownerId}</td>
              <td className="border px-2 py-1">{r.nomProprietaire}</td>
              <td className="border px-2 py-1">{r.logement}</td>
              <td className="border px-2 py-1">{r.adresse}</td>
              <td className="border px-2 py-1">{r.codePostal}</td>
              <td className="border px-2 py-1">{r.numeroRegistreTouristique}</td>
              <td className="border px-2 py-1">{r.classement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
