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


```

## 🔧 Configuration

Définissez les variables d'environnement suivantes pour que l'application
fonctionne correctement :

- `MONGODB_URI` – chaîne de connexion à la base MongoDB
- `GMAIL_USER` – adresse Gmail utilisée pour l'envoi des mails
- `GMAIL_PASS` – mot de passe de cette adresse Gmail
- `SMTP_HOST` – hôte SMTP pour l'envoi du rapport Excel
- `SMTP_PORT` – port SMTP correspondant
- `SMTP_USER` – identifiant de connexion au serveur SMTP

> **Important** : avant d'utiliser la fonctionnalité d'envoi d'e-mails,
> importez les propriétaires via l'endpoint `/api/upload-owners`.