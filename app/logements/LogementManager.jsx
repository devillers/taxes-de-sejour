"use client";
import { useState } from "react";
import FormattedDate from "../../components/FormattedDate.js ";
import ConfirmModal from "../../components/ConfirmModal";

export default function LogementManager({ initialAccommodations }) {
  const [accommodations, setAccommodations] = useState(initialAccommodations);
  const [form, setForm] = useState({
    owner: "",
    logement: "",
    adresse: "",
    codePostal: "",
    localite: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ owner: "", logement: "", adresse: "", codePostal: "", localite: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation front-end de l'owner
    if (!form.owner.match(/^[0-9a-fA-F]{24}$/)) {
      alert("🔴 L’ownerId doit être un ObjectId MongoDB valide (24 hex). Merci de corriger.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/accommodations/${editingId}` : "/api/accommodations";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingId) {
          setAccommodations(accommodations.map((a) => (a._id === editingId ? data : a)));
        } else {
          setAccommodations([...accommodations, data]);
        }
        resetForm();
      } else {
        alert(`❌ Erreur API: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erreur réseau ou serveur');
    }
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({
      owner: a.ownerId || a.owner?._id || a.owner || "",
      logement: a.logement || "",
      adresse: a.adresse || "",
      codePostal: a.codePostal || "",
      localite: a.localite || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/accommodations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAccommodations(accommodations.filter((a) => a._id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erreur suppression');
    }
  };

  return (
    <div>
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
        {[
          { name: 'owner', required: true, pattern: '^[0-9a-fA-F]{24}$' },
          { name: 'logement' },
          { name: 'adresse' },
          { name: 'codePostal' },
          { name: 'localite' }
        ].map(({ name, required, pattern }) => (
          <input
            key={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={name}
            className="border p-1 flex-1 min-w-[120px]"
            {...(required ? { required: true } : {})}
            {...(pattern ? { pattern } : {})}
          />
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingId ? "Modifier" : "Ajouter"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Annuler
          </button>
        )}
      </form>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">N°</th>
              <th className="border px-2 py-1">ownerId</th>
              <th className="border px-2 py-1">Nom propriétaire</th>
              <th className="border px-2 py-1">Logement</th>
              <th className="border px-2 py-1">Adresse</th>
              <th className="border px-2 py-1">Localité</th>
              <th className="border px-2 py-1">Code postal</th>
              <th className="border px-2 py-1">N° registre touristique</th>
              <th className="border px-2 py-1">Classement</th>
              <th className="border px-2 py-1">Prix nuitée</th>
              <th className="border px-2 py-1">Début séjour</th>
              <th className="border px-2 py-1">Durée</th>
              <th className="border px-2 py-1">Nb pers.</th>
              <th className="border px-2 py-1">Nb nuitées</th>
              <th className="border px-2 py-1">Tarif taxe</th>
              <th className="border px-2 py-1">Montant taxe</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accommodations.map((a, idx) => (
              <tr key={a._id} className="border-t">
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">{a.ownerId || a.owner?._id || a.owner}</td>
                <td className="border px-2 py-1">
                  {a.nomProprietaire || `${a.owner?.prenom || ''} ${a.owner?.nom || ''}`.trim()}
                </td>
                <td className="border px-2 py-1">{a.logement}</td>
                <td className="border px-2 py-1">{[a.numero, a.adresse].filter(Boolean).join(' ')}</td>
                <td className="border px-2 py-1">{a.localite}</td>
                <td className="border px-2 py-1">{a.codePostal}</td>
                <td className="border px-2 py-1">{a.numeroRegistreTouristique}</td>
                <td className="border px-2 py-1">{a.numeroRegistreTouristique ? 'Classé' : 'Non classé'}</td>
                <td className="border px-2 py-1">{a.prixNuitee ?? ''}</td>
                <td className="border px-2 py-1"><FormattedDate value={a.sejourDebut} /></td>
                <td className="border px-2 py-1">{a.sejourDuree ?? ''}</td>
                <td className="border px-2 py-1">{a.nbPersonnes ?? ''}</td>
                <td className="border px-2 py-1">{a.nbNuitees ?? ''}</td>
                <td className="border px-2 py-1">{a.tarifUnitaireTaxe ?? ''}</td>
                <td className="border px-2 py-1">{a.montantTaxe ?? ''}</td>
                <td className="border px-2 py-1 space-y-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-xs text-white bg-blue-500 hover:bg-blue-700 rounded-3xl w-full px-2 py-1"
                  >
                    Edit
                  </button>
                  <ConfirmModal
                    label="delete"
                    message="⚠️ Supprimer ce logement ?"
                    onConfirm={() => handleDelete(a._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
