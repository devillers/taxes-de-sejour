import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Exporte les propriétés filtrées au format .xlsx via ExcelJS
 * @param {Array} properties - tableau à exporter (ex: filteredProperties)
 * @param {String} fileName - nom du fichier exporté
 */
export async function exportPropertiesToXLSX_ExcelJS(properties, fileName = "logements.xlsx") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Logements");

  // Définir les colonnes (header + mapping clé objet)
  worksheet.columns = [
    { header: "#", key: "num", width: 5 },
    { header: "ownerId", key: "ownerId", width: 16 },
    { header: "Code", key: "code", width: 14 },
    { header: "Registre Touristique", key: "registre", width: 24 },
    { header: "Propriétaire", key: "proprio", width: 18 },
    { header: "Logement", key: "logement", width: 18 },
    { header: "Adresse", key: "adresse", width: 22 },
    { header: "Code Postal", key: "codePostal", width: 12 },
    { header: "Localité", key: "localite", width: 14 },
  ];

  // Ajouter les lignes au tableau Excel
  properties.forEach((item, idx) => {
    worksheet.addRow({
      num: idx + 1,
      ownerId: item.ownerId,
      code: item.code,
      registre: item.numeroRegistreTouristique || item.registreTouristique || "",
      proprio: item.proprietaire || item.nomProprietaire || "",
      logement: item.logement,
      adresse: item.adresse,
      codePostal: item.codePostal,
      localite: item.localite,
    });
  });

  // Style header (optionnel : gras et fond gris)
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' }
  };

  // Générer le fichier et déclencher le téléchargement
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, fileName);
}
