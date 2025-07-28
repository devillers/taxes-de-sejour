

import { useEffect, useState } from "react";

export default function PropertiesModal({ open, property, onSave, onClose }) {
  const [form, setForm] = useState({
    ownerId: "",
    code: "",
    registreTouristique: "",
    nomProprietaire: "",
    prenomProprietaire: "",
    logement: "",
    adresse: "",
    codePostal: "",
    localite: "",
     taxeTouristique: "", // AJOUT
  });

  useEffect(() => {
    if (open) {
      setForm({
        ownerId: property?.ownerId || "",
        code: property?.code || "",
        registreTouristique:
          property?.registreTouristique ||
          property?.numeroRegistreTouristique ||
          "",
        nomProprietaire: property?.nomProprietaire || "",
        prenomProprietaire: property?.prenomProprietaire || "",
        logement: property?.logement || "",
        adresse: property?.adresse || "",
        codePostal: property?.codePostal || "",
        localite: property?.localite || "",
        taxeTouristique: property?.taxeTouristique || property?.montantTaxe || "", // AJOUT
      });
    }
  }, [open, property]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg relative">
        <button
          className="absolute flex items-center justify-center top-3 right-3 rounded-full shadow-md px-1 py-1 h-8 w-8 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &#10005;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="text-md font-medium mb-4 text-gray-800">
            {property ? "Modifier le logement" : "Créer un logement"}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex flex-col col-span-2">
              <label htmlFor="ownerId" className="text-xs text-[#bd9254] mb-1">
                ID Propriétaire
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="ownerId"
                name="ownerId"
                value={form.ownerId}
                onChange={handleChange}
                placeholder="ID Propriétaire"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="code" className="text-xs text-[#bd9254] mb-1">
                Code
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Code"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="registreTouristique"
                className="text-xs text-[#bd9254] mb-1"
              >
                Registre Touristique
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="registreTouristique"
                name="registreTouristique"
                value={form.registreTouristique}
                onChange={handleChange}
                placeholder="Registre touristique"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="nomProprietaire"
                className="text-xs text-[#bd9254] mb-1"
              >
                Nom du propriétaire
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="nomProprietaire"
                name="nomProprietaire"
                value={form.nomProprietaire}
                onChange={handleChange}
                placeholder="Nom du propriétaire"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="prenomProprietaire"
                className="text-xs text-[#bd9254] mb-1"
              >
                Prénom du propriétaire
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="prenomProprietaire"
                name="prenomProprietaire"
                value={form.prenomProprietaire}
                onChange={handleChange}
                placeholder="Prénom du propriétaire"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="logement" className="text-xs text-[#bd9254] mb-1">
                Logement
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="logement"
                name="logement"
                value={form.logement}
                onChange={handleChange}
                placeholder="Nom du logement"
              />
            </div>
            {/* <div className="flex flex-col col-span-2">
              <label
                htmlFor="taxeTouristique"
                className="text-xs text-[#bd9254] mb-1"
              >
                Taxe Touristique (€)
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="taxeTouristique"
                name="taxeTouristique"
                value={form.taxeTouristique}
                onChange={handleChange}
                placeholder="Montant de la taxe de séjour"
                type="number"
                min={0}
                step="0.01"
              />
            </div> */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="adresse" className="text-xs text-[#bd9254] mb-1">
                Adresse
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="adresse"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Adresse"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="codePostal"
                className="text-xs text-[#bd9254] mb-1"
              >
                Code Postal
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="codePostal"
                name="codePostal"
                value={form.codePostal}
                onChange={handleChange}
                placeholder="Code Postal"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="localite" className="text-xs text-[#bd9254] mb-1">
                Localité
              </label>
              <input
                className="border rounded-xl p-3 text-sm"
                id="localite"
                name="localite"
                value={form.localite}
                onChange={handleChange}
                placeholder="Localité"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="bg-[#bd9254] text-white rounded-xl px-8 py-3 font-light text-sm hover:bg-[#a17435]"
            >
              Enregistrer
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 rounded-xl px-8 py-3 font-medium hover:bg-gray-300 text-sm"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
