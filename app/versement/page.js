


// app/versement/page.js

"use client";
import { useEffect, useState } from "react";
import { normalizeVille, mairies } from "../lib/mairies";

export default function TaxeTableau() {
  const [data, setData] = useState([]);
  const [villesAll, setVillesAll] = useState([]); // Toutes les villes dispos
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(true);

  // Charger le tableau (filtré ou non)
  useEffect(() => {
    setLoading(true);
    console.log("Appel de l’API pour la ville :", ville);
    fetch(`/api/versement-tableau${ville ? `?ville=${encodeURIComponent(ville)}` : ""}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        // On calcule toutes les villes distinctes du backend (utile même si un filtre est actif)
        if (json && Array.isArray(json)) {
          const allVilles = Array.from(new Set(json.map((row) => row.hebergementVille).filter(Boolean)));
          setVillesAll(allVilles);
        }
        console.log("Données reçues côté front :", json);
      })
      .catch((err) => {
        setData([]);
        setVillesAll([]);
        console.error("Erreur API versement-tableau :", err);
      })
      .finally(() => setLoading(false));
  }, [ville]);

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
        <label htmlFor="ville" className="text-lg font-semibold text-gray-700">
          Filtrer par ville&nbsp;:
        </label>
        <select
          id="ville"
          className="ml-0 sm:ml-2 px-4 py-2 rounded-xl text-xs font-medium"
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
          <button
            className="ml-0 sm:ml-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-medium hover:bg-orange-700"
            onClick={() => handleExportAndSend(ville)}
          >
            Exporter &amp; Envoyer à la mairie
          </button>
        )}
        {ville && (
          <button
            className="ml-2 px-3 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 hover:bg-gray-200"
            onClick={() => setVille("")}
          >
            Réinitialiser
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {loading ? "Chargement..." : `${data.length} résultat${data.length > 1 ? "s" : ""}`}
        </span>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-white border border-gray-200">
        <table className="min-w-full text-xs text-gray-800">
          <thead className="bg-gray-100">
            <tr>
               <th className="px-3 py-2 whitespace-nowrap">#</th>
              <th className="px-3 py-2 whitespace-nowrap">Hébergement Id CARECONCIERGE</th>
              <th className="px-3 py-2 whitespace-nowrap">Propriétaire Nom</th>
              <th className="px-3 py-2 whitespace-nowrap">Propriétaire Prénom</th>
              <th className="px-3 py-2 whitespace-nowrap">Hébergement Num</th>
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
            </tr>
          </thead>
         <tbody>
  {loading ? (
    <tr><td colSpan={18} className="text-center p-6">Chargement...</td></tr>
  ) : data.length === 0 ? (
    <tr>
      <td colSpan={18} className="text-center p-6 text-gray-400">
        Aucun résultat pour cette ville
      </td>
    </tr>
  ) : (
    data.map((row, i) => (
      <tr key={row.hebergementId + i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className="px-3 py-2 whitespace-nowrap font-bold">{i + 1}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementId}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.proprietaireNom}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.proprietairePrenom}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementNum}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementNom}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementAdresse1}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementCp}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementVille}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.hebergementClassement}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.prixNuitee}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.sejourDuree}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.sejourPerception}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.sejourDebut}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.nbPersonnes}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.nbNuitees}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.tarifUnitaireTaxe}</td>
        <td className="px-3 py-2 whitespace-nowrap">{row.montantTaxe}</td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

