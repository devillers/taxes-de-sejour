# 🏡 Calcul Automatisé des Taxes de Séjour

Cette application permet aux conciergeries, hébergeurs ou communes de **calculer automatiquement le montant des taxes de séjour à reverser** par logement à partir de fichiers CSV déposés par l'utilisateur. Les données sont analysées, stockées dans une base MongoDB, affichées sous forme de tableau et exportables en fichier Excel.

---

## ⚙️ Fonctionnalités

- 📤 **Import CSV** : déposez vos fichiers contenant les séjours enregistrés
- 🧠 **Calcul automatique** des taxes de séjour selon le nombre de personnes, la durée et les règles en vigueur
- 🗃️ **Stockage MongoDB** des séjours pour consultation et historique
- 📊 **Tableau dynamique** listant :
  - Nom du propriétaire
  - Adresse du logement
  - Dates de séjour
  - Nombre de personnes
  - Montant de taxe à reverser
- 📥 **Export Excel** du tableau de calcul
- 🎨 Interface responsive grâce à Tailwind CSS

---

## 🚀 Technologies utilisées

- [Next.js 15](https://nextjs.org/) – App Router + React Server Components
- [Tailwind CSS](https://tailwindcss.com/) – Framework CSS utilitaire
- [MongoDB](https://www.mongodb.com/) – Base de données NoSQL
- [Mongoose](https://mongoosejs.com/) – ORM MongoDB
- [xlsx](https://www.npmjs.com/package/xlsx) – Export Excel côté client
- [csv-parse](https://www.npmjs.com/package/csv-parse) – Parsing des fichiers CSV

---

## 📁 Structure du projet

```bash
app/
  ├─ api/
  │   ├─ upload/          # Endpoint de traitement CSV et enregistrement en DB
  │   └─ export/          # Endpoint de génération Excel
  ├─ dashboard/           # Interface principale avec tableau de résultats
  └─ page.js              # Page d’accueil / upload
components/
  └─ CSVUploader.jsx      # Composant de drop zone pour fichiers CSV
lib/
  ├─ db.js                # Connexion à MongoDB
  └─ taxCalculator.js     # Fonction de calcul des taxes
models/
  └─ Stay.js              # Schéma Mongoose des séjours
styles/
  └─ globals.css
