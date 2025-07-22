//app/api/export-mail/route.js
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import nodemailer from "nodemailer";
import { mairies, normalizeVille } from "../../lib/mairies";
import { getTaxeDataByVille } from "../../lib/taxe-data";

export async function POST(req) {
  try {
    const { ville } = await req.json();
    if (!ville)
      return NextResponse.json({ error: "Ville requise" }, { status: 400 });

    const villeKey = normalizeVille(ville);
    const email = mairies[villeKey];
    console.log("API export-mail ville brute :", ville, "| clé normalisée :", villeKey, "| email trouvé :", email);

    if (!email)
      return NextResponse.json({ error: "Email mairie non trouvé" }, { status: 400 });

    const data = await getTaxeDataByVille(ville);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(ville);
    if (data && data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key: key,
        width: Math.max(15, key.length + 2),
      }));
      data.forEach((row) => worksheet.addRow(row));
    }
    const buffer = await workbook.xlsx.writeBuffer();

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Taxe séjour" <noreply@domaine.fr>',
      to: email,
      subject: `Rapport Taxe de Séjour – ${ville}`,
      text: `Bonjour,\n\nVeuillez trouver ci-joint le rapport Excel des taxes de séjour pour la commune de ${ville}.\n\nCordialement,`,
      attachments: [
        {
          filename: `taxe_sejour_${villeKey}.xlsx`,
          content: Buffer.from(buffer),
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur export-mail :", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
