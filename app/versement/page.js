//app/versement/page.j

"use client";

import { useEffect, useState } from "react";
import { normalizeVille, mairies } from "../lib/mairies";
import { FaSpinner } from "react-icons/fa";

export default function TaxeTableau() {
  console.log("TaxeTableau rendu !");
  const [data, setData] = useState([]);
  const [villesAll, setVillesAll] = useState([]);
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(true);
  const [mailStatus, setMailStatus] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/versement-tableau${
        ville ? `?ville=${encodeURIComponent(ville)}` : ""
      }`
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json && Array.isArray(json)) {
          const allVilles = Array.from(
            new Set(json.map((row) => row.hebergementVille).filter(Boolean))
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

  // Envoi du rapport mairie (Excel)
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



  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">Tableau Taxe de Séjour</h2>

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
        {ville && (
          <>
            <button
              className="px-2 py-1 border-[1px] border-[#bd9254] bg-white text-[#bd9254] rounded-xl text-xs hover:bg-[#a17435] hover:text-white font-light"
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
            : `${data.length} résultat${data.length > 1 ? "s" : ""}`}
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
                console.log("Row:", row);
                const status = mailStatus[row.hebergementId] || "idle";
                return (
                  <tr
                    key={row.hebergementId + i}
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
                        //disabled={status !== "idle"}
                        onClick={() => handleSendMail(row)}
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
