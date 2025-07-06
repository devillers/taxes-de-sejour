/* app/page.jsx */
import React from 'react';
import { getStats } from './lib/data';

export default function HomePage() {
  const { ownersCount, accommodationsCount, totalTaxes } = getStats();

  return (
    <main className="min-h-screen  p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-light mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-thin mb-2">Propriétaires</h2>
          <p className="text-5xl font-light text-indigo-600">{ownersCount}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-thin mb-2">Logements</h2>
          <p className="text-5xl font-light text-indigo-600">{accommodationsCount}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-thin mb-2">Total Taxe de séjour</h2>
          <p className="text-5xl font-light text-indigo-600">{totalTaxes.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
        </div>
      </div>
    </main>
  );
}