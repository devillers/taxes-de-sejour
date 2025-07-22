"use client";
import { useEffect, useState } from "react";
import PropertiesModal from "./PropertiesModal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

async function exportPropertiesToXLSX_ExcelJS(
  properties,
  fileName = "logements.xlsx"
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Logements");

  worksheet.columns = [
    { header: "#", key: "num", width: 5 },
    { header: "ownerId", key: "ownerId", width: 16 },
    { header: "Code", key: "code", width: 14 },
    { header: "Registre Touristique", key: "registre", width: 24 },
    { header: "Propriétaire", key: "proprio", width: 18 },
    { header: "Logement", key: "logement", width: 18 },
    { header: "Adresse", key: "adresse", width: 22 },
    { header: "Code Postal", key: "codePostal", width: 12 },
    { header: "Localité", key: "localite", width: 14 },
  ];

  properties.forEach((item, idx) => {
    worksheet.addRow({
      num: idx + 1,
      ownerId: item.ownerId,
      code: item.code,
      registre:
        item.numeroRegistreTouristique || item.registreTouristique || "",
      proprio: item.proprietaire || item.nomProprietaire || "",
      logement: item.logement,
      adresse: item.adresse,
      codePostal: item.codePostal,
      localite: item.localite,
    });
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFEFEFEF" },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}

export default function PropertiesTable() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ proprietaire: "", logement: "" });
  const [villesFiltrees, setVillesFiltrees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(console.error);
  }, []);

  // Extraire la liste des villes distinctes
  const villes = Array.from(
    new Set(properties.map((p) => (p.localite || "").trim()).filter(Boolean))
  ).sort();

  // Gérer le formulaire texte
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Gérer les villes cochées
  const handleVilleCheckbox = (ville, checked) => {
    setVillesFiltrees((prev) =>
      checked ? [...prev, ville] : prev.filter((v) => v !== ville)
    );
  };

  // Tout décocher
  const handleClearVilles = () => setVillesFiltrees([]);

  // Filtrage du tableau
  const filteredProperties = properties.filter((item) => {
    const villeMatch =
      villesFiltrees.length === 0 ||
      villesFiltrees.includes((item.localite || "").trim());
    const proprioMatch = filters.proprietaire
      ? (item.proprietaire || item.nomProprietaire || "")
          .toLowerCase()
          .includes(filters.proprietaire.toLowerCase())
      : true;
    const logementMatch = filters.logement
      ? (item.logement || "")
          .toLowerCase()
          .includes(filters.logement.toLowerCase())
      : true;
    return villeMatch && proprioMatch && logementMatch;
  });

  // Ouvre le modale en mode édition
  const handleEdit = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  // Ferme le modale
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  // Sauvegarde (PUT)
  const handleSave = async (updatedData) => {
    if (!selectedProperty) return;
    const res = await fetch(`/api/properties?id=${selectedProperty._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) =>
          p._id === selectedProperty._id ? { ...p, ...updatedData } : p
        )
      );
      handleCloseModal();
    } else {
      alert("Erreur lors de la modification !");
    }
  };

  // Suppression
  const handleDelete = async (property) => {
    if (!window.confirm("Supprimer ce logement ?")) return;
    const res = await fetch(`/api/properties?id=${property._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p._id !== property._id));
    } else {
      alert("Erreur lors de la suppression !");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-light mb-6">Liste des logements</h1>

      {/* Filtres */}
      <form className="mb-4  gap-6 items-end sticky top-[-220px] shadow-lg z-20 bg-white border-b border-gray-200 py-4">
        <div className="p-6">
          <label className="block text-lg font-medium mb-1">Villes</label>
          <div className="flex flex-wrap gap-3 w-full text-[10px] mb-4">
            {villes.map((ville) => (
              <label key={ville} className="inline-flex items-center ">
                <input
                  type="checkbox"
                  className="accent-[#bd9254] mr-2"
                  value={ville}
                  checked={villesFiltrees.includes(ville)}
                  onChange={(e) => handleVilleCheckbox(ville, e.target.checked)}
                />
                <span>{ville}</span>
              </label>
            ))}
          </div>
          <button
            type="button"
             className=" px-5 py-2 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-sm hover:bg-[#bd9254]] hover:text-white font-medium"
            onClick={handleClearVilles}
          >
            Tout décocher
          </button>
        </div>
        <div className="  p-6 ">
          <h2 className="text-sm italic uppercase font-light mb-4 ">
            filtrer par logements et par proprietaire
          </h2>
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex flex-row gap-4">
              <div>
                <label
                  className="block text-xs font-light mb-1"
                  htmlFor="proprietaire"
                >
                  Propriétaire
                </label>
                <input
                  type="text"
                  id="proprietaire"
                  name="proprietaire"
                  placeholder="Filtrer par propriétaire"
                  value={filters.proprietaire}
                  onChange={handleChange}
                   className=" px-5 py-2 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-sm outline-none "
                />
              </div>
              <div>
                <label
                  className="block text-xs font-light mb-1"
                  htmlFor="logement"
                >
                  Nom du logement
                </label>
                <input
                  type="text"
                  id="logement"
                  name="logement"
                  placeholder="Filtrer par logement"
                  value={filters.logement}
                  onChange={handleChange}
                   className=" px-5 py-2 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-sm outline-none "
                />
              </div>
             
            </div>
             {/* Bouton EXPORT */}
            <div>
              <button
                onClick={() =>
                  exportPropertiesToXLSX_ExcelJS(filteredProperties)
                }
               className="px-5 py-2 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-sm hover:bg-[#a17435] hover:text-white font-medium"
              >
                Exporter en Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white w-full">
        <table className="w-full text-[10px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 text-left">#</th>
              <th className="px-2 py-2 text-left">ownerId</th>
              <th className="px-2 py-2 text-left">Code</th>
              <th className="px-2 py-2 text-left">Registre Touristique</th>
              <th className="px-2 py-2 text-left">Propriétaire</th>
              <th className="px-2 py-2 text-left">Logement</th>
              <th className="px-2 py-2 text-left">Adresse</th>
              <th className="px-2 py-2 text-left">Code Postal</th>
              <th className="px-2 py-2 text-left">Localité</th>
              <th className="px-2 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((item, i) => (
              <tr key={item._id} className="border-b border-b-gray-200 hover:bg-gray-50">
                <td className="px-2 py-2">{i + 1}</td>
                <td className="px-2 py-2">{item.ownerId}</td>
                <td className="px-2 py-2">{item.code}</td>
                <td className="px-2 py-2">
                  {item.numeroRegistreTouristique ||
                    item.registreTouristique ||
                    ""}
                </td>
                <td className="px-2 py-2">
                  {item.proprietaire || item.nomProprietaire || ""}
                </td>
                <td className="px-2 py-2">{item.logement}</td>
                <td className="px-2 py-2">{item.adresse}</td>
                <td className="px-2 py-2">{item.codePostal}</td>
                <td className="px-2 py-2">{item.localite}</td>
                <td className="px-2 py-2">
                  <button
                    className=" px-3 py-1 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-[10px] hover:bg-[#a17435] hover:text-white font-medium mr-2"
                    onClick={() => handleEdit(item)}
                  >
                    Éditer
                  </button>
                  <button
                         className=" px-3 py-1 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-[10px] hover:bg-red-400 hover:border-red-400 hover:text-white font-medium "
                    onClick={() => handleDelete(item)}
                  >
                    Effacer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProperties.length === 0 && (
          <div className="p-4 text-gray-500">
            Aucun logement trouvé pour cette recherche.
          </div>
        )}
      </div>
      <PropertiesModal
        open={modalOpen}
        property={selectedProperty}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </div>
  );
}
