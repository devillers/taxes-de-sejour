// app/api/send-mail/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Owner from "../../models/owners";
import { connectDb } from "../../lib/db";

export async function POST(req) {
  try {
    // 1. Récupérer ownerId, email (optionnel), montantTaxe, hebergementNom
    const { ownerId, email, montantTaxe, hebergementNom } = await req.json();
    console.log("API/send-mail reçu:", { ownerId, email, montantTaxe, hebergementNom });

    if ((!ownerId && !email) || !montantTaxe || !hebergementNom) {
      return NextResponse.json(
        { error: "ownerId, email, montantTaxe et hebergementNom requis" },
        { status: 400 }
      );
    }

    await connectDb();

    // 2. Si email non fourni, le chercher en BDD
    let destinataire = email;
    if (!destinataire && ownerId) {
      const owner = await Owner.findOne({ ownerId }).lean();
      destinataire = owner?.email;
    }

    if (!destinataire) {
      return NextResponse.json(
        { error: "Aucun email propriétaire trouvé" },
        { status: 404 }
      );
    }

    // 3. Préparer l’email (compatible Gmail ou host/port SMTP)
    let transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "gmail", // ou "gmail"
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Envoyer le mail avec HTML + fallback texte
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Taxe de séjour" <noreply@domaine.fr>',
      to: destinataire,
      subject: `Paiement des taxes de séjour perçues – ${hebergementNom}`,
      text: `Bonjour,

Nous vous informons que le montant total des taxes de séjour perçues et reversé à votre commune pour le logement "${hebergementNom}" est de : ${montantTaxe} €.

Si votre logement n'est pas classé, Booking.com reverse directement cette taxe à votre mairie. Airbnb et Vrbo le font quant à eux systématiquement.

Cordialement,
Care Concierge & Properties
`,
      html: `
    <div style="max-width:500px;padding:24px 32px 20px 32px;border-radius:16px;background:#fff8ef;border:1px solid #e0e0e0;font-family:sans-serif;color:#333;">
      <div style="text-align:center;margin-bottom:22px;">
        <img src="https://www.careconciergeluxury.com/pin.png" alt="Logo Care Concierge" style="width:50px;max-width:40%;margin-bottom:8px;border-radius:12px" />
        <h2 style="margin:0;color:#bd9254;font-size:1.4em;font-weight:bold;letter-spacing:.02em;">Taxe de Séjour</h2>
      </div>
      <p style="font-size:1.1em;margin-bottom:18px;">Bonjour,</p>
      <p style="font-size:1em;margin-bottom:12px;">
        Nous vous informons que le <b>montant total des taxes de séjour perçues pour le logement</b>
        <span style="color:#a17435;font-weight:bold;">${hebergementNom}</span>
        <b>et reversé à votre commune</b> est de :<br/>
        <span style="font-size:1.25em;font-weight:bold;color:#a17435;">
          ${montantTaxe} €
        </span>
      </p>
      <p style="font-size:1.08em;margin-bottom:18px;">Si votre logement n'est pas classé, Booking.com reverse directement cette taxe à votre mairie. Airbnb et Vrbo le font quant à eux systématiquement.</p>
      <p style="font-size:.98em;margin-top:18px;">
        Cordialement,<br />
        <b>Care Concierge & Properties</b>
      </p>
      <hr style="margin:22px 0 8px 0;border:none;border-top:1px solid #e4cfa2"/>
      <div style="text-align:center;color:#a17435;font-size:.85em;">
        Merci pour votre déclaration.<br/>Pour toute question, contactez-nous !
      </div>
    </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur send-mail :", err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
