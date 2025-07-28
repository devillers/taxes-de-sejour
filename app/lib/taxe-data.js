//app/lib/taxe-data.js


import { connectDb } from "../lib/db";
import TaxImport from "../models/taxes";
import Property from "../models/properties";
import Owner from "../models/owners";

export async function getTaxeDataByVille(ville) {
  await connectDb();

  const properties = ville
    ? await Property.find({
        localite: { $regex: `^${escapeRegex(ville)}$`, $options: "i" }
      }).lean()
    : await Property.find({}).lean();

  if (!properties.length) return [];

  const propertyLogements = properties.map((p) => p.logement);
  const taxes = await TaxImport.find({ logement: { $in: propertyLogements } }).lean();

  const owners = await Owner.find({}).lean();
  const ownersById = Object.fromEntries(owners.map(o => [o.ownerId, o]));
  const propertiesByLogement = Object.fromEntries(properties.map(p => [p.logement, p]));

  const tableau = taxes.map(tax => {
    const property = propertiesByLogement[tax.logement] || {};
    const owner = ownersById[property.ownerId] || {};

    return {
      hebergementId: property.code || "",
      ownerId: property.ownerId || "",
      proprietaireNom: owner.nom || "",       // <-- NOM du propriétaire
      proprietairePrenom: owner.prenom || "", // <-- PRENOM du propriétaire
      proprietaireEmail: owner.email || "",   // <-- EMAIL du propriétaire
      hebergementNum: property.registreTouristique || "",
      hebergementNom: property.logement || "",
      hebergementAdresse1: property.adresse || "",
      hebergementCp: property.codePostal || "",
      hebergementVille: property.localite || "",
      taxNom: tax.nom || "Non classé", // <-- champ nom de la table taxe, fiable pour "Classement"
      hebergementClassement: property.classement || "Non classé", // <-- champ classement de la fiche logement (optionnel, pour debug/compare)
      prixNuitee: tax.prixNuitee || "",
      sejourDuree: tax.nuits || "",
      sejourPerception: tax.datePaiement || "",
      sejourDebut: tax.dateArrivee || "",
      sejourFin: tax.dateDepart || "",
      nbPersonnes: (tax.adultes || 0) + (tax.enfants || 0) + (tax.bebes || 0),
      nbNuitees: tax.nuits || "",
      tarifUnitaireTaxe: tax.montant && tax.nuits
        ? (tax.montant / tax.nuits).toFixed(2)
        : "",
      montantTaxe: tax.montant || "",
    };
  });

  return tableau;
}

// Escape util
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
