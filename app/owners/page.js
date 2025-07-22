
//APP/OWNERS/PAGE.JS
"use client";
import { useEffect, useState } from "react";
import OwnerModal from "./OwnerModal";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOwner, setModalOwner] = useState(null);
  const [deleteOwner, setDeleteOwner] = useState(null);

  // Filtres
  const [searchProprietaire, setSearchProprietaire] = useState("");
  const [searchLogement, setSearchLogement] = useState("");

  useEffect(() => {
    fetch("/api/owners")
      .then((res) => res.json())
      .then((data) => {
        setOwners(data);
        setLoading(false);
      });
  }, []);

  // Filtrage
  const filteredOwners = owners.filter((owner) => {
    const nomLogement = owner.nomLogement || "";
    const matchProprio =
      searchProprietaire.trim() === "" ||
      ((owner.prenom ?? "") + " " + (owner.nom ?? ""))
        .toLowerCase()
        .includes(searchProprietaire.trim().toLowerCase());
    const matchLogement =
      searchLogement.trim() === "" ||
      nomLogement.toLowerCase().includes(searchLogement.trim().toLowerCase());
    return matchProprio && matchLogement;
  });

  // Actions
  const openCreate = () => {
    setModalOwner(null);
    setModalOpen(true);
  };
  const openEdit = (owner) => {
    setModalOwner(owner);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    let updatedOwner;
    if (modalOwner) {
      // Edition
      const res = await fetch("/api/owners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...modalOwner, ...form }),
      });
      if (!res.ok) {
        alert("Erreur lors de la mise à jour");
        return;
      }
      updatedOwner = await res.json();
      setOwners(
        owners.map((o) => (o._id === updatedOwner._id ? updatedOwner : o))
      );
    } else {
      // Création
      const res = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        alert("Erreur lors de la création");
        return;
      }
      updatedOwner = await res.json();
      setOwners([updatedOwner, ...owners]);
    }
    setModalOpen(false);
    setModalOwner(null);
  };

  const handleDelete = (owner) => setDeleteOwner(owner);

  const confirmDelete = async () => {
    const res = await fetch("/api/owners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteOwner._id }),
    });
    if (!res.ok) {
      alert("Erreur lors de la suppression");
      return;
    }
    setOwners(owners.filter((o) => o._id !== deleteOwner._id));
    setDeleteOwner(null);
  };

  if (loading)
    return (
      <div className="py-16 text-center text-lg text-gray-600">Chargement…</div>
    );

  return (
    <div className="p-6 mx-auto ">
      <h1 className="text-2xl font-light mb-6 text-gray-900">
        Propriétaires
      </h1>
      {/* FILTRES + bouton */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          className="border border-gray-300 rounded-xl text-sm px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-[#bd9254] transition"
          placeholder="🔍 Par nom ou prénom"
          value={searchProprietaire}
          onChange={(e) => setSearchProprietaire(e.target.value)}
        />
        <input
          type="text"
          className="border border-gray-300 text-sm rounded-xl px-4 py-2 w-full max-w-xs  focus:outline-none focus:ring-1 focus:ring-[#bd9254] transition"
          placeholder="🔍 Par nom du logement"
          value={searchLogement}
          onChange={(e) => setSearchLogement(e.target.value)}
        />
        <button
          className="ml-0 sm:ml-2 mt-2 sm:mt-0 px-5 py-2  bg-[#bd9254] text-white rounded-xl text-sm hover:bg-[#a17435] font-medium"
          onClick={openCreate}
        >
          + Créer un propriétaire
        </button>
        <span className="text-gray-400   sm:ml-auto">
          {filteredOwners.length} résultat
          {filteredOwners.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl bg-white border border-gray-200">
        <table className="w-full text-[10px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 whitespace-nowrap">#</th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                ID
              </th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                SIRET
              </th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                Prénom
              </th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                Nom
              </th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                Nom du logement
              </th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                Registre touristique
              </th>

              <th className="px-2 py-3 font-light text-left text-gray-700">
                Ville
              </th>
              {/* <th className="px-2 py-3 font-light text-left text-gray-700">Pays</th> */}
              <th className="px-2 py-3 font-light text-left text-gray-700">
                Email
              </th>
              <th className="px-2 py-3 font-light text-left text-gray-700">
                Téléphone
              </th>

              <th className="px-2 py-3 font-light text-left text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map((owner, i) => (
              <tr
                key={owner._id}
                className={
                  "transition-all group hover:bg-indigo-50/60 " +
                  (i % 2 === 0 ? "bg-white" : "bg-gray-50")
                }
              >
                <td className="px-2 py-2 font-mono text-[10px] text-gray-500">
                  {i + 1}
                </td>
                <td className="px-2  py-2">{owner.ownerId}</td>
                <td className="px-2   py-2">{owner.siret}</td>
                <td className="px-2  py-2">{owner.prenom}</td>
                <td className="px-2   py-2">{owner.nom}</td>
                <td className="px-2   py-2">
                  {owner.nomLogement ?? (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-2   py-2">
                  {owner.registreTouristique ?? (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                {/* <td className="px-2   py-2">{owner.adresse}</td> */}
                {/* <td className="px-2   py-2">{owner.codePostal}</td> */}
                <td className="px-2   py-2">{owner.ville}</td>
                {/* <td className="px-2   py-2">{owner.pays}</td> */}
                <td className="px-2   py-2">{owner.email}</td>
                <td className="px-2   py-2">{owner.telephone}</td>

                <td className="px-2   py-2 flex gap-2">
                  <button
                    className=" px-3 py-1 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-[10px] hover:bg-[#a17435] hover:text-white font-medium mr-2"
                    onClick={() => openEdit(owner)}
                  >
                    Éditer
                  </button>
                  <button
                    className=" px-3 py-1 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-[10px] hover:bg-red-400 hover:border-red-400 hover:text-white font-medium "
                    onClick={() => handleDelete(owner)}
                  >
                    Effacer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal édition/création */}
      <OwnerModal
        open={modalOpen}
        owner={modalOwner}
        onClose={() => {
          setModalOpen(false);
          setModalOwner(null);
        }}
        onSave={handleSave}
      />

      {/* Pop-up de suppression */}
      {deleteOwner && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setDeleteOwner(null)}
            >
              &#10005;
            </button>
            <div>
              <div className="text-lg font-light  mb-4 text-gray-800">
                Confirmer la suppression
              </div>
              <div className="mb-6">
                Voulez-vous vraiment supprimer{" "}
                <span className="font-bold">
                  {deleteOwner?.prenom} {deleteOwner?.nom}
                </span>{" "}
                ?
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-red-600 text-white rounded-xl px-4 py-2 font-light  hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Supprimer
                </button>
                <button
                  className="bg-gray-200 text-gray-700 rounded-xl px-4 py-2 font-medium hover:bg-gray-300"
                  onClick={() => setDeleteOwner(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
