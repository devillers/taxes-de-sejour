"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [stats, setStats] = useState({
    ownersCount: 0,
    accommodationsCount: 0,
    totalTaxes: 0
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  return (
    <main className="min-h-screen max-w-3xl mx-auto flex flex-col justify-center">

   
      <h1 className="text-3xl font-thin mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-thin mb-2">Propriétaires</h2>
          <p className="text-5xl font-light text-[#bd9254]">
            {stats.ownersCount}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-thin mb-2">Logements</h2>
          <p className="text-5xl font-light text-[#bd9254]">
            {stats.accommodationsCount}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-thin mb-2">Total Taxe de séjour</h2>
          <p className="text-5xl font-light text-[#bd9254]">
            {Number(stats.totalTaxes).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </div>
    </main>
  );
}
