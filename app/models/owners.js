import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  id: String,
  prenom: String,
  nom: String,
  adresse: String,
  codePostal: String,
  ville: String,
  email: String,
  telephone: String,
  siret: String,
  mandat: String,
}, {
  timestamps: true,
});

export default mongoose.models.Owner || mongoose.model("Owner", ownerSchema);
