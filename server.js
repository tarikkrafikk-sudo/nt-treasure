/**
 * =============================================================
 *  NT TREASURE — Serveur Node.js / Express
 * =============================================================
 *  Rôle de ce fichier :
 *   - Servir les fichiers statiques du dossier /public (css, js, images)
 *   - Servir les 3 pages du site : index.html, boutique.html, contact.html
 *   - Rediriger les routes "propres" (/boutique, /contact) vers les .html
 *   - Gérer une page 404 simple si une route n'existe pas
 *
 *  Pour lancer le site :
 *    1) npm install express
 *    2) node server.js
 *    3) Ouvrir http://localhost:3000
 * =============================================================
 */

const express = require("express");
const path = require("path");

const app = express();

// Port d'écoute du serveur (modifiable via variable d'environnement PORT)
const PORT = process.env.PORT || 3000;

// Chemin absolu vers le dossier public (contient tout le front-end)
const PUBLIC_DIR = path.join(__dirname, "public");

/**
 * Middleware : sert automatiquement tous les fichiers statiques
 * (CSS, JS, images) présents dans /public.
 * Exemple : /css/style.css, /js/script.js, /images/logo.png
 */
app.use(express.static(PUBLIC_DIR));

/**
 * Middleware : permet de lire les données envoyées par le formulaire
 * de contact (au cas où on veuille traiter le POST côté serveur plus tard).
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ===================== ROUTES DES PAGES ===================== */

// Page d'accueil
app.get(["/", "/index", "/index.html"], (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Page boutique
app.get(["/boutique", "/boutique.html"], (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "boutique.html"));
});

// Page contact
app.get(["/contact", "/contact.html"], (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "contact.html"));
});

/**
 * Route POST optionnelle pour le formulaire de contact.
 * Actuellement, le formulaire redirige surtout vers WhatsApp côté client,
 * mais cette route est prête si vous souhaitez enregistrer / envoyer
 * les messages par email plus tard (ex: avec Nodemailer).
 */
app.post("/api/contact", (req, res) => {
  const { name, phone, email, message } = req.body;
  console.log("📩 Nouveau message de contact reçu :", { name, phone, email, message });

  // Ici, on pourrait envoyer un email, sauvegarder en base de données, etc.
  res.json({ success: true, message: "Message bien reçu. Merci de nous avoir contactés !" });
});

/* ===================== PAGE 404 ===================== */
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>404 — Page introuvable | NT TREASURE</title>
      <style>
        body{background:#000;color:#D4AF37;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}
        a{color:#fff;text-decoration:underline;margin-top:1rem;}
      </style>
    </head>
    <body>
      <h1>404</h1>
      <p>Cette page n'existe pas.</p>
      <a href="/">Retour à l'accueil</a>
    </body>
    </html>
  `);
});

/* ===================== DÉMARRAGE DU SERVEUR ===================== */
app.listen(PORT, () => {
  console.log(`✨ NT TREASURE — Serveur lancé sur http://localhost:${PORT}`);
});
