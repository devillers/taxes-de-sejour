'use client';
import { useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal'; // ajuste le chemin si besoin

export default function LogementManager({ initialAccommodations }) {
  const [accommodations, setAccommodations] = useState(initialAccommodations);
  const [form, setForm] = useState({
    owner: '',
    logement: '',
    adresse: '',
    codePostal: '',
    localite: '',
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      owner: '',
      logement: '',
      adresse: '',
      codePostal: '',
      localite: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/accommodations/${editingId}`
      : '/api/accommodations';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
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
    }
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({
      owner: a.ownerId || a.owner?.id || a.owner,
      logement: a.logement || '',
      adresse: a.adresse || '',
      codePostal: a.codePostal || '',
      localite: a.localite || '',
    });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/accommodations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAccommodations(accommodations.filter((a) => a._id !== id));
      if (editingId === id) resetForm();
    }
  };

  return (
    <div>
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        {['owner', 'logement', 'adresse', 'codePostal', 'localite'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field}
            className="border p-1"
          />
        ))}
        <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-2 py-1 bg-gray-500 text-white rounded"
          >
            Annuler
          </button>
        )}
      </form>

      {/* Tableau */}
      <table className="min-w-full border text-[10px]">
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
              <td className="border px-2 py-1">{a.ownerId || a.owner?.id || a.owner}</td>
              <td className="border px-2 py-1">
                {a.nomProprietaire || `${a.owner?.prenom || ''} ${a.owner?.nom || ''}`.trim()}
              </td>
              <td className="border px-2 py-1">{a.logement}</td>
              <td className="border px-2 py-1">
                {[a.numero, a.adresse].filter(Boolean).join(' ')}
              </td>
              <td className="border px-2 py-1">{a.localite}</td>
              <td className="border px-2 py-1">{a.codePostal}</td>
              <td className="border px-2 py-1">{a.numeroRegistreTouristique}</td>
              <td className="border px-2 py-1">
                {a.numeroRegistreTouristique ? 'Classé' : 'Non classé'}
              </td>
              <td className="border px-2 py-1">{a.prixNuitee ?? ''}</td>
              <td className="border px-2 py-1">
                {a.sejourDebut ? new Date(a.sejourDebut).toLocaleDateString() : ''}
              </td>
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
                  className="text-amber-300"
                
                  onConfirm={() => handleDelete(a._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
