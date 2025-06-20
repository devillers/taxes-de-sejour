'use client';
import { useState } from 'react';

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
    setForm({ owner: '', logement: '', adresse: '', codePostal: '', localite: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/accommodations/${editingId}` : '/api/accommodations';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      if (editingId) {
        setAccommodations(accommodations.map(a => a._id === editingId ? data : a));
      } else {
        setAccommodations([...accommodations, data]);
      }
      resetForm();
    }
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({
      owner: a.owner?._id || a.owner,
      logement: a.logement || '',
      adresse: a.adresse || '',
      codePostal: a.codePostal || '',
      localite: a.localite || '',
    });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/accommodations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAccommodations(accommodations.filter(a => a._id !== id));
      if (editingId === id) resetForm();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des logements</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          name="owner"
          value={form.owner}
          onChange={handleChange}
          placeholder="ownerId"
          className="border p-1"
        />
        <input
          name="logement"
          value={form.logement}
          onChange={handleChange}
          placeholder="logement"
          className="border p-1"
        />
        <input
          name="adresse"
          value={form.adresse}
          onChange={handleChange}
          placeholder="adresse"
          className="border p-1"
        />
        <input
          name="localite"
          value={form.localite}
          onChange={handleChange}
          placeholder="localité"
          className="border p-1"
        />
        <input
          name="codePostal"
          value={form.codePostal}
          onChange={handleChange}
          placeholder="codePostal"
          className="border p-1"
        />
        <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="px-2 py-1 bg-gray-500 text-white rounded">
            Annuler
          </button>
        )}
      </form>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ownerId</th>
            <th className="border px-2 py-1">Logement</th>
            <th className="border px-2 py-1">Adresse</th>
            <th className="border px-2 py-1">Localité</th>
            <th className="border px-2 py-1">Code postal</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="border px-2 py-1">{a.owner?._id || a.owner}</td>
              <td className="border px-2 py-1">{a.logement}</td>
              <td className="border px-2 py-1">{a.adresse}</td>
              <td className="border px-2 py-1">{a.localite}</td>
              <td className="border px-2 py-1">{a.codePostal}</td>
              <td className="border px-2 py-1 space-x-2">
                <button type="button" className="text-blue-600" onClick={() => handleEdit(a)}>Edit</button>
                <button type="button" className="text-red-600" onClick={() => handleDelete(a._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
