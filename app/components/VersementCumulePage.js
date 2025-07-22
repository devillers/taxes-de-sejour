"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { normalizeVille, mairies } from "../lib/mairies";


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

  const { data: session, status: sessionStatus } = useSession();
  const isAdmin = session?.user?.role === "admin";

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
  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Taxes cumulées");
    sheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Id CARE", key: "hebergementId", width: 20 },
      { header: "Nom", key: "proprietaireNom", width: 16 },
      { header: "Prénom", key: "proprietairePrenom", width: 16 },
      { header: "Num Enregistrement", key: "hebergementNum", width: 16 },
      { header: "Hébergement Nom", key: "hebergementNom", width: 24 },
      { header: "Adresse", key: "hebergementAdresse1", width: 28 },
      { header: "CP", key: "hebergementCp", width: 10 },
      { header: "Ville", key: "hebergementVille", width: 18 },
      { header: "Classement", key: "hebergementClassement", width: 14 },
      { header: "Prix Nuitée", key: "prixNuitee", width: 12 },
      { header: "Durée Séjour", key: "sejourDuree", width: 14 },
      { header: "Perception", key: "sejourPerception", width: 14 },
      { header: "Début Séjour", key: "sejourDebut", width: 14 },
      { header: "Nb Pers.", key: "nbPersonnes", width: 10 },
      { header: "Nb Nuitées", key: "nbNuitees", width: 10 },
      { header: "Tarif Unitaire", key: "tarifUnitaireTaxe", width: 14 },
      { header: "Montant Taxe (€)", key: "montantTaxe", width: 16 },
      { header: "Email", key: "proprietaireEmail", width: 24 },
    ];
    dataFiltree.forEach((row, i) => {
      sheet.addRow({ index: i + 1, ...row });
    });
    // Ligne des totaux
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

  // Envoi du rapport mairie (Excel) pour la ville filtrée
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
    const res = await fetch("/api/export-mail", {
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

  // GESTION SÉCURITÉ UI
  if (sessionStatus === "loading") {
    return (
      <div className="w-full text-center py-16 text-gray-400">
        <FaSpinner className="animate-spin inline mr-2" /> Vérification de la session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full flex flex-col items-center py-16">
        <div className="mb-4 text-lg text-gray-500">Veuillez vous connecter pour accéder au tableau.</div>
        <button
          className="px-5 py-2 rounded-xl bg-[#bd9254] text-white text-sm font-medium"
          onClick={() => signIn()}
        >
          Se connecter
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="w-full flex flex-col items-center py-16">
        <div className="mb-4 text-red-500 text-xl font-bold">
          Accès réservé à l'administrateur
        </div>
        <button
          className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-sm mt-4"
          onClick={() => signOut()}
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  // RENDU POUR ADMIN UNIQUEMENT
  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">
        Tableau Taxe de Séjour (cumul)
      </h2>
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
            : `${dataFiltree.length} résultat${dataFiltree.length > 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white w-full">
        <table className="w-full text-[10px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 whitespace-nowrap">#</th>
              <th className="px-3 py-2 whitespace-nowrap">Id CARE</th>
              <th className="px-3 py-2 whitespace-nowrap">Nom</th>
              <th className="px-3 py-2 whitespace-nowrap">Prénom</th>
              <th className="px-3 py-2 whitespace-nowrap">Num Enregistrement</th>
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
              <th className="px-3 py-2 whitespace-nowrap">Mail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={19} className="text-center p-6">
                  <FaSpinner className="animate-spin inline" /> Chargement...
                </td>
              </tr>
            ) : dataFiltree.length === 0 ? (
              <tr>
                <td colSpan={19} className="text-center p-6 text-gray-400">
                  Aucun résultat
                </td>
              </tr>
            ) : (
              dataFiltree.map((row, i) => {
                const status = mailStatus[row.hebergementId] || "idle";
                return (
                  <tr key={row.hebergementId}>
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
                      {/* ---- SEUL ADMIN VOIT LE BOUTON ---- */}
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
