// app/models/taxes.js

import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  reservationId:    { type: String, required: true, index: true },
  nom:              { type: String },
  logement:         { type: String },
  montant:          { type: Number },
  datePaiement:     { type: String },
  proprietaire:     { type: String },
  dateArrivee:      { type: String },
  dateDepart:       { type: String },
  nuits:            { type: Number },
  adultes:          { type: Number },
  enfants:          { type: Number },
  bebes:            { type: Number },
  typeReservation:  { type: String },
}, { timestamps: true });

// 👇 Change "Tax" → "TaxImport" juste pour forcer le cache
export default mongoose.models.TaxImport || mongoose.model('TaxImport', taxSchema);
