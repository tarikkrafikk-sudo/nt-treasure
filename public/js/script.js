/**
 * =============================================================
 *  NT TREASURE — Script principal (front-end)
 * =============================================================
 *  Sommaire :
 *   1. Configuration WhatsApp (numéro centralisé)
 *   2. Génération des liens WhatsApp (général + par produit)
 *   3. Menu hamburger (mobile)
 *   4. Animations "reveal" au scroll
 *   5. Onglets catégories (page boutique)
 *   6. Formulaire de contact -> WhatsApp
 * =============================================================
 */

/* =============================================================
   1. CONFIGURATION WHATSAPP
   -------------------------------------------------------------
   ⚠️ IMPORTANT : c'est le SEUL endroit à modifier pour changer
   le numéro WhatsApp sur tout le site (boutons + flottant).
   Format international SANS le "+" ni espaces. Exemple Maroc :
   "212600000000" pour +212 6 00 00 00 00
============================================================= */
const WHATSAPP_NUMBER = "212687825469"; // Numéro WhatsApp officiel NT TREASURE

// Message général envoyé quand on clique sur un bouton WhatsApp "générique"
const WHATSAPP_MESSAGE_GENERAL =
  "Bonjour NT TREASURE 🌿, je souhaite avoir plus d'informations sur vos produits.";

/**
 * Construit une URL wa.me valide avec un message pré-rempli encodé.
 * @param {string} message - le texte à pré-remplir dans WhatsApp
 * @returns {string} l'URL complète https://wa.me/...
 */
function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Applique les liens WhatsApp à tous les boutons/liens de la page :
 *  - [data-whatsapp-general] -> message générique
 *  - [data-whatsapp-product] -> message avec le nom du produit
 */
function initWhatsAppLinks() {
  // Boutons génériques (hero, footer, header, bouton flottant...)
  document.querySelectorAll("[data-whatsapp-general]").forEach((el) => {
    el.setAttribute("href", buildWhatsAppLink(WHATSAPP_MESSAGE_GENERAL));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  // Boutons produits (boutique.html) : message personnalisé par produit
  document.querySelectorAll("[data-whatsapp-product]").forEach((el) => {
    const productName = el.getAttribute("data-whatsapp-product");
    const message = `Bonjour NT TREASURE 🌿, je souhaite commander : ${productName}.`;
    el.setAttribute("href", buildWhatsAppLink(message));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

/* =============================================================
   2. MENU HAMBURGER (MOBILE)
============================================================= */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // empêche le scroll derrière le menu
  };

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // Ferme le menu quand on clique sur un lien
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Ferme le menu automatiquement si on repasse en version bureau
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) closeMenu();
  });
}

/* =============================================================
   3. ANIMATIONS "REVEAL" AU SCROLL
============================================================= */
function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // Si le navigateur ne supporte pas IntersectionObserver, on affiche direct
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* =============================================================
   4. ONGLETS CATÉGORIES (page boutique.html)
   -------------------------------------------------------------
   Met en surbrillance l'onglet correspondant à la section
   actuellement visible à l'écran (Miel / Amlou / Hammam).
============================================================= */
function initShopTabs() {
  const tabs = document.querySelectorAll(".shop-tab");
  const sections = document.querySelectorAll(".category-block");
  if (!tabs.length || !sections.length) return;

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          tabs.forEach((tab) => {
            tab.classList.toggle("active", tab.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: `-${140}px 0px -50% 0px` }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =============================================================
   5. FORMULAIRE DE CONTACT -> ENVOI VIA WHATSAPP
============================================================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name")?.value.trim() || "";
    const phone = form.querySelector("#phone")?.value.trim() || "";
    const subject = form.querySelector("#subject")?.value.trim() || "";
    const messageField = form.querySelector("#message")?.value.trim() || "";

    // Construction du message WhatsApp à partir des champs du formulaire
    let message = `Bonjour NT TREASURE 🌿, je m'appelle ${name}.`;
    if (subject) message += `\nSujet : ${subject}`;
    if (messageField) message += `\nMessage : ${messageField}`;
    if (phone) message += `\nMon numéro : ${phone}`;

    // Affiche un message de confirmation avant redirection
    const successBox = document.getElementById("formSuccess");
    if (successBox) {
      successBox.classList.add("show");
      successBox.textContent = "Merci ! Vous allez être redirigé vers WhatsApp pour finaliser votre message...";
    }

    // Ouvre WhatsApp avec le message pré-rempli
    setTimeout(() => {
      window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }, 600);

    form.reset();
  });
}

/* =============================================================
   6. ANNÉE COURANTE DANS LE FOOTER (facultatif, si présent)
============================================================= */
function initFooterYear() {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* =============================================================
   INITIALISATION GÉNÉRALE
============================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
  initMobileMenu();
  initRevealAnimations();
  initShopTabs();
  initContactForm();
  initFooterYear();
});
