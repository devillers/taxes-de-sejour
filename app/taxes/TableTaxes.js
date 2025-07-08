'use client';

import { useEffect, useState } from 'react';

export default function TableTaxes() {
  const [taxes, setTaxes] = useState([]);
  const [search, setSearch] = useState(""); // état pour la recherche

  useEffect(() => {
    fetch('/api/taxes')
      .then(res => res.json())
      .then(setTaxes)
      .catch(console.error);
  }, []);

  // Filtrage par nom de logement
  const filteredTaxes = taxes.filter(
    (tax) =>
      tax.logement &&
      tax.logement.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      {/* Champ de recherche */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="search-logement" className="text-sm text-gray-700">Rechercher un logement :</label>
        <input
          id="search-logement"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nom du logement"
          className="border px-3 py-2 rounded-xl shadow text-sm outline-[#bd9254] focus:ring-2 focus:ring-[#bd9254] transition"
        />
      </div>

      <div className="rounded-3xl shadow-xl bg-white overflow-x-auto border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-3 font-light text-left text-gray-700">#</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">ID Réservation</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Nom</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Logement</th>
           
              <th className="px-2 py-3 font-light text-left text-gray-700">Propriétaire</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Arrivée</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Départ</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Nuits</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Adultes</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Enfants</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">Bébés</th>
                 <th className="px-2 py-3 font-light text-left text-gray-700">Montant</th>
            </tr>
          </thead>
          <tbody>
            {filteredTaxes.map((tax, i) => (
              <tr
                key={tax._id}
                className={
                  "transition-all group hover:bg-indigo-50/60 " +
                  (i % 2 === 0 ? "bg-white" : "bg-gray-50")
                }
              >
                <td className="px-2 py-2 font-mono text-[10px] text-gray-500">{i + 1}</td>
                <td className="px-2 text-xs py-2">{tax.reservationId}</td>
                <td className="px-2 text-xs py-2">{tax.nom}</td>
                <td className="px-2 text-xs py-2">{tax.logement}</td>
              
                <td className="px-2 text-xs py-2">{tax.proprietaire}</td>
                <td className="px-2 text-xs py-2">{tax.dateArrivee}</td>
                <td className="px-2 text-xs py-2">{tax.dateDepart}</td>
                <td className="px-2 text-xs py-2">{tax.nuits}</td>
                <td className="px-2 text-xs py-2">{tax.adultes}</td>
                <td className="px-2 text-xs py-2">{tax.enfants}</td>
                <td className="px-2 text-xs py-2">{tax.bebes}</td>
                  <td className="px-2 text-xs py-2">{typeof tax.montant === "number" ? tax.montant.toFixed(2) : tax.montant}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTaxes.length === 0 && (
          <div className="py-8 text-center text-gray-400">Aucune taxe enregistrée pour ce logement.</div>
        )}
      </div>
    </div>
  );
}
