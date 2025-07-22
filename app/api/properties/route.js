

// app/api/accommodations/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Property from '../../models/properties';

// GET: Liste tous les logements
export async function GET(req) {
  try {
    await connectDb();

    // Si id présent dans la query, retourne le logement unique
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const doc = await Property.findById(id).lean();
      if (!doc) return NextResponse.json({ error: 'Logement non trouvé' }, { status: 404 });
      return NextResponse.json({
        _id: doc._id.toString(),
        ownerId: doc.ownerId,
        nomProprietaire: doc.proprietaire || '',
        logement: doc.logement || '',
        type: doc.type || '',
        capacite: doc.capacite ?? null,
        code: doc.code || '',
        edifice: doc.edifice || '',
        localite: doc.localite || '',
        quartier: doc.quartier || '',
        codePostal: doc.codePostal || '',
        adresse: `${doc.numero || ''} ${doc.typeVoie || ''} ${doc.adresse || ''}`.trim(),
        etage: doc.etage || '',
        porte: doc.porte || '',
        escalier: doc.escalier || '',
        numeroRegistreTouristique: doc.registreTouristique || '',
        classement: doc.registreTouristique ? 'Classé' : 'Non classé',
        referenceCadastrale: doc.referenceCadastrale || '',
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      });
    }

    // Sinon, retourne la liste complète
    const raw = await Property.find().lean();
    const accommodations = raw.map(doc => ({
      _id: doc._id.toString(),
      ownerId: doc.ownerId,
      nomProprietaire: doc.proprietaire || '',
      logement: doc.logement || '',
      type: doc.type || '',
      capacite: doc.capacite ?? null,
      code: doc.code || '',
      edifice: doc.edifice || '',
      localite: doc.localite || '',
      quartier: doc.quartier || '',
      codePostal: doc.codePostal || '',
      adresse: `${doc.numero || ''} ${doc.typeVoie || ''} ${doc.adresse || ''}`.trim(),
      etage: doc.etage || '',
      porte: doc.porte || '',
      escalier: doc.escalier || '',
      numeroRegistreTouristique: doc.registreTouristique || '',
      classement: doc.registreTouristique ? 'Classé' : 'Non classé',
      referenceCadastrale: doc.referenceCadastrale || '',
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));

    return NextResponse.json(accommodations);
  } catch (err) {
    console.error('Erreur GET logements :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST: Ajoute un logement
export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    const created = await Property.create({
      ownerId: body.ownerId,
      code: body.code,
      etat: body.etat,
      logement: body.logement,
      type: body.type,
      capacite: body.capacite,
      tarif: body.tarif,
      edifice: body.edifice,
      galerie: body.galerie,
      localite: body.localite,
      quartier: body.quartier,
      codePostal: body.codePostal,
      typeVoie: body.typeVoie,
      adresse: body.adresse,
      numero: body.numero,
      escalier: body.escalier,
      etage: body.etage,
      porte: body.porte,
      proprietaire: body.proprietaire,
      registreTouristique: body.registreTouristique,
      commentaires: body.commentaires,
      referenceCadastrale: body.referenceCadastrale,
    });

    return NextResponse.json({
      message: 'Logement créé avec succès',
      _id: created._id.toString(),
      createdAt: created.createdAt.toISOString(),
    }, { status: 201 });

  } catch (err) {
    console.error('Erreur POST logement :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: Met à jour un logement (via ?id=...)
export async function PUT(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const body = await req.json();

    const updated = await Property.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: 'Logement non trouvé' }, { status: 404 });

    return NextResponse.json({
      message: 'Logement mis à jour',
      _id: updated._id.toString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error('Erreur PUT logement :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE: Supprime un logement (via ?id=...)
export async function DELETE(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Logement non trouvé' }, { status: 404 });

    return NextResponse.json({
      message: 'Logement supprimé',
      _id: deleted._id.toString(),
    });
  } catch (err) {
    console.error('Erreur DELETE logement :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
