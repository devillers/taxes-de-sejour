// app/models/owners.js

import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    prenom: { type: String, trim: true },
    nom: { type: String, trim: true },
    nomLogement: { type: String, trim: true },
    adresse: { type: String, trim: true },
    codePostal: { type: String, trim: true },
    ville: { type: String, trim: true },
    pays: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    telephone: { type: String, trim: true },
    siret: { type: String, trim: true },
    registreTouristique:      { type: String, trim: true }, 
    emailIntranet: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Owner || mongoose.model("Owner", ownerSchema);
