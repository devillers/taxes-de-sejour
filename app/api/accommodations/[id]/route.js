// app/api/accommodations/[id]/route.js

import { NextResponse } from 'next/server'
import { connectDb } from '../../../lib/db'
import Accommodation from '../../../models/properties'

export async function GET(request, { params }) {
  await connectDb()
  const doc = await Accommodation.findById(params.id).lean()
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
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
    sejourDebut: doc.sejourDebut?.toISOString() ?? null,
    sejourDuree: doc.sejourDuree ?? null,
    nbPersonnes: doc.nbPersonnes ?? null,
    nbNuitees: doc.nbNuitees ?? null,
    tarifUnitaireTaxe: doc.tarifUnitaireTaxe ?? null,
    montantTaxe: doc.montantTaxe ?? null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  })
}

export async function PUT(request, { params }) {
  await connectDb()
  const data = await request.json()
  data.owner = Number(data.owner)

  const updated = await Accommodation
    .findByIdAndUpdate(params.id, data, { new: true })
    .lean()

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    _id: updated._id.toString(),
    ownerId: updated.owner,
    nomProprietaire: updated.nomProprietaire || '',
    logement: updated.logement || '',
    adresse: updated.adresse || '',
    localite: updated.localite || '',
    codePostal: updated.codePostal || '',
    numeroRegistreTouristique: updated.numeroRegistreTouristique || '',
    classement: updated.numeroRegistreTouristique ? 'Classé' : 'Non classé',
    prixNuitee: updated.prixNuitee ?? null,
    sejourDebut: updated.sejourDebut?.toISOString() ?? null,
    sejourDuree: updated.sejourDuree ?? null,
    nbPersonnes: updated.nbPersonnes ?? null,
    nbNuitees: updated.nbNuitees ?? null,
    tarifUnitaireTaxe: updated.tarifUnitaireTaxe ?? null,
    montantTaxe: updated.montantTaxe ?? null,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  })
}

export async function DELETE(request, { params }) {
  await connectDb()
  await Accommodation.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Deleted' })
}
