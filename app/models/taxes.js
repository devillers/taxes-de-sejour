// app/models/taxes.js

import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  hebergementId: {
    type: String,
    required: true,
    index: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  datePerception: {
    type: String,
    required: false,
  },
  debutSejour: {
    type: String,
    required: true,
    index: true,
  },
  nbrePersonnes: {
    type: Number,
    required: false,
  },
  nbreNuitees: {
    type: Number,
    required: false,
  },
  tarifUnitaire: {
    type: Number,
    required: false,
  },
}, {
  timestamps: true,
});

// Prevent model recompilation in dev
const Tax = mongoose.models.Tax || mongoose.model('Tax', taxSchema);
export default Tax;
