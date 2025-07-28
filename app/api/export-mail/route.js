// import { NextResponse } from "next/server";
// import transporter from "../../lib/sendMailTransporter";
// import { mairies } from "../../lib/mairies";
// import ExcelJS from "exceljs";

// export async function POST(req) {
//   try {
//     // 1. Récupérer la ville demandée
//     const { ville, rows } = await req.json(); // rows = données à inclure dans l'Excel
//     if (!ville) {
//       return NextResponse.json({ error: "Ville manquante" }, { status: 400 });
//     }

//     // 2. Trouver l'email de la mairie
//     const villeKey = ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//     const email = mairies[villeKey];
//     if (!email) {
//       return NextResponse.json(
//         { error: `Aucun email mairie trouvé pour la ville ${ville} (clé cherchée : ${villeKey})` },
//         { status: 404 }
//       );
//     }

//     // 3. Générer le rapport Excel (colonnes à adapter à tes besoins)
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet("Taxes cumulées");
//     sheet.columns = [
//       { header: "#", key: "index", width: 5 },
//       { header: "Id CARE", key: "hebergementId", width: 20 },
//       { header: "Nom", key: "proprietaireNom", width: 16 },
//       { header: "Prénom", key: "proprietairePrenom", width: 16 },
//       { header: "Num Enregistrement", key: "hebergementNum", width: 16 },
//       { header: "Hébergement Nom", key: "hebergementNom", width: 24 },
//       { header: "Adresse", key: "hebergementAdresse1", width: 28 },
//       { header: "CP", key: "hebergementCp", width: 10 },
//       { header: "Ville", key: "hebergementVille", width: 18 },
//       { header: "Classement", key: "hebergementClassement", width: 14 },
//       { header: "Prix Nuitée", key: "prixNuitee", width: 12 },
//       { header: "Durée Séjour", key: "sejourDuree", width: 14 },
//       { header: "Perception", key: "sejourPerception", width: 14 },
//       { header: "Début Séjour", key: "sejourDebut", width: 14 },
//       { header: "Nb Pers.", key: "nbPersonnes", width: 10 },
//       { header: "Nb Nuitées", key: "nbNuitees", width: 10 },
//       { header: "Tarif Unitaire", key: "tarifUnitaireTaxe", width: 14 },
//       { header: "Montant Taxe (€)", key: "montantTaxe", width: 16 },
//       { header: "Email", key: "proprietaireEmail", width: 24 },
//     ];
//     if (Array.isArray(rows)) {
//       rows.forEach((row, i) => {
//         sheet.addRow({ index: i + 1, ...row });
//       });
//     }
//     const excelBuffer = await workbook.xlsx.writeBuffer();

//     // 4. Contenu du mail
//     const rapportHtml = `
//       <div style="font-family:sans-serif;">
//         <h2 style="color:#bd9254;">Rapport taxe de séjour - ${ville}</h2>
//         <p>Veuillez trouver en pièce jointe le rapport cumulé des taxes de séjour pour la commune de <b>${ville}</b>.</p>
//       </div>
//     `;

//     // 5. Envoi du mail avec PJ Excel
//     await transporter.sendMail({
//       from: process.env.SMTP_FROM || '"Care Concierge" <noreply@domaine.fr>',
//       to: email,
//       subject: `Rapport taxe de séjour - ${ville}`,
//       text: `Bonjour,\n\nVeuillez trouver le rapport des taxes de séjour pour ${ville} en pièce jointe.`,
//       html: rapportHtml,
//       attachments: [
//         {
//           filename: `rapport-taxe-sejour-${ville}.xlsx`,
//           content: excelBuffer,
//           contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         }
//       ]
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Erreur export-mail :", err);
//     return NextResponse.json(
//       { error: err.message || String(err) },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import transporter from "../../lib/sendMailTransporter";
import { mairies } from "../../lib/mairies";
import ExcelJS from "exceljs";

export async function POST(req) {
  try {
    const { ville, rows } = await req.json();
    const villeKey = ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const email = mairies[villeKey];
    if (!email) return NextResponse.json({ error: "Ville inconnue" }, { status: 404 });

    // Génère l’Excel à partir de rows (exactement ce que tu veux exporter)
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Taxes cumulées");
    // Tes colonnes Excel ici :
    sheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Id CARE", key: "hebergementId", width: 20 },
      { header: "Nom", key: "proprietaireNom", width: 16 },
      { header: "Prénom", key: "proprietairePrenom", width: 16 },
      { header: "Num Enregistrement", key: "hebergementNum", width: 16 },
      { header: "Hébergement Nom", key: "hebergementNom", width: 24 },
      { header: "Adresse", key: "hebergementAdresse1", width: 28 },
      { header: "CP", key: "hebergementCp", width: 10 },
      { header: "Ville", key: "hebergementVille", width: 18 },
      { header: "Classement", key: "hebergementClassement", width: 14 },
      { header: "Prix Nuitée", key: "prixNuitee", width: 12 },
      { header: "Durée Séjour", key: "sejourDuree", width: 14 },
      { header: "Perception", key: "sejourPerception", width: 14 },
      { header: "Début Séjour", key: "sejourDebut", width: 14 },
      { header: "Nb Pers.", key: "nbPersonnes", width: 10 },
      { header: "Nb Nuitées", key: "nbNuitees", width: 10 },
      { header: "Tarif Unitaire", key: "tarifUnitaireTaxe", width: 14 },
      { header: "Montant Taxe (€)", key: "montantTaxe", width: 16 },
      
    ];
    if (Array.isArray(rows)) {
      rows.forEach((row, i) => {
        sheet.addRow({ index: i + 1, ...row });
      });
    }
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Envoi du mail avec la PJ Excel
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Care Concierge" <noreply@domaine.fr>',
      to: email,
      subject: `Rapport taxe de séjour - ${ville}`,
      text: `Bonjour,\n\nVeuillez trouver le rapport des taxes de séjour pour ${ville} en pièce jointe.`,
      html: `<div>Rapport pour <b>${ville}</b> en pièce jointe.</div>`,
      attachments: [
        {
          filename: `rapport-taxe-sejour-${ville}.xlsx`,
          content: excelBuffer,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

