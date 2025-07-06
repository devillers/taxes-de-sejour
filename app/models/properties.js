// app/models/properties.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  ownerId:   { type: String, required: true, trim: true },    // "Id Propriétaires"
  code:      { type: String, trim: true },                    // "Code"
  etat:      { type: String, trim: true },                    // "État"
  logement:  { type: String, trim: true },                    // "Logement"
  type:      { type: String, trim: true },                    // "Type"
  capacite:  { type: Number },                                // "Capacité totale"
  tarif:     { type: String, trim: true },                    // "Tarif"
  edifice:   { type: String, trim: true },                    // "Édifice"
  galerie:   { type: String, trim: true },                    // "Regrouper par Galerie Photos"
  localite:  { type: String, trim: true },                    // "Localité"
  quartier:  { type: String, trim: true },                    // "Quartier"
  codePostal:{ type: String, trim: true },                    // "Code postal"
  typeVoie:  { type: String, trim: true },                    // "Type de voie"
  adresse:   { type: String, trim: true },                    // "Adresse"
  numero:    { type: String, trim: true },                    // "Numéro"
  escalier:  { type: String, trim: true },                    // "Escalier"
  etage:     { type: String, trim: true },                    // "Étage"
  porte:     { type: String, trim: true },                    // "Porte"
  proprietaire:             { type: String, trim: true },     // "Propriétaire"
  registreTouristique:      { type: String, trim: true },     // "Numéro de registre touristique"
  commentaires:             { type: String, trim: true },     // "Commentaires additionnels"
  referenceCadastrale:      { type: String, trim: true },     // "Référence cadastrale"
}, {
  timestamps: true,
});

export default mongoose.models.Property ||
  mongoose.model('Property', propertySchema);
