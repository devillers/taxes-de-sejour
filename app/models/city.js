// app/models/city.js
import mongoose from "mongoose";
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
});
export default mongoose.models.City || mongoose.model("City", citySchema);
