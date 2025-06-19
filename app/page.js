// app/page.js

export const dynamic = 'force-dynamic'; // pour s'assurer du rendu à chaque requête

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return { ownerCount: '-', accommodationCount: '-' };
  }

  return res.json();
}

export default async function Home() {
  const { ownerCount, accommodationCount } = await getStats();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur Taxes de séjour</h1>
      <p>Utilisez le menu pour accéder au calcul de la taxe de séjour.</p>

      <div className="mt-6">
        <p className="text-lg">👤 Propriétaires enregistrés : <strong>{ownerCount}</strong></p>
        <p className="text-lg">🏠 Logements enregistrés : <strong>{accommodationCount}</strong></p>
      </div>
    </div>
  );
}
