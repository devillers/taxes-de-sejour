// app/models/accommodations.js

import mongoose from 'mongoose';

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
}, {
  timestamps: true,
});

export default mongoose.models.Accommodation || mongoose.model('Accommodation', accommodationSchema);
