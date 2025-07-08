import TableTaxes from './TableTaxes';

export default function TaxesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau des Taxes de Séjour</h1>
      <TableTaxes />
    </main>
  );
}
