//app/lib/taxe-data.js


import { connectDb } from "../lib/db";
import TaxImport from "../models/taxes";
import Property from "../models/properties";
import Owner from "../models/owners";

export async function getTaxeDataByVille(ville) {
  await connectDb();

  // Si pas de ville, on prend TOUTES les properties
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
    proprietaireNom: owner.nom || "",
    proprietairePrenom: owner.prenom || "",
    proprietaireEmail: owner.email || "",     // <-- ICI
    hebergementNum: property.registreTouristique || "",
    hebergementNom: property.logement || "",
    hebergementAdresse1: property.adresse || "",
    hebergementCp: property.codePostal || "",
    hebergementVille: property.localite || "",
    hebergementClassement: property.type || "",
    prixNuitee: property.tarif || "",
    sejourDuree: tax.nuits || "",
    sejourPerception: tax.datePaiement || "",
    sejourDebut: tax.dateArrivee || "",
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
