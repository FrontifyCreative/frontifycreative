# Frontify Creative — Professional Upgrade

**Code. Create. Inspire.** Situs studio kreatif digital Frontify Creative (HTML, CSS, JavaScript murni, tanpa framework).

## Menjalankan
- **VS Code Live Server:** klik kanan `projectfc2.html` → *Open with Live Server*.
- **Terminal:** `python3 -m http.server 8000`, lalu buka `http://localhost:8000/projectfc2.html`.

JavaScript memakai ES module, jadi situs **tidak berjalan lewat `file://`** (klik dua kali). Gunakan server lokal.

## Struktur
```
projectfc2.html          halaman utama (gaya dasar asli tetap inline di <head>)
css/interaction.css      token tema terang/gelap, komponen, animasi
js/main.js               titik masuk: tema, navigasi, accordion, reset scroll
js/animations.js         reveal, parallax hero, tombol magnetik, headline berputar, timeline
js/portfolio.js          data proyek, kartu, filter, modal detail
js/contact.js            brief multi-langkah, formulir kontak, pesan WhatsApp / email
js/config.js             kontak resmi + helper bersama
assets/                  logo, favicon, assets/images/projects (screenshot WebP 640w & 1200w)
media/                   file sumber asli (NusaEco.jpeg, Waste2Wonder.jpeg, logo)
```

## Mengubah isi
- **Kontak resmi:** `js/config.js` (`whatsappNumber` format internasional `6285134739720`, `email`, `social`).
- **Proyek portofolio:** array `PROJECTS` di `js/portfolio.js`. `type: "collab"` untuk kolaborasi kompetisi (tampil di *Featured Collaborations*), `type: "concept"` untuk proyek konsep.
- **Layanan:** bagian `#layanan` di `projectfc2.html`.

## Yang diubah pada upgrade ini
- Portofolio dibagi **Featured Collaborations** (Nusa Eco, Waste to Wonder) dan **Concept & Experimental Works** (Sore Hari, Ruang Rimbun), lengkap dengan filter, lencana kompetisi/skor, tim, komposisi kode, tombol Live Preview + GitHub, dan modal detail yang aksesibel.
- Bagian baru: **Our Creative Network** (dua tim kolaborator eksternal), **Tentang** (filosofi) dan **Meet Our Creative Team** (satu tim, enam personel), enam **Layanan** resmi.
- Kontak diperbarui: WhatsApp CS, email, Instagram, TikTok, Telegram; formulir dengan validasi, pesan WhatsApp otomatis, dan cadangan email.
- **Dihapus bersih:** estimator harga (`js/calculator.js`, impor, CSS terkait), scroll progress bar, carousel testimoni berisi placeholder. Tidak ada kursor kustom.
- Perbaikan: tombol outline (ghost) yang teksnya tak terbaca, area sentuh minimal 44px, gambar proyek WebP dengan `srcset` dan `loading="lazy"`.

## Batasan
- **Tidak ada backend.** Formulir hanya menyusun pesan lalu membuka WhatsApp atau aplikasi email pengunjung; tidak ada data yang tersimpan di server. Status yang ditampilkan menyatakan hal ini apa adanya.
- **Tidak ada pratinjau tertanam (iframe)** untuk proyek kolaborasi; Live Preview membuka situs aslinya di tab baru.
- Font DM Sans dimuat dari Google Fonts; saat offline, font cadangan sistem dipakai.
- Link eksternal (situs proyek, GitHub, media sosial) tidak dapat diuji dari lingkungan pengembangan tanpa internet; atribut dan URL-nya sudah diperiksa, tetapi buka sendiri sekali untuk memastikan.
- Isi FAQ masih bersifat umum dan perlu disesuaikan oleh pemilik. Skema kisaran budget di brief adalah pilihan untuk klien, bukan harga Frontify Creative.
