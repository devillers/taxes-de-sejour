font-light//APP/VERSEMENT-CUMULES/PAGE.JS

"use client";

import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Cumule les montants par hebergementId
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
  // Formate les montants pour l'affichage
  return Array.from(map.values()).map((row) => ({
    ...row,
    montantTaxe: Number(row.montantTaxe).toFixed(2),
    nbNuitees: row.nbNuitees,
    nbPersonnes: row.nbPersonnes,
  }));
}

export default function VersementCumulesPage() {
  const [data, setData] = useState([]);
  const [villesAll, setVillesAll] = useState([]);
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(true);
  const [mailStatus, setMailStatus] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch("/api/versement-tableau")
      .then((res) => res.json())
      .then((json) => {
        const cumules = cumulerTaxesParLogement(json);
        setData(cumules);
        const villes = Array.from(
          new Set(cumules.map((row) => row.hebergementVille).filter(Boolean))
        ).sort();
        setVillesAll(villes);
      })
      .catch(() => {
        setData([]);
        setVillesAll([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrage par ville
  const dataFiltree = ville
    ? data.filter((row) => row.hebergementVille === ville)
    : data;

  // Totaux pour le tableau (cumul général filtré)
  const totalTaxe = dataFiltree.reduce(
    (acc, row) => acc + parseFloat(row.montantTaxe || 0),
    0
  );
  const totalNuitees = dataFiltree.reduce(
    (acc, row) => acc + parseFloat(row.nbNuitees || 0),
    0
  );
  const totalPers = dataFiltree.reduce(
    (acc, row) => acc + parseFloat(row.nbPersonnes || 0),
    0
  );

  // Export Excel AVEC le filtre ville actif
  // async function exportToExcel() {
  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet("Taxes cumulées");
  //   sheet.columns = [
  //     { header: "#", key: "index", width: 5 },
  //     { header: "Id CARE", key: "hebergementId", width: 20 },
  //     { header: "Prénom", key: "proprietairePrenom", width: 14 },
  //     { header: "Nom", key: "proprietaireNom", width: 14 },
  //     { header: "Num Enregistrement", key: "hebergementNum", width: 16 },
  //     { header: "Hébergement Nom", key: "hebergementNom", width: 24 },
  //     { header: "Adresse", key: "hebergementAdresse1", width: 28 },
  //     { header: "CP", key: "hebergementCp", width: 10 },
  //     { header: "Ville", key: "hebergementVille", width: 18 },
  //     { header: "Classement", key: "taxNom", width: 14 },
  //     { header: "Prix Nuitée", key: "prixNuitee", width: 12 },
  //     { header: "Durée Séjour", key: "sejourDuree", width: 14 },
  //     { header: "Perception", key: "sejourPerception", width: 14 },
  //     { header: "Début Séjour", key: "sejourDebut", width: 14 },
  //     { header: "Fin Séjour", key: "sejourFin", width: 14 },
  //     { header: "Nb Pers.", key: "nbPersonnes", width: 10 },
  //     { header: "Nb Nuitées", key: "nbNuitees", width: 10 },
  //     { header: "Tarif Unitaire", key: "tarifUnitaireTaxe", width: 14 },
  //     { header: "Montant Taxe (€)", key: "montantTaxe", width: 16 },
  //     { header: "Email", key: "proprietaireEmail", width: 24 },
  //   ];
  //   dataFiltree.forEach((row, i) => {
  //     sheet.addRow({ index: i + 1, ...row });
  //   });
  //   // Ligne des totaux
  //   const totalRow = [
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     totalPers,
  //     totalNuitees,
  //     "",
  //     totalTaxe.toFixed(2),
  //     "",
  //   ];
  //   const added = sheet.addRow(totalRow);
  //   sheet.mergeCells(`A${sheet.rowCount}:O${sheet.rowCount}`);
  //   added.font = { bold: true };
  //   added.eachCell((cell) => {
  //     cell.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FFBD9254" },
  //     };
  //     cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  //     cell.alignment = { vertical: "middle", horizontal: "center" };
  //   });
  //   sheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  //     cell.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FFBD9254" },
  //     };
  //     cell.alignment = { vertical: "middle", horizontal: "center" };
  //   });
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   saveAs(
  //     new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     }),
  //     `taxe_sejour_cumules${ville ? `_${ville}` : ""}.xlsx`
  //   );
  // }

  //   async function exportToExcel() {
  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet("Liste des hébergements");

  //   // Ligne 1 : Titre
  //   sheet.mergeCells("A1:H1");
  //   const titleCell = sheet.getCell("A1");
  //   titleCell.value = "CARE CONCIERGE _ Liste des hébergements";
  //   titleCell.font = { bold: true, size: 16 };
  //   titleCell.alignment = { vertical: "middle", horizontal: "center" };

  //   // Ligne 2 : Groupes principaux
  //   sheet.mergeCells("A2:D2"); // HÉBERGEMENT
  //   sheet.mergeCells("E2:F2"); // PROPRIÉTAIRE
  //   sheet.mergeCells("G2:I2"); // MANDAT
  //   sheet.getCell("A2").value = "HÉBERGEMENT";
  //   sheet.getCell("E2").value = "PROPRIÉTAIRE";
  //   sheet.getCell("G2").value = "MANDAT";

  //   // Ligne 3 : Sous-colonnes
  //   const headers = [
  //     "Nom Log.",
  //     "Adresse",
  //     "Commune",
  //     "n° enreg.",
  //     "NOM",
  //     "Prénom",
  //     "EXCLUSIF ou SIMPLE",
  //     "Début",
  //     "Fin"
  //   ];
  //   sheet.getRow(3).values = [, ...headers]; // Décalage car ExcelJS commence à 1

  //   // Mise en forme des en-têtes
  //   [2, 3].forEach(rowNum => {
  //     const row = sheet.getRow(rowNum);
  //     row.eachCell(cell => {
  //       cell.font = { bold: true };
  //       cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  //       cell.fill = {
  //         type: "pattern",
  //         pattern: "solid",
  //         fgColor: { argb: "FFD3D3D3" }
  //       };
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" }
  //       };
  //     });
  //   });

  //   // Largeurs des colonnes
  //   sheet.columns = [
  //     { width: 20 }, // Nom Log.
  //     { width: 30 }, // Adresse
  //     { width: 18 }, // Commune
  //     { width: 20 }, // n° enreg.
  //     { width: 16 }, // NOM
  //     { width: 16 }, // Prénom
  //     { width: 22 }, // EXCLUSIF ou SIMPLE
  //     { width: 14 }, // Début
  //     { width: 14 }, // Fin
  //   ];

  //   // Insertion des données
  //   dataFiltree.forEach((row, i) => {
  //     sheet.addRow([
  //       row.hebergementNom,
  //       row.hebergementAdresse1,
  //       row.hebergementVille,
  //       row.hebergementNum,
  //       row.proprietaireNom,
  //       row.proprietairePrenom,
  //       row.mandatType || "", // EXCLUSIF ou SIMPLE
  //       row.mandatDebut || "",
  //       row.mandatFin || "",
  //     ]);
  //   });

  //   // Génération du fichier
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   saveAs(
  //     new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //     }),
  //     "liste_hebergements_care.xlsx"
  //   );
  // }

  async function exportToExcel(ville) {
    const workbook = new ExcelJS.Workbook();
    const sheet =
      ville === "Chamonix-Mont-Blanc"
        ? workbook.addWorksheet("Liste des hébergements")
        : workbook.addWorksheet("Taxes cumulées");

    if (ville === "Chamonix-Mont-Blanc") {
      // === MODÈLE CHAMONIX : Liste des hébergements ===
      sheet.mergeCells("A1:I1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = "CARE CONCIERGE _ Liste des hébergements";
      titleCell.font = { bold: true, size: 16 };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };

      sheet.mergeCells("A2:D2");
      sheet.mergeCells("E2:F2");
      sheet.mergeCells("G2:I2");
      sheet.getCell("A2").value = "HÉBERGEMENT";
      sheet.getCell("E2").value = "PROPRIÉTAIRE";
      sheet.getCell("G2").value = "MANDAT";

      const headers = [
        "Nom Log.",
        "Adresse",
        "Commune",
        "n° enreg.",
        "NOM",
        "Prénom",
        "EXCLUSIF ou SIMPLE",
        "Début",
        "Fin",
      ];
      sheet.getRow(3).values = [, ...headers];

      [2, 3].forEach((rowNum) => {
        const row = sheet.getRow(rowNum);
        row.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      sheet.columns = [
        { width: 20 },
        { width: 30 },
        { width: 18 },
        { width: 20 },
        { width: 16 },
        { width: 16 },
        { width: 22 },
        { width: 14 },
        { width: 14 },
      ];

      dataFiltree.forEach((row) => {
        sheet.addRow([
          row.hebergementNom,
          row.hebergementAdresse1,
          row.hebergementVille,
          row.hebergementNum,
          row.proprietaireNom,
          row.proprietairePrenom,
          row.mandatType || "",
          row.mandatDebut || "",
          row.mandatFin || "",
        ]);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `liste_hebergements_chamonix.xlsx`
      );
    } else {
      // === MODÈLE AUTRES VILLES : Taxes cumulées ===
      sheet.columns = [
        { header: "#", key: "index", width: 5 },
        { header: "Id CARE", key: "hebergementId", width: 20 },
        { header: "Prénom", key: "proprietairePrenom", width: 14 },
        { header: "Nom", key: "proprietaireNom", width: 14 },
        { header: "Num Enregistrement", key: "hebergementNum", width: 16 },
        { header: "Hébergement Nom", key: "hebergementNom", width: 24 },
        { header: "Adresse", key: "hebergementAdresse1", width: 28 },
        { header: "CP", key: "hebergementCp", width: 10 },
        { header: "Ville", key: "hebergementVille", width: 18 },
        { header: "Classement", key: "taxNom", width: 14 },
        { header: "Prix Nuitée", key: "prixNuitee", width: 12 },
        { header: "Durée Séjour", key: "sejourDuree", width: 14 },
        { header: "Perception", key: "sejourPerception", width: 14 },
        { header: "Début Séjour", key: "sejourDebut", width: 14 },
        { header: "Fin Séjour", key: "sejourFin", width: 14 },
        { header: "Nb Pers.", key: "nbPersonnes", width: 10 },
        { header: "Nb Nuitées", key: "nbNuitees", width: 10 },
        { header: "Tarif Unitaire", key: "tarifUnitaireTaxe", width: 14 },
        { header: "Montant Taxe (€)", key: "montantTaxe", width: 16 },
        { header: "Email", key: "proprietaireEmail", width: 24 },
      ];

      dataFiltree.forEach((row, i) => {
        sheet.addRow({ index: i + 1, ...row });
      });

      const totalRow = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        totalPers,
        totalNuitees,
        "",
        totalTaxe.toFixed(2),
        "",
      ];
      const added = sheet.addRow(totalRow);
      sheet.mergeCells(`A${sheet.rowCount}:O${sheet.rowCount}`);
      added.font = { bold: true };
      added.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFBD9254" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFBD9254" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `taxe_sejour_cumules${ville ? `_${ville}` : ""}.xlsx`
      );
    }
  }

  // Envoi du rapport mairie (Excel) pour la ville filtrée
  async function handleExportAndSend(ville) {
    const res = await fetch("/api/export-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ville,
        rows: dataFiltree,
      }),
    });
    const result = await res.json();
    if (result.success) {
      alert("Email envoyé à la mairie !");
    } else {
      alert("Erreur lors de l’envoi : " + (result.error || ""));
    }
  }

  // Envoi du mail cumul au propriétaire (inchangé)
  async function handleSendMail(row) {
    setMailStatus((prev) => ({ ...prev, [row.hebergementId]: "loading" }));
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: row.ownerId,
          email: row.proprietaireEmail,
          montantTaxe: row.montantTaxe,
          hebergementNom: row.hebergementNom,
        }),
      });
      if (res.ok) {
        setMailStatus((prev) => ({ ...prev, [row.hebergementId]: "sent" }));
      } else {
        setMailStatus((prev) => ({ ...prev, [row.hebergementId]: "idle" }));
      }
    } catch (err) {
      setMailStatus((prev) => ({ ...prev, [row.hebergementId]: "idle" }));
    }
  }

  //Separation en bloc de 3

  function splitInBlocksOf3(str) {
    if (typeof str !== "string") return str;
    // Supprime tous les espaces
    const cleaned = str.replace(/\s+/g, "");
    // Split en blocs de 3 caractères
    return cleaned.match(/.{1,3}/g)?.join(" ") || cleaned;
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">Tableau Taxe de Séjour (cumul)</h2>
      {/* <div className="flex gap-3 items-center mb-6 flex-wrap">
        <label htmlFor="ville" className="text-md font-light text-gray-700">
          Filtrer par ville&nbsp;:
        </label>
        <select
          id="ville"
          className="px-5 py-2 border border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-sm outline-none"
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
        <button
          className="px-3 py-2 rounded-xl bg-[#bd9254] text-white text-xs font-medium hover:bg-[#a17435]"
          onClick={exportToExcel}
          disabled={loading || dataFiltree.length === 0}
        >
          Exporter Excel
        </button>
        {ville && (
          <button
            className="ml-2 px-3 py-2 rounded-xl border border-[#bd9254] bg-white text-[#bd9254] text-xs font-light hover:bg-[#a17435] hover:text-white"
            onClick={() => handleExportAndSend(ville)}
          >
            Envoyer rapport mairie
          </button>
        )}
        <button
          className="ml-2 px-3 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 hover:bg-gray-200"
          onClick={() => setVille("")}
        >
          Réinitialiser
        </button>
        <span className="ml-auto text-xs text-gray-400">
          {loading
            ? "Chargement..."
            : `${dataFiltree.length} résultat${
                dataFiltree.length > 1 ? "s" : ""
              }`}
        </span>
      </div> */}
      <div className="flex gap-3 items-center mb-6 flex-wrap">
        <label htmlFor="ville" className="text-md font-light text-gray-700">
          Filtrer par ville&nbsp;:
        </label>

        <select
          id="ville"
          className="px-5 py-2 border border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-sm outline-none"
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

        <button
          onClick={() => exportToExcel(ville)}
          disabled={loading || dataFiltree.length === 0}
          className="px-4 py-2 rounded-xl bg-[#bd9254] text-white text-xs font-semibold hover:bg-[#a17435] transition"
        >
          Exporter Excel
        </button>

        {ville && (
          <button
            className="px-4 py-2 rounded-xl border border-[#bd9254] bg-white text-[#bd9254] text-xs font-light hover:bg-[#a17435] hover:text-white transition"
            onClick={() => handleExportAndSend(ville)}
          >
            Envoyer rapport mairie
          </button>
        )}

        <button
          onClick={() => setVille("")}
          className="px-4 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 transition"
        >
          Réinitialiser
        </button>

        <span className="ml-auto text-xs text-gray-400">
          {loading
            ? "Chargement..."
            : `${dataFiltree.length} résultat${
                dataFiltree.length > 1 ? "s" : ""
              }`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white w-full">
        <table className="w-full text-[10px]">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="px-3 py-5 whitespace-nowrap font-light">#</th>
              <th className="px-3  whitespace-nowrap font-light">Id CARE</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Prénom</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Nom</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Num Enregistrement</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Hébergement Nom</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Adresse</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">CP</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Ville</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Classement</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Prix Nuitée</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Durée Séjour</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Perception</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Début Séjour</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Fin Séjour</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Nb Pers.</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Nb Nuitées</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Tarif Unitaire</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Montant Taxe</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Mandat</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Début</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Fin</th>
              <th className="px-3 py-2 whitespace-nowrap font-light">Mail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={20} className="text-center p-6">
                  <FaSpinner className="animate-spin inline" /> Chargement...
                </td>
              </tr>
            ) : dataFiltree.length === 0 ? (
              <tr>
                <td colSpan={20} className="text-center p-6 text-gray-400">
                  Aucun résultat
                </td>
              </tr>
            ) : (
              dataFiltree.map((row, i) => {
                const status = mailStatus[row.hebergementId] || "idle";
                return (
                  <tr key={row.hebergementId}>
                    <td className="px-3 py-3 font-bold">{i + 1}</td>
                    <td className="px-3 py-3">{row.hebergementId}</td>
                    <td className="px-3 py-3">{row.proprietairePrenom}</td>
                    <td className="px-3 py-3">{row.proprietaireNom}</td>
                    <td className="px-2 py-3 text-[#bd9254] font-light  italic">
                      {splitInBlocksOf3(row.hebergementNum)}
                    </td>
                    <td className="px-3 py-3">{row.hebergementNom}</td>
                    <td className="px-3 py-3">{row.hebergementAdresse1}</td>
                    <td className="px-3 py-3">{row.hebergementCp}</td>
                    <td className="px-3 py-3">{row.hebergementVille}</td>
                    <td className="px-3 py-3">{row.taxNom}</td>
                    <td className="px-3 py-3">{row.prixNuitee} €</td>
                    <td className="px-3 py-3">{row.sejourDuree}</td>
                    <td className="px-3 py-3">{row.sejourPerception}</td>
                    <td className="px-3 py-3">{row.sejourDebut}</td>
                    <td className="px-3 py-3">{row.sejourFin}</td>
                    <td className="px-3 py-3">{row.nbPersonnes}</td>
                    <td className="px-3 py-3">{row.nbNuitees}</td>
                    <td className="px-3 py-3">{row.tarifUnitaireTaxe} €</td>
                    <td className="px-3 py-3">{row.montantTaxe} €</td>

                    <td className="px-2 py-3">
                      {row.mandatType || (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      {row.mandatDebut ? (
                        new Date(row.mandatDebut).toLocaleDateString()
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 font-light">
                      {row.mandatFin === "Tacite" ? (
                        "Tacite"
                      ) : row.mandatFin ? (
                        new Date(row.mandatFin).toLocaleDateString()
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        className={`px-3 py-1 border-[1px] rounded-xl text-xs font-medium transition-all duration-200 ${
                          status === "sent"
                            ? "bg-green-500 border-green-500 text-white cursor-default"
                            : "bg-white text-[#bd9254] border-[#bd9254] hover:bg-red-400 hover:border-red-400 hover:text-white"
                        }`}
                        disabled={status !== "idle"}
                        onClick={() => handleSendMail(row)}
                      >
                        {status === "loading" ? (
                          <span className="flex items-center gap-1">
                            <FaSpinner className="animate-spin" />
                            Envoi...
                          </span>
                        ) : status === "sent" ? (
                          "envoyé"
                        ) : (
                          "email"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            {/* LIGNE TOTAL */}
            {!loading && dataFiltree.length > 0 && (
              <tr className="font-bold bg-[#fff8ef]">
                <td colSpan={15} className="text-right">
                  TOTAL :
                </td>
                <td>{totalPers}</td>
                <td>{totalNuitees}</td>
                <td />
                <td>{totalTaxe.toFixed(2)} €</td>
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
