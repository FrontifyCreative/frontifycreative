/* ==========================================================================
   Frontify Creative — konfigurasi & helper bersama
   Semua data kontak resmi ada di sini. Tidak ada data bisnis yang dikarang.
   ========================================================================== */

export const CONFIG = {
  brandName: "Frontify Creative",
  slogan: "Code. Create. Inspire.",


  // Resmi: 0851-3473-9720  ->  6285134739720
  whatsappNumber: "6285134739720",

  email: "frontify.creative@gmail.com",
  emailSubject: "Ngobrol soal proyek digital",

  social: {
    instagram: "https://www.instagram.com/frontifycreative_/",
    tiktok: "https://www.tiktok.com/@frontifycreative_/",
    telegram: "https://t.me/frontifycreative",
  },
};

/* ---------- helper DOM ---------- */
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- helper kontak ---------- */
export function normalizeNumber(raw = CONFIG.whatsappNumber) {
  let digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  return digits;
}
export const hasWhatsApp = () => normalizeNumber().length >= 8;

export function whatsappUrl(message = "") {
  if (!hasWhatsApp()) return null;
  const base = `https://wa.me/${normalizeNumber()}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoUrl(subject, body = "") {
  const q = [`subject=${encodeURIComponent(subject)}`];
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${CONFIG.email}?${q.join("&")}`;
}
