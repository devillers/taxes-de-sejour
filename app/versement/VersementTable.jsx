'use client';
import { useState, useMemo } from 'react';

export default function VersementTable({ rows }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return rows.filter(r =>
      r.nomProprietaire.toLowerCase().includes(term) ||
      r.logement.toLowerCase().includes(term) ||
      r.adresse.toLowerCase().includes(term)
    );
  }, [rows, search]);

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border px-2 py-1 mb-4"
      />
      <p className="mb-4">Nombre de logements: {filtered.length}</p>
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
          {filtered.map((r, idx) => (
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
