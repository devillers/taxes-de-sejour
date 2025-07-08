// app/api/accommodations/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Accommodation from '../../models/properties';

export async function GET() {
  await connectDb();
  const raw = await Accommodation.find().lean();
  const accommodations = raw.map(doc => ({
    _id: doc._id.toString(),
    ownerId: doc.owner, // pure number
    nomProprietaire: doc.nomProprietaire || '',
    logement: doc.logement || '',
    adresse: doc.adresse || '',
    localite: doc.localite || '',
    codePostal: doc.codePostal || '',
    numeroRegistreTouristique: doc.numeroRegistreTouristique || '',
    classement: doc.numeroRegistreTouristique ? 'Classé' : 'Non classé',
    prixNuitee: doc.prixNuitee ?? null,
    sejourDebut: doc.sejourDebut ? doc.sejourDebut.toISOString() : null,
    sejourDuree: doc.sejourDuree ?? null,
    nbPersonnes: doc.nbPersonnes ?? null,
    nbNuitees: doc.nbNuitees ?? null,
    tarifUnitaireTaxe: doc.tarifUnitaireTaxe ?? null,
    montantTaxe: doc.montantTaxe ?? null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }));
  return NextResponse.json(accommodations);
}

export async function POST(req) {
  try {
    await connectDb();
    const data = await req.json();
    const created = await Accommodation.create(data);
    const response = {
      _id: created._id.toString(),
      ownerId: created.owner,
      nomProprietaire: created.nomProprietaire,
      logement: created.logement,
      adresse: created.adresse,
      localite: created.localite,
      codePostal: created.codePostal,
      numeroRegistreTouristique: created.numeroRegistreTouristique,
      classement: created.numeroRegistreTouristique ? 'Classé' : 'Non classé',
      prixNuitee: created.prixNuitee,
      sejourDebut: created.sejourDebut ? created.sejourDebut.toISOString() : null,
      sejourDuree: created.sejourDuree,
      nbPersonnes: created.nbPersonnes,
      nbNuitees: created.nbNuitees,
      tarifUnitaireTaxe: created.tarifUnitaireTaxe,
      montantTaxe: created.montantTaxe,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
