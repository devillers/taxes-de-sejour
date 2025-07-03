// app/models/accommodations.js

import mongoose from 'mongoose';
import './owners.js'; // 👈 Ceci enregistre le modèle Owner dans Mongoose


const accommodationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }, // <--- clé étrangère
  code: String,
  etat: String,
  logement: String,
  type: String,
  capaciteTotale: Number,
  tarif: String,
  edifice: String,
  regrouperParGalerie: String,
  localite: { type: String, trim: true },
  quartier: String,
  codePostal: String,
  typeVoie: String,
  adresse: String,
  numero: String,
  escalier: String,
  etage: String,
  porte: String,
  nomProprietaire: String,
  numeroRegistreTouristique: String,
  commentairesAdditionnels: String,
  referenceCadastrale: String,
  // Champs fournis par le fichier taxeDeSejour (pas présents dans le CSV d'origine)
  prixNuitee: Number,
  sejourDuree: Number,
  sejourPerception: String,
  sejourDebut: Date,
  nbPersonnes: Number,
  nbNuitees: Number,
  tarifUnitaireTaxe: Number,
  montantTaxe: Number,
}, {
  timestamps: true,
});

export default mongoose.models.Accommodation || mongoose.model('Accommodation', accommodationSchema);
