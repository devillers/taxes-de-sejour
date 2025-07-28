// // app/api/PROPERTIES/[id]/route.js

// import { NextResponse } from 'next/server'
// import { connectDb } from '../../../lib/db'
// import Accommodation from '../../../models/properties'

// export async function GET(request, { params }) {
//   await connectDb()
//   const doc = await Accommodation.findById(params.id).lean()
//   if (!doc) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 })
//   }

//   return NextResponse.json({
//     _id: doc._id.toString(),
//     ownerId: doc.owner,
//     nomProprietaire: doc.nomProprietaire || '',
//     logement: doc.logement || '',
//     adresse: doc.adresse || '',
//     localite: doc.localite || '',
//     codePostal: doc.codePostal || '',
//     numeroRegistreTouristique: doc.numeroRegistreTouristique || '',
//     classement: doc.numeroRegistreTouristique ? 'Classé' : 'Non classé',
//     prixNuitee: doc.prixNuitee ?? null,
//     sejourDebut: doc.sejourDebut?.toISOString() ?? null,
//     sejourDuree: doc.sejourDuree ?? null,
//     nbPersonnes: doc.nbPersonnes ?? null,
//     nbNuitees: doc.nbNuitees ?? null,
//     tarifUnitaireTaxe: doc.tarifUnitaireTaxe ?? null,
//     montantTaxe: doc.montantTaxe ?? null,
//     createdAt: doc.createdAt.toISOString(),
//     updatedAt: doc.updatedAt.toISOString(),
//   })
// }

// export async function PUT(request, { params }) {
//   await connectDb()
//   const data = await request.json()
//   data.owner = Number(data.owner)

//   const updated = await Accommodation
//     .findByIdAndUpdate(params.id, data, { new: true })
//     .lean()

//   if (!updated) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 })
//   }

//   return NextResponse.json({
//     _id: updated._id.toString(),
//     ownerId: updated.owner,
//     nomProprietaire: updated.nomProprietaire || '',
//     logement: updated.logement || '',
//     adresse: updated.adresse || '',
//     localite: updated.localite || '',
//     codePostal: updated.codePostal || '',
//     numeroRegistreTouristique: updated.numeroRegistreTouristique || '',
//     classement: updated.numeroRegistreTouristique ? 'Classé' : 'Non classé',
//     prixNuitee: updated.prixNuitee ?? null,
//     sejourDebut: updated.sejourDebut?.toISOString() ?? null,
//     sejourDuree: updated.sejourDuree ?? null,
//     nbPersonnes: updated.nbPersonnes ?? null,
//     nbNuitees: updated.nbNuitees ?? null,
//     tarifUnitaireTaxe: updated.tarifUnitaireTaxe ?? null,
//     montantTaxe: updated.montantTaxe ?? null,
//     createdAt: updated.createdAt.toISOString(),
//     updatedAt: updated.updatedAt.toISOString(),
//   })
// }

// export async function DELETE(request, { params }) {
//   await connectDb()
//   await Accommodation.findByIdAndDelete(params.id)
//   return NextResponse.json({ message: 'Deleted' })
// }



// app/api/PROPERTIES/[id]/route.js

import { NextResponse } from 'next/server'
import { connectDb } from '../../../lib/db'
import Accommodation from '../../../models/properties'
import Owner from '../../../models/owners'

export async function GET(request, { params }) {
  await connectDb()
  const doc = await Accommodation.findById(params.id).lean()
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Récupérer l'owner lié (si present)
  let nomProprietaire = ''
  let prenomProprietaire = ''
  let emailProprietaire = ''
  if (doc.ownerId || doc.owner) {
    const owner = await Owner.findOne({ ownerId: doc.ownerId || doc.owner }).lean()
    if (owner) {
      nomProprietaire = owner.nom || ''
      prenomProprietaire = owner.prenom || ''
      emailProprietaire = owner.email || ''
    }
  }

  return NextResponse.json({
    _id: doc._id.toString(),
    ownerId: doc.ownerId || doc.owner || '',
    nomProprietaire,
    prenomProprietaire,
    emailProprietaire,
    logement: doc.logement || '',
    adresse: doc.adresse || '',
    localite: doc.localite || '',
    codePostal: doc.codePostal || '',
    numeroRegistreTouristique: doc.numeroRegistreTouristique || doc.registreTouristique || '',
    classement: (doc.numeroRegistreTouristique || doc.registreTouristique) ? 'Classé' : 'Non classé',
    prixNuitee: doc.prixNuitee ?? null,
    sejourDebut: doc.sejourDebut?.toISOString() ?? null,
    sejourDuree: doc.sejourDuree ?? null,
    nbPersonnes: doc.nbPersonnes ?? null,
    nbNuitees: doc.nbNuitees ?? null,
    tarifUnitaireTaxe: doc.tarifUnitaireTaxe ?? null,
    montantTaxe: doc.montantTaxe ?? null,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  })
}

export async function PUT(request, { params }) {
  await connectDb()
  const data = await request.json()
  // Supprime la ligne suivante, car ownerId/owner sont des strings en BDD :
  // data.owner = Number(data.owner)

  const updated = await Accommodation
    .findByIdAndUpdate(params.id, data, { new: true })
    .lean()

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Récupérer l'owner lié (si present)
  let nomProprietaire = ''
  let prenomProprietaire = ''
  let emailProprietaire = ''
  if (updated.ownerId || updated.owner) {
    const owner = await Owner.findOne({ ownerId: updated.ownerId || updated.owner }).lean()
    if (owner) {
      nomProprietaire = owner.nom || ''
      prenomProprietaire = owner.prenom || ''
      emailProprietaire = owner.email || ''
    }
  }

  return NextResponse.json({
    _id: updated._id.toString(),
    ownerId: updated.ownerId || updated.owner || '',
    nomProprietaire,
    prenomProprietaire,
    emailProprietaire,
    logement: updated.logement || '',
    adresse: updated.adresse || '',
    localite: updated.localite || '',
    codePostal: updated.codePostal || '',
    numeroRegistreTouristique: updated.numeroRegistreTouristique || updated.registreTouristique || '',
    classement: (updated.numeroRegistreTouristique || updated.registreTouristique) ? 'Classé' : 'Non classé',
    prixNuitee: updated.prixNuitee ?? null,
    sejourDebut: updated.sejourDebut?.toISOString() ?? null,
    sejourDuree: updated.sejourDuree ?? null,
    nbPersonnes: updated.nbPersonnes ?? null,
    nbNuitees: updated.nbNuitees ?? null,
    tarifUnitaireTaxe: updated.tarifUnitaireTaxe ?? null,
    montantTaxe: updated.montantTaxe ?? null,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  })
}

export async function DELETE(request, { params }) {
  await connectDb()
  await Accommodation.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Deleted' })
}
