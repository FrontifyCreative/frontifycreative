/* Titik masuk: navigasi, accordion, tombol kembali ke atas, lalu menyalakan modul lain.
   Setiap modul dibungkus safe() agar satu error tidak merusak seluruh situs. */
import { $, $$, prefersReducedMotion } from "./config.js";
import { initReveal, initParallax, initMagnetic, initHeroRotator, initTimeline, initTeamCards } from "./animations.js";
import { initPortfolio } from "./portfolio.js";
import { initContact } from "./contact.js";

const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`[Frontify] Modul "${name}" gagal dijalankan:`, err); } };
const smooth = () => (prefersReducedMotion() ? "auto" : "smooth");

/* Tema gelap / terang ------------------------------------------------------ */
const THEME_KEY = "fc-theme";
function initTheme() {
  const root = document.documentElement;
  const btn = $(".theme-toggle");
  if (!btn) return;
  const meta = $('meta[name="theme-color"]');
  let timer = 0;
  const saved = () => { try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; } };

  const apply = (theme, { persist = false, animate = false } = {}) => {
    if (animate && !prefersReducedMotion()) {
      root.classList.add("theme-anim");
      clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove("theme-anim"), 500);
    }
    root.setAttribute("data-theme", theme);
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    if (meta) meta.setAttribute("content", theme === "dark" ? "#161815" : "#f7f5ef");
    if (persist) { try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* penyimpanan diblokir */ } }
  };

  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  btn.addEventListener("click", (event) => {
    const theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (prefersReducedMotion()) {
      apply(theme, { persist: true });
      return;
    }

    if (typeof document.startViewTransition !== "function") {
      apply(theme, { persist: true, animate: true });
      return;
    }

    const rect = btn.getBoundingClientRect();
    const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
    const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    document.startViewTransition(() => apply(theme, { persist: true }));
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => { if (!saved()) apply(e.matches ? "dark" : "light"); });
}

/* Halaman selalu mulai dari hero ------------------------------------------- */
function resetScrollOnLoad() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  const toTop = () => { if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
  toTop();
  // satu kali setelah semua resource termuat, kecuali pengunjung sudah mulai berinteraksi
  let touched = false;
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => window.addEventListener(t, () => { touched = true; }, { once: true, passive: true }));
  window.addEventListener("load", () => { if (!touched) toTop(); }, { once: true });
}

/* Navigasi mobile + tautan aktif ------------------------------------------ */
function initNav() {
  const toggle = $(".menu-toggle");
  const nav = $("#site-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); } });
  document.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
  window.matchMedia("(min-width: 681px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });

  // sorot tautan sesuai bagian yang sedang dilihat
  const links = new Map($$("a[href^='#']", nav).map((a) => [a.getAttribute("href").slice(1), a]));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        const a = links.get(en.target.id);
        if (a) a.setAttribute("aria-current", "true");   // #beranda tidak punya tautan -> semua indikator padam
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    [...links.keys(), "beranda", "proses", "brief", "kontak"].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
}

/* Accordion generik (FAQ & layanan) --------------------------------------- */
function initDisclosures() {
  $$("[data-disclosure-group]").forEach((group) => {
    const exclusive = group.hasAttribute("data-exclusive");
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-disclosure]");
      if (!btn || !group.contains(btn)) return;
      const willOpen = btn.getAttribute("aria-expanded") !== "true";
      if (exclusive) $$("[data-disclosure][aria-expanded='true']", group).forEach((b) => toggle(b, false));
      toggle(btn, willOpen);
    });
  });
  function toggle(btn, open) {
    btn.setAttribute("aria-expanded", String(open));
    const item = btn.closest("[data-item]");
    if (item) item.classList.toggle("is-open", open);
    const label = $("[data-toggle-label]", btn);
    if (label) label.textContent = open ? "Tutup" : "Lihat detail";
  }
}

/* Tombol di luar portofolio yang membuka detail proyek */
function initProjectLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-open-project]");
    if (!a) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("fc:open-project", { detail: { id: a.dataset.openProject, trigger: a } }));
  });
}

/* Tautan yang mengisi otomatis formulir kontak ---------------------------- */
function initPrefillLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-prefill-service]");
    if (a) window.dispatchEvent(new CustomEvent("fc:prefill", { detail: { service: a.dataset.prefillService } }));
  });
}

/* Kembali ke atas + tahun footer ------------------------------------------ */
function initPageChrome() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const top = $(".fab-top");
  if (top) {
    let ticking = false;
    const update = () => { ticking = false; top.classList.toggle("is-visible", window.scrollY > 700); };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    top.addEventListener("click", () => {
      top.classList.remove("is-launching");
      requestAnimationFrame(() => top.classList.add("is-launching"));
      window.scrollTo({ top: 0, left: 0, behavior: smooth() });
    });
    top.addEventListener("animationend", () => top.classList.remove("is-launching"));
    update();
  }
}

function boot() {
  safe("scroll-reset", resetScrollOnLoad);
  safe("theme", initTheme);
  safe("portfolio", initPortfolio);   // render kartu dulu agar ikut animasi reveal
  safe("contact", initContact);
  safe("nav", initNav);
  safe("disclosure", initDisclosures);
  safe("prefill", initPrefillLinks);
  safe("project-links", initProjectLinks);
  safe("chrome", initPageChrome);
  safe("rotator", initHeroRotator);
  safe("timeline", initTimeline);
  safe("team-cards", initTeamCards);
  safe("parallax", initParallax);
  safe("magnetic", initMagnetic);
  safe("reveal", initReveal);
  document.documentElement.classList.add("js-ready");
}

boot();
