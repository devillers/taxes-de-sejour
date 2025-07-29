

// // app/api/owners/route.js
// import { NextResponse } from "next/server";
// import Owner from "../../models/owners";
// import Property from "../../models/properties";
// import { connectDb } from "../../lib/db";

// // GET: Liste tous les propriétaires
// export async function GET(req) {
//   await connectDb();
//   const owners = await Owner.find({}).lean();
//   const properties = await Property.find({}).lean();

//   // Index properties par ownerId pour jointure
//   const propMap = {};
//   for (const p of properties) {
//     if (p.ownerId && !propMap[p.ownerId]) propMap[p.ownerId] = p;
//   }

//   const merged = owners.map((o) => ({
//     ...o,
//     nomLogement: o.nomLogement || propMap[o.ownerId]?.logement || "",
//     registreTouristique: o.registreTouristique || propMap[o.ownerId]?.registreTouristique || "",
//   }));

//   return NextResponse.json(merged);
// }

// // PUT: Met à jour un propriétaire (depuis OwnerModal)
// export async function PUT(req) {
//   await connectDb();
//   const data = await req.json();
//   const { _id, ...fields } = data;
//   if (!_id) {
//     return NextResponse.json({ error: "ID propriétaire manquant" }, { status: 400 });
//   }

//   // Seuls ces champs sont éditables
//   const updatable = [
//     "prenom",
//     "nom",
//     "nomLogement",
//     "registreTouristique",
//     "adresse",
//     "codePostal",
//     "ville",
//     "pays",
//     "email",
//     "telephone",
//     "siret",
//   ];
//   const update = {};
//   updatable.forEach((k) => { if (k in fields) update[k] = fields[k]; });

//   // Met à jour Owner
//   const owner = await Owner.findByIdAndUpdate(_id, update, { new: true, runValidators: true }).lean();
//   if (!owner) return NextResponse.json({ error: "Propriétaire non trouvé" }, { status: 404 });

//   // SYNC automatique dans Property si besoin
//   const propUpdate = {};
//   if ("nomLogement" in update) propUpdate.logement = update.nomLogement;
//   if ("registreTouristique" in update) propUpdate.registreTouristique = update.registreTouristique;

//   if (Object.keys(propUpdate).length > 0) {
//     await Property.updateMany({ ownerId: owner.ownerId }, { $set: propUpdate });
//   }

//   return NextResponse.json(owner);
// }

// // POST: Crée un nouveau propriétaire
// export async function POST(req) {
//   await connectDb();
//   const data = await req.json();

//   // Création du Owner
//   const owner = await Owner.create(data);

//   // Crée aussi une Property associée si besoin
//   if (data.ownerId && (data.nomLogement || data.registreTouristique)) {
//     await Property.create({
//       ownerId: data.ownerId,
//       logement: data.nomLogement || "",
//       registreTouristique: data.registreTouristique || "",
//     });
//   }

//   return NextResponse.json(owner);
// }

// // DELETE: Supprime un propriétaire (et optionnellement ses logements)
// export async function DELETE(req) {
//   await connectDb();
//   const { id } = await req.json();
//   const owner = await Owner.findByIdAndDelete(id);
//   // Option : supprimer aussi ses logements associés si besoin
//   // await Property.deleteMany({ ownerId: owner.ownerId });
//   return NextResponse.json({ success: true });
// }


// /app/api/owners/route.js

import { NextResponse } from "next/server";
import Owner from "../../models/owners";
import Property from "../../models/properties";
import { connectDb } from "../../lib/db";

// GET: Liste tous les propriétaires
export async function GET(req) {
  await connectDb();
  const owners = await Owner.find({}).lean();
  const properties = await Property.find({}).lean();

  // Index properties par ownerId pour jointure
  const propMap = {};
  for (const p of properties) {
    if (p.ownerId && !propMap[p.ownerId]) propMap[p.ownerId] = p;
  }

  // Ajoute les infos logement depuis Property si besoin
  const merged = owners.map((o) => ({
    ...o,
    nomLogement: o.nomLogement || propMap[o.ownerId]?.logement || "",
    registreTouristique: o.registreTouristique || propMap[o.ownerId]?.registreTouristique || "",
    // Champs MANDAT (pris uniquement depuis Owner)
    mandatType: o.mandatType || "",
    mandatDebut: o.mandatDebut || "",
    mandatFin: o.mandatFin || "",
  }));

  return NextResponse.json(merged);
}

// PUT: Met à jour un propriétaire (depuis OwnerModal)
export async function PUT(req) {
  await connectDb();
  const data = await req.json();
  const { _id, ...fields } = data;
  if (!_id) {
    return NextResponse.json({ error: "ID propriétaire manquant" }, { status: 400 });
  }

  // Seuls ces champs sont éditables
  const updatable = [
    "prenom",
    "nom",
    "nomLogement",
    "registreTouristique",
    "adresse",
    "codePostal",
    "ville",
    "pays",
    "email",
    "telephone",
    "siret",
    // Champs MANDAT :
    "mandatType",
    "mandatDebut",
    "mandatFin",
  ];
  const update = {};
  updatable.forEach((k) => { if (k in fields) update[k] = fields[k]; });

  // Met à jour Owner
  const owner = await Owner.findByIdAndUpdate(_id, update, { new: true, runValidators: true }).lean();
  if (!owner) return NextResponse.json({ error: "Propriétaire non trouvé" }, { status: 404 });

  // SYNC automatique dans Property si besoin
  const propUpdate = {};
  if ("nomLogement" in update) propUpdate.logement = update.nomLogement;
  if ("registreTouristique" in update) propUpdate.registreTouristique = update.registreTouristique;

  if (Object.keys(propUpdate).length > 0) {
    await Property.updateMany({ ownerId: owner.ownerId }, { $set: propUpdate });
  }

  return NextResponse.json(owner);
}

// POST: Crée un nouveau propriétaire
export async function POST(req) {
  await connectDb();
  const data = await req.json();

  // Création du Owner (avec champs mandat)
  const owner = await Owner.create({
    ...data,
    mandatType: data.mandatType || "",
    mandatDebut: data.mandatDebut || "",
    mandatFin: data.mandatFin || "",
  });

  // Crée aussi une Property associée si besoin
  if (data.ownerId && (data.nomLogement || data.registreTouristique)) {
    await Property.create({
      ownerId: data.ownerId,
      logement: data.nomLogement || "",
      registreTouristique: data.registreTouristique || "",
    });
  }

  return NextResponse.json(owner);
}

// DELETE: Supprime un propriétaire (et optionnellement ses logements)
export async function DELETE(req) {
  await connectDb();
  const { id } = await req.json();
  const owner = await Owner.findByIdAndDelete(id);
  // Option : supprimer aussi ses logements associés si besoin
  // await Property.deleteMany({ ownerId: owner.ownerId });
  return NextResponse.json({ success: true });
}
