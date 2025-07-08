// app/owners/OwnerModal.js

import { useEffect, useState } from "react";

export default function OwnerModal({ open, owner, onSave, onClose }) {
  const [form, setForm] = useState({
    ownerId: "",
    prenom: "",
    nom: "",
    nomLogement: "",
    registreTouristique: "",
    adresse: "",
    codePostal: "",
    ville: "",
    pays: "",
    email: "",
    telephone: "",
    siret: "",
    // ajoute ici tous les champs
  });

  useEffect(() => {
    if (open) {
      setForm({
        ownerId: owner?.ownerId || "",
        prenom: owner?.prenom || "",
        nom: owner?.nom || "",
        nomLogement: owner?.nomLogement || "",
        registreTouristique: owner?.registreTouristique || "",
        adresse: owner?.adresse || "",
        codePostal: owner?.codePostal || "",
        ville: owner?.ville || "",
        pays: owner?.pays || "",
        email: owner?.email || "",
        telephone: owner?.telephone || "",
        siret: owner?.siret || "",
      });
    }
  }, [open, owner]);

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
            {owner ? "Modifier le propriétaire" : "Créer un propriétaire"}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex flex-col col-span-2">
              <label htmlFor="ownerId" className="text-xs text-[#bd9254] mb-1">ID</label>
              <input className="border rounded-xl p-3 text-sm"
                id="ownerId" name="ownerId" value={form.ownerId} onChange={handleChange} placeholder="ID" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="prenom" className="text-xs text-[#bd9254] mb-1">Prénom</label>
              <input className="border rounded-xl p-3 text-sm"
                id="prenom" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="nom" className="text-xs text-[#bd9254] mb-1">Nom</label>
              <input className="border rounded-xl p-3 text-sm"
                id="nom" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="nomLogement" className="text-xs text-[#bd9254] mb-1">Nom du logement</label>
              <input className="border rounded-xl p-3 text-sm"
                id="nomLogement" name="nomLogement" value={form.nomLogement} onChange={handleChange} placeholder="Nom du logement" />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="registreTouristique" className="text-xs text-[#bd9254] mb-1">Registre touristique</label>
              <input className="border rounded-xl p-3 text-sm"
                id="registreTouristique" name="registreTouristique" value={form.registreTouristique} onChange={handleChange} placeholder="Registre touristique" />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="adresse" className="text-xs text-[#bd9254] mb-1">Adresse</label>
              <input className="border rounded-xl p-3 text-sm"
                id="adresse" name="adresse" value={form.adresse} onChange={handleChange} placeholder="Adresse" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="codePostal" className="text-xs text-[#bd9254] mb-1">Code Postal</label>
              <input className="border rounded-xl p-3 text-sm"
                id="codePostal" name="codePostal" value={form.codePostal} onChange={handleChange} placeholder="Code Postal" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="ville" className="text-xs text-[#bd9254] mb-1">Ville</label>
              <input className="border rounded-xl p-3 text-sm"
                id="ville" name="ville" value={form.ville} onChange={handleChange} placeholder="Ville" />
            </div>
            {/* <div className="flex flex-col col-span-2">
              <label htmlFor="pays" className="text-xs text-[#bd9254] mb-1">Pays</label>
              <input className="border rounded-xl p-3 text-sm"
                id="pays" name="pays" value={form.pays} onChange={handleChange} placeholder="Pays" />
            </div> */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="email" className="text-xs text-[#bd9254] mb-1">Email</label>
              <input className="border rounded-xl p-3 text-sm"
                id="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="telephone" className="text-xs text-[#bd9254] mb-1">Téléphone</label>
              <input className="border rounded-xl p-3 text-sm"
                id="telephone" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="siret" className="text-xs text-[#bd9254] mb-1">SIRET</label>
              <input className="border rounded-xl p-3 text-sm"
                id="siret" name="siret" value={form.siret} onChange={handleChange} placeholder="SIRET" />
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
