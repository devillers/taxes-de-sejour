import TableTaxes from './TableTaxes';

export default function TaxesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-6">Ensemble des taxes collectées </h1>
      <TableTaxes />
    </main>
  );
}
