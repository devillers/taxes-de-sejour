
// app/api/accommodations/[id]/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../../lib/db';
import Accommodation from '../../../models/accommodations';

export async function GET(req, context) {
  const { params } = await context;
  await connectDb();

  const doc = await Accommodation.findById(params.id).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const response = {
    _id: doc._id.toString(),
    ownerId: doc.owner,
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
  };

  return NextResponse.json(response);
}

export async function PUT(req, context) {
  try {
    const { params } = await context;
    await connectDb();
    const data = await req.json();

    const updatedDoc = await Accommodation.findByIdAndUpdate(params.id, data, { new: true }).lean();
    if (!updatedDoc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const response = {
      _id: updatedDoc._id.toString(),
      ownerId: updatedDoc.owner,
      nomProprietaire: updatedDoc.nomProprietaire,
      logement: updatedDoc.logement,
      adresse: updatedDoc.adresse,
      localite: updatedDoc.localite,
      codePostal: updatedDoc.codePostal,
      numeroRegistreTouristique: updatedDoc.numeroRegistreTouristique,
      classement: updatedDoc.numeroRegistreTouristique ? 'Classé' : 'Non classé',
      prixNuitee: updatedDoc.prixNuitee,
      sejourDebut: updatedDoc.sejourDebut ? updatedDoc.sejourDebut.toISOString() : null,
      sejourDuree: updatedDoc.sejourDuree,
      nbPersonnes: updatedDoc.nbPersonnes,
      nbNuitees: updatedDoc.nbNuitees,
      tarifUnitaireTaxe: updatedDoc.tarifUnitaireTaxe,
      montantTaxe: updatedDoc.montantTaxe,
      createdAt: updatedDoc.createdAt.toISOString(),
      updatedAt: updatedDoc.updatedAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('Error updating accommodation:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { params } = await context;
    await connectDb();
    await Accommodation.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting accommodation:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
