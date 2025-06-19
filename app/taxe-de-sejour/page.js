import Dropbox from '../../components/CSVUploader'

export default function TaxeDeSejour() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Taxe de séjour</h1>
      <p>Déposer votre fichier taxe de séjour au format CSV</p>

      <Dropbox />
    </div>
  );
}
