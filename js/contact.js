/* Kontak: pembuat pesan WhatsApp, brief multi-langkah, formulir kontak, tombol melayang. */
import { $, $$, CONFIG, hasWhatsApp, whatsappUrl, mailtoUrl, prefersReducedMotion, escapeHtml } from "./config.js";

/* ---------- pesan ---------- */
export function composeMessage(intro, pairs, outro = "") {
  const lines = pairs.filter(([, v]) => v && String(v).trim()).map(([k, v]) => `• *${k}:* ${String(v).trim()}`);
  return [intro, "", ...lines, ...(outro ? ["", outro] : [])].join("\n");
}

function setStatus(el, text, type = "info") {
  if (!el) return;
  el.textContent = text;
  el.dataset.type = type;
  el.hidden = !text;
}

/** Buka WhatsApp bila nomor sudah dikonfigurasi; bila belum, salin pesan & beri tahu dengan jujur. */
export async function deliverWhatsApp(message, statusEl, emailSubject = CONFIG.emailSubject) {
  const url = whatsappUrl(message);
  if (url) {
    window.open(url, "_blank", "noopener");
    setStatus(statusEl, "WhatsApp dibuka di tab baru dengan pesan yang sudah terisi.", "ok");
    return true;
  }
  let copied = false;
  try { await navigator.clipboard.writeText(message); copied = true; } catch (_) { /* abaikan */ }
  setStatus(statusEl,
    `Nomor WhatsApp belum diatur di situs ini. ${copied ? "Pesanmu sudah disalin — " : ""}kamu bisa mengirimnya lewat email (${CONFIG.email}).`, "warn");
  console.warn("[Frontify] CONFIG.whatsappNumber kosong. Isi di js/config.js.");
  return false;
}

function sendEmail(message, subject, statusEl) {
  window.location.href = mailtoUrl(subject, message.replace(/\*/g, ""));
  setStatus(statusEl, `Mencoba membuka aplikasi email dengan pesan yang sudah terisi. Jika tidak terbuka, kirim langsung ke ${CONFIG.email}.`, "info");
}

/* ---------- validasi ---------- */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => { const d = v.replace(/\D/g, ""); return d.length >= 8 && d.length <= 15 && /^[\d\s+()-]+$/.test(v); };
export const validContact = (v) => isEmail(v.trim()) || isPhone(v.trim());

function showError(form, name, message) {
  const err = $(`[data-error-for="${name}"]`, form);
  const control = form.elements[name];
  if (err) { err.textContent = message; err.hidden = !message; }
  const target = control && control.length !== undefined && !control.tagName ? control[0] : control; // RadioNodeList
  const holder = target && target.type === "radio" ? target.closest("fieldset") : target;
  if (holder) { if (message) holder.setAttribute("aria-invalid", "true"); else holder.removeAttribute("aria-invalid"); }
  return target;
}

/** rules: [[fieldName, pesanError, validatorOpsional]]; mengembalikan elemen pertama yang tidak valid. */
function validate(form, rules) {
  let first = null;
  rules.forEach(([name, message, test]) => {
    const control = form.elements[name];
    const value = control ? String(control.value || "") : "";
    const ok = test ? test(value) : value.trim().length > 0;
    const target = showError(form, name, ok ? "" : message);
    if (!ok && !first) first = target;
  });
  if (first && first.focus) first.focus();
  return !first;
}

function clearOnInput(form) {
  const handler = (e) => { const n = e.target.name; if (n) showError(form, n, ""); };
  form.addEventListener("input", handler);
  form.addEventListener("change", handler);
}

/* ---------- Brief multi-langkah ---------- */
const BRIEF_RULES = {
  0: [["biz_name", "Tuliskan nama bisnis atau proyekmu."], ["biz_field", "Bidang usaha perlu diisi, ya."]],
  1: [["type", "Pilih satu layanan yang paling dekat dengan kebutuhanmu."]],
  2: [],
  3: [["budget", "Pilih kisaran budget, atau “Belum tahu”."]],
  4: [["contact_name", "Nama kamu perlu diisi."], ["contact_value", "Isi nomor WhatsApp atau email yang valid.", validContact]],
};

function readBrief(form) {
  const v = (n) => (form.elements[n] ? String(form.elements[n].value || "").trim() : "");
  return {
    biz_name: v("biz_name"), biz_field: v("biz_field"), biz_about: v("biz_about"),
    type: v("type"), features: $$("input[name='features']:checked", form).map((i) => i.value),
    budget: v("budget"), contact_name: v("contact_name"), contact_value: v("contact_value"), deadline: v("deadline"),
  };
}
const briefPairs = (d) => [
  ["Nama bisnis", d.biz_name], ["Bidang usaha", d.biz_field], ["Tentang bisnis", d.biz_about],
  ["Layanan", d.type], ["Fitur dibutuhkan", d.features.join(", ") || "Belum dipilih"],
  ["Kisaran budget", d.budget], ["Target waktu", d.deadline], ["Nama", d.contact_name], ["Kontak", d.contact_value],
];

function initBrief() {
  const form = $("#brief-form");
  if (!form) return;
  const panels = $$(".brief-step", form);
  const REVIEW = panels.length - 1; // panel terakhir = ringkasan
  const items = $$(".brief-progress li");
  const fill = $(".brief-progress-fill");
  const nextBtn = $("[data-brief-next]", form), prevBtn = $("[data-brief-prev]", form);
  const nav = $(".brief-nav", form);
  const status = $("#brief-status");
  let current = 0;

  const go = (i, dir, interactive = true) => {
    form.dataset.dir = dir;
    panels.forEach((p, n) => { p.hidden = n !== i; p.classList.toggle("is-active", n === i); });
    current = i;
    items.forEach((li, n) => {
      li.classList.toggle("is-current", n === i);
      li.classList.toggle("is-done", n < i);
      if (n === i) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (fill) fill.style.transform = `scaleX(${Math.min(i, items.length - 1) / (items.length - 1)})`;
    prevBtn.hidden = i === 0;
    nav.hidden = i === REVIEW;
    nextBtn.firstChild.textContent = i === REVIEW - 1 ? "Lihat ringkasan " : "Lanjut ";
    if (i === REVIEW) renderSummary();
    setStatus(status, "");
    if (!interactive) return;   // render awal TIDAK boleh memindahkan fokus atau menggulir halaman
    const heading = $("[data-step-heading]", panels[i]);
    if (heading) heading.focus({ preventScroll: true });
    const card = form.closest(".brief-card");
    if (card) {
      const r = card.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight) card.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  };

  const renderSummary = () => {
    const d = readBrief(form);
    const dl = $("#brief-summary");
    dl.innerHTML = briefPairs(d).filter(([, v]) => v).map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join("");
  };

  nextBtn.addEventListener("click", () => { if (validate(form, BRIEF_RULES[current])) go(current + 1, "next"); });
  prevBtn.addEventListener("click", () => go(Math.max(0, current - 1), "prev"));
  form.addEventListener("submit", (e) => { e.preventDefault(); if (current < REVIEW - 1) nextBtn.click(); else if (current === REVIEW - 1) nextBtn.click(); });
  $("[data-brief-edit]", form).addEventListener("click", () => go(0, "prev"));
  $("[data-brief-reset]", form).addEventListener("click", () => { form.reset(); go(0, "prev"); });

  const message = () => composeMessage("Hi Frontify, ini brief proyek saya:", briefPairs(readBrief(form)), "Mohon kabar langkah selanjutnya. Terima kasih!");
  $("[data-brief-wa]", form).addEventListener("click", () => deliverWhatsApp(message(), status, "Brief proyek"));
  $("[data-brief-mail]", form).addEventListener("click", () => sendEmail(message(), "Brief proyek", status));

  clearOnInput(form);
  go(0, "next", false);
}

/* ---------- Formulir kontak ---------- */
function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;
  const status = $("#contact-status");
  const rules = [
    ["c_name", "Nama perlu diisi."],
    ["c_message", "Tulis sedikit tentang kebutuhanmu (minimal 10 karakter).", (v) => v.trim().length >= 10],
  ];
  const build = () => composeMessage("Hi Frontify Creative,", [
    ["Nama", form.elements.c_name.value], ["Kebutuhan", form.elements.c_service.value], ["Pesan", form.elements.c_message.value],
  ]);
  form.addEventListener("submit", (e) => { e.preventDefault(); if (validate(form, rules)) deliverWhatsApp(build(), status); });
  $("[data-contact-mail]", form).addEventListener("click", () => { if (validate(form, rules)) sendEmail(build(), CONFIG.emailSubject, status); });
  clearOnInput(form);

  window.addEventListener("fc:prefill", (e) => {
    const { service, message } = e.detail || {};
    const select = form.elements.c_service;
    if (service && select && Array.from(select.options).some((o) => o.value === service)) select.value = service;
    if (message && !form.elements.c_message.value.trim()) form.elements.c_message.value = message;
  });
}

/* ---------- Tautan kontak & tombol melayang ---------- */
function initContactLinks() {
  const greeting = "Hi Frontify! Saya ingin berkonsultasi mengenai Jasa Pembuatan web";
  const wa = whatsappUrl(greeting);
  $$("[data-wa-link]").forEach((a) => {
    if (wa) { a.href = wa; a.target = "_blank"; a.rel = "noopener noreferrer"; }
    else { a.href = "#contact-form"; a.removeAttribute("target"); }
  });
  $$("[data-email-link]").forEach((a) => { a.href = mailtoUrl(CONFIG.emailSubject, ""); });
  $$("[data-email-text]").forEach((el) => { el.textContent = CONFIG.email; });
  $$("[data-social]").forEach((a) => {
    const url = CONFIG.social[a.dataset.social];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; }
  });
  if (!hasWhatsApp()) console.warn("[Frontify] Nomor WhatsApp belum diatur — isi CONFIG.whatsappNumber di js/config.js.");
}

export function initContact() {
  initContactLinks();
  initBrief();
  initContactForm();
}
