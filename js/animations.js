/* Animasi & efek visual. Semua efek dimatikan/diperhalus bila prefers-reduced-motion. */
import { $, $$, prefersReducedMotion, clamp } from "./config.js";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* 1. Scroll reveal (IntersectionObserver) --------------------------------- */
export function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  items.forEach((el) => observer.observe(el));
}

/* 2. Parallax: mouse di hero + scroll halus ------------------------------- */
export function initParallax() {
  if (prefersReducedMotion()) return;

  const hero = $(".hero-art");
  if (hero && finePointer()) {
    const layers = $$("[data-depth]", hero).map((el) => ({ el, depth: parseFloat(el.dataset.depth) || 0.3, cx: 0, cy: 0 }));
    let tx = 0, ty = 0, raf = 0;
    const loop = () => {
      let moving = false;
      layers.forEach((l) => {
        l.cx += (tx * l.depth - l.cx) * 0.1;
        l.cy += (ty * l.depth - l.cy) * 0.1;
        if (Math.abs(tx * l.depth - l.cx) > 0.05 || Math.abs(ty * l.depth - l.cy) > 0.05) moving = true;
        l.el.style.translate = `${l.cx.toFixed(2)}px ${l.cy.toFixed(2)}px`;
      });
      raf = moving ? requestAnimationFrame(loop) : 0;
    };
    const aim = (nx, ny) => { tx = nx * -40; ty = ny * -40; if (!raf) raf = requestAnimationFrame(loop); };
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      aim((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    });
    hero.addEventListener("pointerleave", () => aim(0, 0));
  }

  const scrollers = $$("[data-scroll-speed]");
  if (scrollers.length) {
    let ticking = false;
    const update = () => {
      ticking = false;
      scrollers.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
        const offset = (r.top + r.height / 2 - window.innerHeight / 2) * parseFloat(el.dataset.scrollSpeed);
        el.style.translate = `0 ${(-offset).toFixed(1)}px`;
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
}

/* 3. Magnetic buttons ------------------------------------------------------ */
export function initMagnetic() {
  if (!finePointer() || prefersReducedMotion()) return;
  $$(".magnetic").forEach((el) => {
    if (el.dataset.magneticBound) return; // cegah listener ganda
    el.dataset.magneticBound = "1";
    el.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.32).toFixed(1)}px`;
    });
    el.addEventListener("pointerleave", () => { el.style.translate = ""; });
  });
}

/* 4. Hero: headline berputar ---------------------------------------------- */
export function initHeroRotator() {
  const host = $("[data-rotator]");
  if (!host) return;
  const words = (host.dataset.words || "").split("|").map((w) => w.trim()).filter(Boolean);
  if (words.length < 2) return;

  host.textContent = "";
  host.classList.add("rotator");
  const spans = words.map((word, i) => {
    const s = document.createElement("span");
    s.textContent = word;
    if (i !== 0) s.setAttribute("aria-hidden", "true");
    host.append(s);
    return s;
  });
  spans[0].classList.add("is-active");
  if (prefersReducedMotion()) return;

  const CYCLES = 2; // berhenti sendiri di kata pertama (WCAG 2.2.2)
  let index = 0, step = 0, timer = 0, paused = false;
  const total = words.length * CYCLES;

  const next = () => {
    if (paused || document.hidden) return;
    const prev = spans[index];
    step += 1;
    index = step % words.length;
    prev.classList.remove("is-active"); prev.classList.add("is-leaving"); prev.setAttribute("aria-hidden", "true");
    spans[index].classList.add("is-active"); spans[index].removeAttribute("aria-hidden");
    setTimeout(() => prev.classList.remove("is-leaving"), 650);
    if (step >= total) clearInterval(timer);
  };
  timer = setInterval(next, 2600);
  const h1 = host.closest("h1");
  if (h1) {
    h1.addEventListener("pointerenter", () => { paused = true; });
    h1.addEventListener("pointerleave", () => { paused = false; });
  }
}

/* 5. Timeline proses ------------------------------------------------------- */
export function initTimeline() {
  const wrap = $(".steps");
  const steps = $$(".step", wrap || document);
  if (!wrap || steps.length < 2) return;
  let ticking = false;

  const update = () => {
    ticking = false;
    const mark = window.innerHeight * 0.55;
    const centers = steps.map((s) => { const r = s.getBoundingClientRect(); return r.top + r.height / 2; });
    const start = centers[0], end = centers[centers.length - 1];
    wrap.style.setProperty("--p", clamp((mark - start) / (end - start || 1), 0, 1).toFixed(3));
    let active = -1;
    centers.forEach((c, i) => { if (c <= mark) active = i; });
    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === active);
      s.classList.toggle("is-done", i < active);
      if (i === active) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* 6. Tim kreatif: cahaya halus mengikuti kursor di kartu ------------------- */
export function initTeamCards() {
  if (!finePointer() || prefersReducedMotion()) return;
  $$(".crew-card-in").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
      card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
    });
  });
}
