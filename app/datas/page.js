"use client";

import { useState } from "react";
import CSVUploader from "../../components/CSVUploader";

export default function ImportPage() {
  const [ownerFile, setOwnerFile] = useState(null);
  const [accomFile, setAccomFile] = useState(null);
  const [taxFile, setTaxFile] = useState(null);
  const [ownerMsg, setOwnerMsg] = useState("");
  const [accomMsg, setAccomMsg] = useState("");
  const [taxMsg, setTaxMsg] = useState("");

  const handleUpload = async (file, endpoint, setMsg, delimiter = ";") => {
    if (!file) {
      setMsg("Veuillez sélectionner un fichier CSV.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("delimiter", delimiter);

    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const json = await res.json();
      setMsg(json.message || json.error);
    } catch (err) {
      setMsg("Erreur lors de l’envoi du fichier.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-light mb-12 text-center">
        Import de données – Taxes de séjour
      </h1>
      <div className="flex flex-col lg:flex-row gap-12 justify-center items-center ">
        {/* 1. Propriétaires */}
        <div className="flex flex-col items-center w-full max-w-xs p-8 rounded-3xl shadow-xl bg-white border border-gray-100">
           <h2 className="text-lg font-thin mb-4 text-center">
            1. Importer les propriétaires
          </h2>
          <CSVUploader
            id="owner-upload"
            fileName={ownerFile?.name}
            onFileSelect={setOwnerFile}
          />
          <button
            onClick={() =>
              handleUpload(ownerFile, "/api/upload-owners", setOwnerMsg)
            }
            className="mt-6 px-4 py-2 bg-[#bd9254] text-white rounded hover:bg-[#9f7232] w-full"
          >
            Importer les propriétaires
          </button>
          {ownerMsg && (
            <p className="mt-2 text-sm text-[#bd9254] text-center">{ownerMsg}</p>
          )}
        </div>

        {/* 2. Logements */}
        <div className="flex flex-col items-center w-full max-w-xs p-8 rounded-3xl shadow-xl bg-white border border-gray-100">
           <h2 className="text-lg font-thin mb-4 text-center">
            2. Importer les logements
          </h2>
          <CSVUploader
            id="accom-upload"
            fileName={accomFile?.name}
            onFileSelect={setAccomFile}
          />
          <button
            onClick={() =>
              handleUpload(accomFile, "/api/upload-properties", setAccomMsg)
            }
            className="mt-6 px-4 py-2 bg-[#bd9254] text-white rounded hover:bg-[#9f7232] w-full"
          >
            Importer les logements
          </button>
          {accomMsg && (
            <p className="mt-2 text-sm text-[#bd9254] text-center">{accomMsg}</p>
          )}
        </div>

        {/* 3. Taxes de séjour */}
        <div className="flex flex-col items-center w-full max-w-xs p-8 rounded-3xl shadow-xl bg-white border border-gray-100">
          <h2 className="text-lg font-thin mb-4 text-center">
            3. Importer la taxe de séjour
          </h2>
          <CSVUploader
            id="tax-upload"
            fileName={taxFile?.name}
            onFileSelect={setTaxFile}
          />
          <button
            onClick={() =>
              handleUpload(taxFile, "/api/upload-taxes", setTaxMsg)
            }
            className="mt-6 px-4 py-2 bg-[#bd9254] text-white rounded hover:bg-[#9f7232] w-full"
          >
            Importer la taxe de séjour
          </button>
          {taxMsg && (
            <p className="mt-2 text-sm text-[#bd9254] text-center">{taxMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
