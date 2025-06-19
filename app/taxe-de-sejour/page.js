'use client';

import { useState } from 'react';
import CSVUploader from '@/components/CSVUploader';

export default function ImportPage() {
  const [ownerFile, setOwnerFile] = useState(null);
  const [accommodationFile, setAccommodationFile] = useState(null);
  const [ownerMessage, setOwnerMessage] = useState('');
  const [accommodationMessage, setAccommodationMessage] = useState('');

  const handleUpload = async (file, endpoint, setMessage) => {
    if (!file) {
      setMessage('Veuillez sélectionner un fichier CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      setMessage(json.message || json.error);
    } catch (err) {
      setMessage('Erreur lors de l’envoi du fichier.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Import de données – Taxes de séjour</h1>

      {/* Zone 1 : Import Propriétaires */}
      <div>
        <h2 className="text-xl font-semibold mb-2">1. Importer les propriétaires</h2>
        <CSVUploader onFileSelect={setOwnerFile} />
        <button
          onClick={() =>
            handleUpload(ownerFile, '/api/upload-owners', setOwnerMessage)
          }
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Importer les propriétaires
        </button>
        {ownerMessage && (
          <p className="mt-2 text-sm text-green-700">{ownerMessage}</p>
        )}
      </div>

      {/* Zone 2 : Import Logements */}
      <div>
        <h2 className="text-xl font-semibold mb-2">2. Importer les logements</h2>
        <CSVUploader onFileSelect={setAccommodationFile} />
        <button
          onClick={() =>
            handleUpload(accommodationFile, '/api/upload-accommodations', setAccommodationMessage)
          }
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Importer les logements
        </button>
        {accommodationMessage && (
          <p className="mt-2 text-sm text-blue-700">{accommodationMessage}</p>
        )}
      </div>
    </div>
  );
}
