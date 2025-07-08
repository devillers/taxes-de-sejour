// app/api/owners/route.js
import { NextResponse } from "next/server";
import Owner from "../../models/owners";
import Property from "../../models/properties";
import { connectDb } from "../../lib/db";

export async function GET(req) {
  await connectDb();
  // Récupère tous les propriétaires, et va chercher en plus logement & registreTouristique depuis Property
  const owners = await Owner.find({}).lean();
  const properties = await Property.find({}).lean();

  // Index properties par ownerId
  const propMap = {};
  for (const p of properties) {
    if (p.ownerId && (!propMap[p.ownerId])) propMap[p.ownerId] = p;
  }

  const merged = owners.map((o) => ({
    ...o,
    nomLogement: o.nomLogement || propMap[o.ownerId]?.logement || "",
    registreTouristique: o.registreTouristique || propMap[o.ownerId]?.registreTouristique || "",
  }));

  return NextResponse.json(merged);
}

export async function PUT(req) {
  await connectDb();
  const data = await req.json();
  const { _id, ...fields } = data;

  // Liste des champs éditables dans Owner
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
  ];

  // Ne garder que les champs transmis
  const update = {};
  updatable.forEach((k) => { if (k in fields) update[k] = fields[k]; });

  // Update dans Owner
  const owner = await Owner.findOneAndUpdate(
    { _id },
    update,
    { new: true }
  );

  // SYNC aussi dans Property !
  const propUpdate = {};
  if ("nomLogement" in update) propUpdate.logement = update.nomLogement;
  if ("registreTouristique" in update) propUpdate.registreTouristique = update.registreTouristique;

  if (Object.keys(propUpdate).length > 0) {
    await Property.updateMany(
      { ownerId: owner.ownerId },
      { $set: propUpdate }
    );
  }

  return NextResponse.json(owner);
}

export async function POST(req) {
  await connectDb();
  const data = await req.json();

  // Création du Owner
  const owner = await Owner.create(data);

  // Crée aussi une Property associée si on a des infos
  if (data.ownerId && (data.nomLogement || data.registreTouristique)) {
    await Property.create({
      ownerId: data.ownerId,
      logement: data.nomLogement || "",
      registreTouristique: data.registreTouristique || "",
    });
  }

  return NextResponse.json(owner);
}

export async function DELETE(req) {
  await connectDb();
  const { id } = await req.json();
  const owner = await Owner.findByIdAndDelete(id);
  // (option) supprimer aussi les properties liées
  // await Property.deleteMany({ ownerId: owner.ownerId });
  return NextResponse.json({ success: true });
}
