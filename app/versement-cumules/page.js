"use client";

import { useEffect, useState } from "react";
import { normalizeVille, mairies } from "../lib/mairies";
import { FaSpinner } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Fonction utilitaire : cumule les lignes par hebergementId
function cumulerTaxesParLogement(data) {
  const map = new Map();
  for (const row of data) {
    const id = row.hebergementId;
    if (!id) continue;
    if (!map.has(id)) {
      map.set(id, { ...row });
    } else {
      const acc = map.get(id);
      acc.montantTaxe =
        (parseFloat(acc.montantTaxe) || 0) + (parseFloat(row.montantTaxe) || 0);
      acc.nbNuitees =
        (parseFloat(acc.nbNuitees) || 0) + (parseFloat(row.nbNuitees) || 0);
      acc.nbPersonnes =
        (parseFloat(acc.nbPersonnes) || 0) + (parseFloat(row.nbPersonnes) || 0);
    }
  }
  return Array.from(map.values()).map((row) => ({
    ...row,
    montantTaxe: Number(row.montantTaxe).toFixed(2),
    nbNuitees: row.nbNuitees,
    nbPersonnes: row.nbPersonnes,
  }));
}

export default function TaxeTableau() {
  const [data, setData] = useState([]);
  const [villesAll, setVillesAll] = useState([]);
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(true);
  const [mailStatus, setMailStatus] = useState({});
  // Totaux pour affichage HTML
  const totalTaxe = data.reduce(
    (acc, row) => acc + parseFloat(row.montantTaxe || 0),
    0
  );
  const totalNuitees = data.reduce(
    (acc, row) => acc + parseFloat(row.nbNuitees || 0),
    0
  );
  const totalPers = data.reduce(
    (acc, row) => acc + parseFloat(row.nbPersonnes || 0),
    0
  );

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/versement-tableau${
        ville ? `?ville=${encodeURIComponent(ville)}` : ""
      }`
    )
      .then((res) => res.json())
      .then((json) => {
        const cumules = cumulerTaxesParLogement(json);
        setData(cumules);
        if (cumules && Array.isArray(cumules)) {
          const allVilles = Array.from(
            new Set(cumules.map((row) => row.hebergementVille).filter(Boolean))
          );
          setVillesAll(allVilles);
        }
      })
      .catch((err) => {
        setData([]);
        setVillesAll([]);
        console.error("Erreur API versement-tableau :", err);
      })
      .finally(() => setLoading(false));
  }, [ville]);

  // EXPORT EXCEL AVEC TOTAL GENERAL
  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Taxes de séjour");

    // Colonnes
    sheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Id CARE", key: "hebergementId", width: 20 },
      { header: "Nom", key: "proprietaireNom", width: 16 },
      { header: "Prénom", key: "proprietairePrenom", width: 16 },
      { header: "Num Enregistrement", key: "hebergementNum", width: 16 },
      { header: "Hébergement", key: "hebergementNom", width: 24 },
      { header: "Adresse", key: "hebergementAdresse1", width: 28 },
      { header: "CP", key: "hebergementCp", width: 10 },
      { header: "Ville", key: "hebergementVille", width: 18 },
      { header: "Classement", key: "hebergementClassement", width: 14 },
      { header: "Prix Nuitée", key: "prixNuitee", width: 12 },
      { header: "Nb Pers.", key: "nbPersonnes", width: 10 },
      { header: "Nb Nuitées", key: "nbNuitees", width: 10 },
      { header: "Tarif Unitaire", key: "tarifUnitaireTaxe", width: 14 },
      { header: "Montant Taxe (€)", key: "montantTaxe", width: 16 },
    ];

    // Lignes
    data.forEach((row, i) => {
      sheet.addRow({
        index: i + 1,
        ...row,
      });
    });

    // TOTALS
    const totalTaxe = data.reduce(
      (acc, row) => acc + parseFloat(row.montantTaxe || 0),
      0
    );
    const totalNuitees = data.reduce(
      (acc, row) => acc + parseFloat(row.nbNuitees || 0),
      0
    );
    const totalPers = data.reduce(
      (acc, row) => acc + parseFloat(row.nbPersonnes || 0),
      0
    );

    const totalRow = [
      "", // #
      "", // Id CARE
      "", // Nom
      "", // Prénom
      "", // Num Enregistrement
      "", // Hébergement
      "", // Adresse
      "", // CP
      "", // Ville
      "", // Classement
      "", // Prix Nuitée
      totalPers, // Nb Pers.
      totalNuitees, // Nb Nuitées
      "", // Tarif Unitaire
      totalTaxe.toFixed(2), // Montant Taxe
    ];

    // Ajoute la ligne TOTAL à la fin
    const added = sheet.addRow(totalRow);
    // Fusionne les 11 premières cellules pour le label
    sheet.mergeCells(`A${sheet.rowCount}:K${sheet.rowCount}`);
    added.getCell(1).value = "TOTAL GÉNÉRAL";
    // Style footer
    added.font = { bold: true };
    added.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBD9254" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "left" : "center",
      };
    });

    // Style en-tête
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBD9254" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Générer et télécharger
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "taxe_sejour_versement.xlsx"
    );
  }

  async function handleExportAndSend(ville) {
    const villeKey = normalizeVille(ville);
    const email = mairies[villeKey];
    if (!email) {
      alert(
        "Aucun email mairie enregistré pour cette ville (" +
          ville +
          ") (clé cherchée : " +
          villeKey +
          ")"
      );
      return;
    }

    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ville }),
    });
    const result = await res.json();
    if (result.success) {
      alert("Email envoyé à la mairie !");
    } else {
      alert("Erreur lors de l’envoi : " + (result.error || ""));
    }
  }

async function handleSendMail(hebergementId, montantTaxe) {
  setMailStatus((prev) => ({ ...prev, [hebergementId]: "loading" }));
  try {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hebergementId, montantTaxe }),
    });
    if (res.ok) {
      setMailStatus((prev) => ({ ...prev, [hebergementId]: "sent" }));
    } else {
      throw new Error("Erreur d'envoi");
    }
  } catch (err) {
    setMailStatus((prev) => ({ ...prev, [hebergementId]: "idle" }));
  }
}


  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 py-8">
      <h2 className="text-xl font-light mb-4">
        Tableau Taxe de Séjour - Cumuls par logement
      </h2>

      <div className="flex gap-3 items-center mb-6 flex-wrap">
        <label htmlFor="ville" className="text-md font-light text-gray-700">
          Filtrer par ville&nbsp;:
        </label>
        <select
          id="ville"
          className="px-3 py-2 rounded-xl bg-[#bd9254] text-white text-xs font-medium hover:bg-[#a17435] outline-none"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        >
          <option value="">Toutes</option>
          {villesAll.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        {ville && (
          <>
            <button
              className="px-3 py-2 rounded-xl hover:bg-[#bd9254] text-[#bd9254] hover:text-white text-xs font-light bg-white ml-2 border-[1px] border-#bd9254]"
              onClick={() => handleExportAndSend(ville)}
            >
              Exporter &amp; Envoyer à la mairie
            </button>
            <button
              className="ml-2 px-3 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 hover:bg-gray-200"
              onClick={() => setVille("")}
            >
              Réinitialiser
            </button>
          </>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {loading
            ? "Chargement..."
            : `${data.length} logement${data.length > 1 ? "s" : ""} affiché${
                data.length > 1 ? "s" : ""
              }`}
        </span>
        <button
          className="px-3 py-2 rounded-xl bg-[#bd9254] text-white text-xs font-medium hover:bg-[#a17435] ml-2"
          onClick={exportToExcel}
          disabled={loading || data.length === 0}
        >
          Exporter Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white w-full">
        <table className="w-full text-[10px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 whitespace-nowrap">#</th>
              <th className="px-3 py-2 whitespace-nowrap">Id CARE</th>
              <th className="px-3 py-2 whitespace-nowrap">Nom</th>
              <th className="px-3 py-2 whitespace-nowrap">Prénom</th>
              <th className="px-3 py-2 whitespace-nowrap">
                Num Enregistrement
              </th>
              <th className="px-3 py-2 whitespace-nowrap">Hébergement Nom</th>
              <th className="px-3 py-2 whitespace-nowrap">Adresse</th>
              <th className="px-3 py-2 whitespace-nowrap">CP</th>
              <th className="px-3 py-2 whitespace-nowrap">Ville</th>
              <th className="px-3 py-2 whitespace-nowrap">Classement</th>
              <th className="px-3 py-2 whitespace-nowrap">Prix Nuitée</th>
              <th className="px-3 py-2 whitespace-nowrap">Durée Séjour</th>
              <th className="px-3 py-2 whitespace-nowrap">Perception</th>
              <th className="px-3 py-2 whitespace-nowrap">Début Séjour</th>
              <th className="px-3 py-2 whitespace-nowrap">Nb Pers.</th>
              <th className="px-3 py-2 whitespace-nowrap">Nb Nuitées</th>
              <th className="px-3 py-2 whitespace-nowrap">Tarif Unitaire</th>
              <th className="px-3 py-2 whitespace-nowrap">Montant Taxe</th>
              <th className="px-3 py-2 whitespace-nowrap">Mail client</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={19} className="text-center p-6">
                  Chargement...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={19} className="text-center p-6 text-gray-400">
                  Aucun résultat pour cette ville
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const status = mailStatus[row.hebergementId] || "idle";
                return (
                  <tr
                    key={row.hebergementId}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-3 py-2 font-bold">{i + 1}</td>
                    <td className="px-3 py-2">{row.hebergementId}</td>
                    <td className="px-3 py-2">{row.proprietaireNom}</td>
                    <td className="px-3 py-2">{row.proprietairePrenom}</td>
                    <td className="px-3 py-2">{row.hebergementNum}</td>
                    <td className="px-3 py-2">{row.hebergementNom}</td>
                    <td className="px-3 py-2">{row.hebergementAdresse1}</td>
                    <td className="px-3 py-2">{row.hebergementCp}</td>
                    <td className="px-3 py-2">{row.hebergementVille}</td>
                    <td className="px-3 py-2">{row.hebergementClassement}</td>
                    <td className="px-3 py-2">{row.prixNuitee}</td>
                    <td className="px-3 py-2">{row.sejourDuree}</td>
                    <td className="px-3 py-2">{row.sejourPerception}</td>
                    <td className="px-3 py-2">{row.sejourDebut}</td>
                    <td className="px-3 py-2">{row.nbPersonnes}</td>
                    <td className="px-3 py-2">{row.nbNuitees}</td>
                    <td className="px-3 py-2">{row.tarifUnitaireTaxe} €</td>
                    <td className="px-3 py-2">{row.montantTaxe} €</td>
                    <td className="px-3 py-2">
                      <button
                        className={`px-3 py-1 border-[1px] w-20 rounded-xl text-[10px] font-medium transition-all duration-200 ${
                          status === "sent"
                            ? "bg-green-500 border-green-500 text-white cursor-default"
                            : "bg-white text-[#bd9254] border-[#bd9254] hover:bg-red-400 hover:border-red-400 hover:text-white"
                        }`}
                        disabled={status !== "idle"}
                       onClick={() => handleSendMail(row.hebergementId, row.montantTaxe)}
                      >
                        {status === "loading" ? (
                          <span className="flex items-center gap-1">
                            <FaSpinner className="animate-spin" />
                            Envoi...
                          </span>
                        ) : status === "sent" ? (
                          "OK"
                        ) : (
                          "mail client"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
