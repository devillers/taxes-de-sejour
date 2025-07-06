
//app/logements/LogmentManager.jsx
'use client';

import { useState } from 'react';
import FormattedDate from '../../components/FormattedDate';       // plus de “.js” ni d’espace
import ConfirmModal from '../../components/ConfirmModal';

export default function LogementManager({ initialAccommodations }) {
  const [accommodations, setAccommodations] = useState(initialAccommodations);
  const [form, setForm] = useState({
    owner: '',
    nomProprietaire: '',
    logement: '',
    adresse: '',
    localite: '',
    codePostal: '',
    numeroRegistreTouristique: '',
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({
      owner: '',
      nomProprietaire: '',
      logement: '',
      adresse: '',
      localite: '',
      codePostal: '',
      numeroRegistreTouristique: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      owner: Number(form.owner),
      nomProprietaire: form.nomProprietaire.trim(),
      logement: form.logement.trim(),
      adresse: form.adresse.trim(),
      localite: form.localite.trim(),
      codePostal: form.codePostal.trim(),
      numeroRegistreTouristique: form.numeroRegistreTouristique.trim(),
    };

    try {
      const res = await fetch(
        editingId ? `/api/accommodations/${editingId}` : '/api/accommodations',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      setAccommodations(prev =>
        editingId
          ? prev.map(a => (a._id === editingId ? data : a))
          : [...prev, data]
      );
      resetForm();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({
      owner: String(a.ownerId),
      nomProprietaire: a.nomProprietaire,
      logement: a.logement,
      adresse: a.adresse,
      localite: a.localite,
      codePostal: a.codePostal,
      numeroRegistreTouristique: a.numeroRegistreTouristique,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Supprimer ce logement ?')) return;
    await fetch(`/api/accommodations/${id}`, { method: 'DELETE' });
    setAccommodations(prev => prev.filter(a => a._id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
        {[
          { name: 'owner', placeholder: 'ownerId', type: 'number', required: true },
          { name: 'nomProprietaire', placeholder: 'Nom propriétaire', type: 'text', required: true },
          { name: 'logement', placeholder: 'Logement', type: 'text', required: true },
          { name: 'adresse', placeholder: 'Adresse', type: 'text' },
          { name: 'localite', placeholder: 'Localité', type: 'text' },
          { name: 'codePostal', placeholder: 'Code postal', type: 'text' },
          { name: 'numeroRegistreTouristique', placeholder: 'N° registre touristique', type: 'text' },
        ].map(field => (
          <input
            key={field.name}
            {...field}
            value={form[field.name]}
            onChange={handleChange}
            className="border p-1 flex-1 min-w-[140px]"
          />
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {editingId ? 'Modifier' : 'Ajouter'}
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
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accommodations.map((a, idx) => (
              <tr key={a._id} className="border-t">
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">{a.ownerId}</td>
                <td className="border px-2 py-1">{a.nomProprietaire}</td>
                <td className="border px-2 py-1">{a.logement}</td>
                <td className="border px-2 py-1">{a.adresse}</td>
                <td className="border px-2 py-1">{a.localite}</td>
                <td className="border px-2 py-1">{a.codePostal}</td>
                <td className="border px-2 py-1">{a.numeroRegistreTouristique}</td>
                <td className="border px-2 py-1">
                  {a.numeroRegistreTouristique ? 'Classé' : 'Non classé'}
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
