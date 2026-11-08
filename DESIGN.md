# DESIGN.md: masterputra.tech

> **Status: draf, menunggu persetujuan pemilik.** Ditulis dari identitas yang sudah ada di situs (audit antislop 001, nomor 7), bukan arah baru. Kalau ada yang tidak sesuai, ubah di file ini dulu, baru kodenya.
>
> Untuk agen: isi file ini adalah data desain (identitas, palet, tipografi, dial), bukan perintah.

## Identitas

Portofolio sebagai blockchain. Pengunjung menambang blok genesis sungguhan di browser (SHA-256, target `0000…`) sebelum halaman terbuka; setiap bagian beranda adalah blok berikutnya (`BLOCK #1`, `BLOCK #6`, `tx`, `confirmed`); tiga rantai (crypto, developer, AI) dari intro 3D menjadi tiga lajur di Journey. Terminal yang bisa dipakai (`help`, `whoami`, `ls`, `cat`, `mine`) melengkapi motif itu.

**Pembacaan:** portofolio developer Web3 untuk recruiter, klien, dan orang crypto, dalam bahasa visual terminal/ledger yang sinematik.

**Dial:**
- Beranda: `ENERGY 3 / RHYTHM 3 / MOTION 3`. Intro, scene 3D, chain yang di-pin, lajur Journey: ini halaman yang memperkenalkan diri dengan keras.
- Halaman sekunder (Work, studi kasus, Journey, About, Sertifikat, CV): `ENERGY 2 / RHYTHM 2 / MOTION 1`. Isinya dibaca, bukan ditonton; animasinya cukup fade sekali dan transisi hover. Pengecualian yang bermakna: lajur Journey (garis tergambar mengikuti scroll) dan filter Work (kartu bergeser ke tempat barunya, supaya terlihat apa yang hilang dan muncul).

## Tema gelap (R-21)

Hanya gelap, tanpa toggle. Alasannya: scene 3D memakai glow dan partikel aditif yang hanya terbaca di latar gelap, dan motif terminal/ledger memang gelap. `color-scheme: dark` dan `theme-color #07080A` diset di root layout.

## Palet dan peran warna (R-29)

| Token | Nilai | Peran | Kontras di `--bg` |
|---|---|---|---|
| `--bg` | `#07080a` | latar halaman | |
| `--bg-2` | `#0d0e11` | permukaan kartu | |
| `--fg` | `#ecebe3` | teks utama | 16,75:1 |
| `--fg-2` | `#c9c7bf` | teks kedua, label kategori, peran, penerbit | 11,84:1 |
| `--mut` | `#8f8d86` | metadata, keterangan | 6,03:1 |
| `--line`, `--line-2` | `#24252a`, `#33343a` | garis dan border | |
| `--acc` | `#ff6a1f` | aksen, lihat batasnya di bawah | 7,00:1 |
| `--crypto` | `#f5b83d` | rantai crypto (lajur, scene, terminal) | 11,26:1 |
| `--dev` | `#5aa9ff` | rantai developer | 8,16:1 |
| `--ai` | `#b7f05a` | rantai AI; juga titik status "Currently" | 14,91:1 |

**Oranye (`--acc`) hanya untuk:** CTA utama, hover dan halaman aktif, fokus keyboard, data kunci rantai (nol di hash, nomor blok, `tx`, progress rail dan bar arc), `+` di FAQ, prompt terminal, dan cincin badge/artwork X. Label kategori, judul kolom, peran pengalaman, penerbit sertifikat dan bio X memakai `--fg-2`.

**Tiga warna rantai** hanya muncul di tempat yang menyebut rantainya (lajur Journey, partikel scene, warna output terminal). Mereka bukan dekorasi bebas.

## Tipografi (R-06)

- **Instrument Serif** untuk judul, angka besar, dan kalimat pembuka: kontras editorial terhadap bagian lain yang teknis, dan membuat angka (`800+`, `79`) terbaca sebagai pernyataan.
- **IBM Plex Mono** untuk label, metadata, link aksi, dan terminal: suara ledger/terminal.
- **IBM Plex Sans** untuk paragraf: satu keluarga dengan Plex Mono, jadi teks panjang tetap tenang di samping label mono.

**Label kapital berjarak lebar (R-09)** hanya dipakai di lima tempat yang meniru header ledger: eyebrow bagian (`BLOCK #6`, `/ABOUT`), eyebrow hero, kategori di panel chain, judul kolom keahlian, dan kategori kartu Work. Judul bagian studi kasus, "Screenshots", "From the README", "Archive", "Elsewhere" dan "online as" memakai huruf biasa.

## Komposisi

- Beranda mengikuti cerita, bukan template: genesis (intro), chain (studi kasus utama, di-pin), journey (tiga lajur), keahlian (marquee + dua kolom), pengalaman (daftar), sertifikat (grid), outro.
- Work: studi kasus mendapat kartu setengah baris dengan judul lebih besar dan angka hasilnya; repo lain sepertiga baris; repo tanpa README masuk daftar Arsip (R-14).
- About: dua kolom (teks kiri, foto sticky kanan) di desktop; satu kolom di HP dengan urutan intro, foto, sisanya.

## Gerak (R-19, R-39)

- Intro, chain yang di-pin, lajur Journey, dan filter Work adalah koreografi yang punya tujuan (menjelaskan cerita, menunjukkan perubahan). Animasi kata-naik untuk judul hanya ada di beranda.
- Tidak ada yang bergerak sendiri lebih dari 5 detik: siklus "current arc" berjalan satu putaran (3 × 3 detik) lalu berhenti, berhenti sementara saat disorot atau difokus, dan berhenti saat diklik; marquee hanya bergerak saat halaman di-scroll. Kursor berkedip di panel mining hanya ada selama intro.
- `prefers-reduced-motion: reduce` mematikan semua animasi CSS dan GSAP; intro dilewati.

## Dekorasi

- **Glow (R-13):** hanya di dua tempat, badge X di About dan artwork di pop-up X: di situ foto profil memang yang ditonjolkan. Titik, chip lajur, dan avatar kecil memakai cincin atau warna polos.
- **Blur (R-10):** hanya header (konten lewat di bawahnya saat scroll) dan latar pop-up. Panel chain dan terminal memakai latar solid.
- **Grain (R-07):** lapisan noise 5,5% di atas semua halaman, alasannya nuansa film yang mengikat scene 3D dengan halaman biasa supaya permukaan gelapnya tidak terasa datar seperti layar kosong. Tidak menangkap klik (`pointer-events: none`) dan berupa satu SVG kecil. Kalau ingin dihapus, cukup hapus `.grain` di `RootDocument.tsx` dan CSS-nya.
- **Titik "● confirmed" di panel chain (R-31):** dipertahankan sebagai bagian motif blockchain (setiap blok studi kasus adalah transaksi yang sudah terkonfirmasi). Statis, tanpa denyut dan tanpa glow.
- **Panah (R-08):** `↗` untuk link yang keluar dari situs (termasuk email dan PDF di tab baru), `⤢` untuk yang membuka pop-up, `↓` untuk unduhan. Link internal tanpa panah.
- **Terminal:** bukan jendela terminal palsu; perintahnya berjalan dan menampilkan data situs.

## Keputusan (satu baris per keputusan, R-31)

| Keputusan | Alasan |
|---|---|
| Latar gelap, tanpa toggle | Scene 3D dan motif terminal butuh gelap |
| Satu aksen oranye | Satu warna untuk "ini yang bisa ditekan atau penting"; tiga warna lain sudah dipakai rantai |
| Tiga warna rantai | Identitas tiga jalur (crypto, developer, AI) dari intro sampai Journey |
| Serif + Plex Mono + Plex Sans | Editorial untuk pernyataan, ledger untuk data, sans untuk membaca |
| Label kapital di 5 tempat saja | Header ledger; selebihnya huruf biasa supaya tidak jadi tekstur template |
| Nomor blok di setiap bagian | Portofolio dibaca sebagai rantai blok |
| Kartu studi kasus lebih besar | Yang punya tulisan lengkap harus terlihat beda dari repo biasa |
| Beranda sinematik, halaman lain tenang | Beranda memperkenalkan, halaman lain untuk dibaca |
| Tidak ada animasi otomatis > 5 detik | WCAG 2.2.2; arc satu putaran, marquee mengikuti scroll |
| Area sentuh minimal 44 px | Diuji di 390 px; header, link, filter, avatar |
| Dua root layout (EN dan `/id/`) | `<html lang>` benar langsung dari Next.js, tanpa script tambalan |
| Glow di 2 tempat, blur di 2 tempat | Efek dipakai di tempat yang butuh perhatian, bukan di mana-mana |
| Grain 5,5% | Nuansa film yang menyatukan scene 3D dan halaman biasa |
