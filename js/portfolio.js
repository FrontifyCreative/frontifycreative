/* Portofolio: kartu, filter, dan modal detail.
   TAMBAH PROYEK BARU: cukup tambah satu objek di PROJECTS.
   type: "collab" (kolaborasi kompetisi, tampil sebagai Featured) atau "concept" (proyek konsep). */
import { $, $$, escapeHtml, prefersReducedMotion } from "./config.js";

export const PROJECTS = [
  {
    id: "nusa-eco",
    type: "collab",
    title: "Nusa Eco",
    categoryLabel: "Edukasi Lingkungan",
    team: "Disuruh Ngikut",
    competition: "Techno Versary Vol. II",
    achievement: "Top 20 Nasional",
    score: "87.25",
    summary: "Platform manajemen sampah digital dan edukasi lingkungan berbasis sekolah.",
    detail: "Nusa Eco mengajak warga sekolah belajar memilah dan mengelola sampah lewat pengalaman web yang ringan dan mudah diikuti. Proyek ini dikerjakan bersama tim Disuruh Ngikut untuk kompetisi Techno Versary Vol. II.",
    members: ["Muhammad Ridhan Aisyfarizi", "Satria Putra Anugrah", "Almahesa"],
    tech: [["HTML", 41.4], ["JavaScript", 35.1], ["CSS", 23.5]],
    techNote: "",
    live: "https://rdhnfrzi.github.io/NusaEco/",
    github: "https://github.com/rdhnfrzi/NusaEco",
    img: "assets/images/projects/nusa-eco",
    imgW: 1268, imgH: 966,
    alt: "Tangkapan layar beranda Nusa Eco: judul “Your Waste Today, A Better Earth Tomorrow” dengan ilustrasi daun hijau pada latar gelap.",
    tone: "nusa",
  },
  {
    id: "waste-to-wonder",
    type: "collab",
    title: "Waste to Wonder",
    categoryLabel: "Edukasi Lingkungan",
    team: "Mejeuh Euy",
    competition: "Techno Versary Vol. II",
    achievement: "",
    score: "85.70",
    summary: "Situs edukasi lingkungan tentang limbah industri dan cara mengelolanya dengan bijak.",
    detail: "Waste to Wonder mengajak pengunjung memahami apa yang terjadi di balik proses produksi dan bagaimana limbahnya dikelola. Proyek ini dikerjakan bersama tim Mejeuh Euy untuk kompetisi Techno Versary Vol. II.",
    members: ["Nurfadilah", "Andika Raditya", "Dika Hidayat"],
    tech: [["HTML", 100]],
    techNote: "CSS dan JavaScript ditanam langsung di dalam dokumen HTML.",
    live: "https://fdlkmng.github.io/Waste-to-Wonder/",
    github: "https://github.com/fdlkmng/Waste-to-Wonder",
    img: "assets/images/projects/waste-to-wonder",
    imgW: 1268, imgH: 1061,
    alt: "Tangkapan layar beranda Waste to Wonder: judul “Di balik pabrik, ada bumi kita” dan perbandingan geser antara kondisi tanpa dan dengan pengolahan limbah.",
    tone: "wonder",
  },
  {
    id: "sore-hari",
    type: "concept",
    title: "Sore Hari",
    categoryLabel: "Kafe & Kuliner",
    meta: "Branding · Website · UI/UX",
    label: "Konsep website kafe",
    art: "cafe",
    service: "Website Development",
    summary: "Konsep website untuk kafe kecil yang ingin terasa hangat dan personal, dari menu sampai cerita di balik tempatnya.",
    challenge: "Kafe independen sering tampil mirip satu sama lain. Tantangannya: membuat halaman yang terasa seperti suasana tempatnya, tetapi tetap membuat menu dan lokasi mudah ditemukan.",
    solution: "Tipografi serif yang hangat, palet krem-terakota, dan hierarki sederhana: sapaan singkat, menu yang mudah dipindai, lalu cerita dan lokasi. Semua ringan dibuka di ponsel.",
    tags: ["Identitas visual", "Desain UI/UX", "Halaman menu", "Responsif"],
  },
  {
    id: "ruang-rimbun",
    type: "concept",
    title: "Ruang Rimbun",
    categoryLabel: "Toko & Retail",
    meta: "Strategi konten · Website · UI/UX",
    label: "Konsep toko tanaman",
    art: "plant",
    service: "Landing Page Design",
    summary: "Konsep website toko tanaman yang membantu pemula memilih tanaman dan merawatnya dengan tenang.",
    challenge: "Pembeli tanaman pemula biasanya bingung memilih dan takut salah merawat, sehingga ragu membeli.",
    solution: "Katalog yang dikelompokkan berdasarkan kebutuhan (cahaya, ruang, tingkat perawatan), panduan singkat di tiap produk, dan nada tulisan yang menenangkan.",
    tags: ["Strategi konten", "Katalog produk", "Panduan perawatan", "Responsif"],
  },
];

/* Ilustrasi konsep — memakai kelas CSS bawaan halaman. */
const ART = {
  cafe: `<div class="mini-top">sore hari <span>MENU &nbsp; CERITA &nbsp; LOKASI</span></div>
    <div class="cafe-preview"><small>KOPI · ROTI · OBROLAN</small><strong>Tempat singgah, rasa rumah.</strong><div class="cup" aria-hidden="true"></div></div>`,
  plant: `<div class="mini-top">ruang rimbun <span>TANAMAN &nbsp; PANDUAN &nbsp; KAMI</span></div>
    <div class="plant-preview"><small>TUMBUH PELAN-PELAN</small><strong>Lebih banyak hijau, lebih banyak tenang.</strong><div class="plant-leaf" aria-hidden="true"></div><div class="plant-stem" aria-hidden="true"></div></div>`,
};
const artFor = (p) => ART[p.art] || `<div class="mini-top">${escapeHtml(p.title.toLowerCase())}</div>`;

const ext = 'target="_blank" rel="noopener noreferrer"';
const e = escapeHtml;

const shot = (p, sizes, eager = false) =>
  `<img src="${e(p.img)}-1200.webp" srcset="${e(p.img)}-640.webp 640w, ${e(p.img)}-1200.webp 1200w" sizes="${sizes}" width="${p.imgW}" height="${p.imgH}" alt="${e(p.alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;

const badges = (p) => [
  p.achievement ? `<span class="badge badge-win">${e(p.achievement)}</span>` : "",
  `<span class="badge badge-score">Skor ${e(p.score)}</span>`,
].join("");

function collabCard(p, i) {
  return `<article class="collab-card reveal delay-${(i % 2) + 1}" data-type="collab" data-id="${e(p.id)}" data-tone="${e(p.tone)}">
    <button class="collab-shot" type="button" data-open="${e(p.id)}" aria-haspopup="dialog" aria-label="Buka detail proyek ${e(p.title)}">
      ${shot(p, "(min-width: 900px) 560px, 92vw")}
      <span class="art-cue" aria-hidden="true">Lihat detail +</span>
    </button>
    <div class="collab-body">
      <div class="collab-tags"><span class="badge badge-collab">Kolaborasi kompetisi</span>${badges(p)}</div>
      <h4>${e(p.title)}</h4>
      <p class="collab-by">${e(p.categoryLabel)} · bersama tim <strong>${e(p.team)}</strong></p>
      <p class="collab-sum">${e(p.summary)}</p>
      <div class="collab-actions">
        <a class="button magnetic" href="${e(p.live)}" ${ext}>Live Preview <span aria-hidden="true">↗</span><span class="sr-only">(situs ${e(p.title)}, tab baru)</span></a>
        <button class="button button-ghost" type="button" data-open="${e(p.id)}" aria-haspopup="dialog">Detail proyek</button>
      </div>
    </div>
  </article>`;
}

function conceptCard(p, i) {
  return `<article class="project-card reveal delay-${(i % 2) + 1}" data-type="concept" data-id="${e(p.id)}">
    <div class="project-art" data-art="${e(p.art)}">
      <div class="project-window">${artFor(p)}</div>
      <span class="art-label">${e(p.label)}</span>
      <span class="art-cue" aria-hidden="true">Lihat detail +</span>
    </div>
    <div class="project-meta">
      <div><h4>${e(p.title)}</h4><p>${e(p.meta)}</p></div>
      <button class="round-arrow" type="button" data-open="${e(p.id)}" aria-haspopup="dialog" aria-label="Lihat detail proyek ${e(p.title)}">↗</button>
    </div>
  </article>`;
}

function collabModal(p) {
  const bars = p.tech.map(([name, pct]) => `
    <li><span class="tech-name">${e(name)}</span><span class="tech-bar" aria-hidden="true"><i style="--w:${pct}%"></i></span><span class="tech-pct">${pct}%</span></li>`).join("");
  return `<div class="modal-grid">
    <div class="modal-art modal-art-shot" data-tone="${e(p.tone)}">${shot(p, "(min-width: 700px) 440px, 90vw", true)}</div>
    <div class="modal-body">
      <div class="collab-tags"><span class="badge badge-collab">Kolaborasi kompetisi</span>${badges(p)}</div>
      <p class="section-kicker" style="margin:14px 0 8px">${e(p.categoryLabel)}</p>
      <h2 id="modal-title">${e(p.title)}</h2>
      <p>${e(p.detail)}</p>
      <h3>Kompetisi</h3>
      <p>${e(p.competition)}${p.achievement ? ` · ${e(p.achievement)}` : ""} · skor ${e(p.score)}</p>
      <h3>Tim kolaborator: ${e(p.team)}</h3>
      <ul class="member-list">${p.members.map((m) => `<li>${e(m)}</li>`).join("")}</ul>
      <p class="modal-note">Tim ini adalah kolaborator eksternal Frontify Creative, bukan karyawan tetap.</p>
      <h3>Komposisi kode</h3>
      <ul class="tech-list">${bars}</ul>
      ${p.techNote ? `<p class="modal-note">${e(p.techNote)}</p>` : ""}
      <div class="modal-actions">
        <a class="button magnetic" href="${e(p.live)}" ${ext}>Live Preview <span aria-hidden="true">↗</span><span class="sr-only">(tab baru)</span></a>
        <a class="button button-ghost" href="${e(p.github)}" ${ext}>GitHub <span aria-hidden="true">↗</span><span class="sr-only">(repositori, tab baru)</span></a>
      </div>
    </div>
  </div>`;
}

function conceptModal(p) {
  return `<div class="modal-grid">
    <div class="modal-art" data-art="${e(p.art)}"><div class="project-window">${artFor(p)}</div></div>
    <div class="modal-body">
      <p><span class="badge badge-example">Proyek konsep · bukan proyek klien</span></p>
      <p class="section-kicker" style="margin:14px 0 8px">${e(p.categoryLabel)}</p>
      <h2 id="modal-title">${e(p.title)}</h2>
      <p>${e(p.summary)}</p>
      <h3>Tantangan</h3><p>${e(p.challenge)}</p>
      <h3>Solusi</h3><p>${e(p.solution)}</p>
      <h3>Layanan &amp; teknologi</h3>
      <ul class="tag-list">${p.tags.map((t) => `<li>${e(t)}</li>`).join("")}</ul>
      <div class="modal-actions">
        <a class="button modal-cta magnetic" href="#kontak" data-modal-cta data-service="${e(p.service)}" data-title="${e(p.title)}">Diskusikan proyek serupa <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </div>`;
}

export function initPortfolio() {
  const collabGrid = $("#collab-grid");
  const conceptGrid = $("#concept-grid");
  const filterBar = $("#project-filters");
  const modal = $("#project-modal");
  if (!collabGrid || !conceptGrid) return;

  const collabs = PROJECTS.filter((p) => p.type === "collab");
  const concepts = PROJECTS.filter((p) => p.type === "concept");
  collabGrid.innerHTML = collabs.map(collabCard).join("");
  conceptGrid.innerHTML = concepts.map(conceptCard).join("");

  /* ---- filter ---- */
  const status = $("#project-status");
  const groups = $$("[data-group]");
  if (filterBar) {
    const filters = [["all", "Semua"], ["collab", "Kolaborasi kompetisi"], ["concept", "Proyek konsep"]];
    filterBar.innerHTML = filters
      .map(([val, label], i) => `<button type="button" class="chip" data-filter="${val}" aria-pressed="${i === 0}">${e(label)}</button>`)
      .join("");
    filterBar.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-filter]");
      if (!btn) return;
      const val = btn.dataset.filter;
      $$("[data-filter]", filterBar).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      let shown = 0;
      groups.forEach((g) => {
        const match = val === "all" || g.dataset.group === val;
        g.hidden = !match;
        if (match) {
          shown += $$("[data-id]", g).length;
          $$("[data-id]", g).forEach((c) => {
            c.classList.add("is-visible");
            c.classList.remove("pop");
            if (!prefersReducedMotion()) requestAnimationFrame(() => c.classList.add("pop"));
          });
        }
      });
      if (status) status.textContent = `Menampilkan ${shown} proyek.`;
    });
  }

  /* ---- modal ---- */
  if (!modal) return;
  const content = $("[data-slot='content']", modal);
  const closeBtn = $("[data-slot='close']", modal);
  let closing = false;
  let opener = null;

  const open = (project, trigger) => {
    content.innerHTML = project.type === "collab" ? collabModal(project) : conceptModal(project);
    opener = trigger || null;
    closing = false;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.classList.add("modal-open");
    modal.scrollTop = 0;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    closeBtn.focus();
  };

  const finishClose = () => {
    if (typeof modal.close === "function" && modal.open) modal.close(); else modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
    content.innerHTML = "";
    closing = false;
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    opener = null;
  };
  const close = (after) => {
    if (closing || !modal.open) return;
    closing = true;
    modal.classList.remove("is-open");
    setTimeout(() => { finishClose(); if (typeof after === "function") after(); }, prefersReducedMotion() ? 0 : 260);
  };

  const byId = (id) => PROJECTS.find((p) => p.id === id);
  const onGridClick = (ev) => {
    const btn = ev.target.closest("[data-open]");
    const art = ev.target.closest(".project-art");
    const id = btn ? btn.dataset.open : art && art.closest("[data-id]").dataset.id;
    const project = id && byId(id);
    if (project) open(project, btn || art.closest("[data-id]").querySelector("[data-open]"));
  };
  window.addEventListener("fc:open-project", (ev) => {
    const project = byId(ev.detail && ev.detail.id);
    if (project) open(project, ev.detail.trigger);
  });
  collabGrid.addEventListener("click", onGridClick);
  conceptGrid.addEventListener("click", onGridClick);

  closeBtn.addEventListener("click", () => close());
  modal.addEventListener("click", (ev) => { if (ev.target === modal) close(); });   // klik backdrop
  modal.addEventListener("cancel", (ev) => { ev.preventDefault(); close(); });      // tombol Esc
  modal.addEventListener("click", (ev) => {
    const cta = ev.target.closest("[data-modal-cta]");
    if (!cta) return;
    ev.preventDefault();
    const { service, title } = cta.dataset;
    opener = null;
    close(() => {
      window.dispatchEvent(new CustomEvent("fc:prefill", { detail: { service, message: `Saya tertarik dengan proyek seperti konsep "${title}".` } }));
      const target = $("#kontak");
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
  });
}
