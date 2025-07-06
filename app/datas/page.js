// app/datas/page.js

'use client';

import { useState } from 'react';
import CSVUploader from '../../components/CSVUploader';

export default function ImportPage() {
  const [ownerFile, setOwnerFile] = useState(null);
  const [accomFile, setAccomFile] = useState(null);
  const [taxFile, setTaxFile] = useState(null);
  const [ownerMsg, setOwnerMsg] = useState('');
  const [accomMsg, setAccomMsg] = useState('');
  const [taxMsg, setTaxMsg] = useState('');

  const handleUpload = async (file, endpoint, setMsg) => {
    console.log(`[UI] handleUpload called for endpoint "${endpoint}"`);
    if (!file) {
      console.warn('[UI] Aucun fichier sélectionné');
      setMsg('Veuillez sélectionner un fichier CSV.');
      return;
    }
    console.log(`[UI] Fichier à uploader: name=${file.name}, size=${file.size} bytes`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('[UI] Lancement du fetch vers', endpoint);
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      console.log('[UI] Statut de la réponse:', res.status);
      const json = await res.json();
      console.log('[UI] Corps JSON reçu:', json);
      setMsg(json.message || json.error);
    } catch (err) {
      console.error('[UI] Erreur lors de l’envoi du fichier:', err);
      setMsg('Erreur lors de l’envoi du fichier.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Import de données – Taxes de séjour
      </h1>

      {/* 1. Propriétaires */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          1. Importer les propriétaires
        </h2>
        <CSVUploader
          id="owner-upload"
          fileName={ownerFile?.name}
          onFileSelect={(f) => { console.log('[UI] ownerFile sélectionné:', f); setOwnerFile(f); }}
        />
        <button
          onClick={() =>
            handleUpload(ownerFile, '/api/upload-owners', setOwnerMsg)
          }
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Importer les propriétaires
        </button>
        {ownerMsg && (
          <p className="mt-2 text-sm text-green-700">{ownerMsg}</p>
        )}
      </div>

      {/* 2. Logements */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          2. Importer les logements
        </h2>
        <CSVUploader
          id="accom-upload"
          fileName={accomFile?.name}
          onFileSelect={(f) => { console.log('[UI] accomFile sélectionné:', f); setAccomFile(f); }}
        />
        <button
          onClick={() =>
            handleUpload(accomFile, '/api/upload-propeprties', setAccomMsg)
          }
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Importer les logements
        </button>
        {accomMsg && (
          <p className="mt-2 text-sm text-blue-700">{accomMsg}</p>
        )}
      </div>

      {/* 3. Taxes de séjour */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          3. Importer la taxe de séjour
        </h2>
        <CSVUploader
          id="tax-upload"
          fileName={taxFile?.name}
          onFileSelect={(f) => { console.log('[UI] taxFile sélectionné:', f); setTaxFile(f); }}
        />
        <button
          onClick={() =>
            handleUpload(taxFile, '/api/upload-taxes', setTaxMsg)
          }
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Importer la taxe de séjour
        </button>
        {taxMsg && (
          <p className="mt-2 text-sm text-purple-700">{taxMsg}</p>
        )}
      </div>
    </div>
  );
}
