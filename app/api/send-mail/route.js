//app/api/send-mail/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "../../lib/db";
import { sendMailClient } from "../../utils/mailer";

export async function POST(req) {
  try {
    await connectDb();
    const { ownerId, montantTaxe } = await req.json();
    console.log("Reçu :", { ownerId, montantTaxe });

    // 1. Trouver le propriétaire
    console.log("Recherche ownerId :", ownerId, "| Type :", typeof ownerId);
    const owners = mongoose.connection.collection("owners");
    const owner = await owners.findOne({ ownerId }); // ou adapte ici selon la structure réelle
    console.log("Owner trouvé :", owner);

    if (!owner?.email) {
      console.log("Pas de mail pour ce propriétaire");
      return NextResponse.json(
        { error: "Email propriétaire introuvable" },
        { status: 404 }
      );
    }
    // 2. Préparer et envoyer le mail
    const montant = Number(montantTaxe).toFixed(2).replace(".", ",");
    const sujet = "Déclaration de taxes de séjour";
    const html = `<p>Bonjour ${owner.prenom} ${owner.nom},<br>
        Nous venons de faire votre déclaration de taxes de séjour pour un montant de <b>${montant} €</b>.<br>
        Cordialement.</p>`;

    await sendMailClient(owner.email, sujet, html);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erreur API /api/send-mail :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
