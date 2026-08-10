# Rencana Perubahan UI/UX (Overhaul)

Sesuai dengan permintaan Anda, saya telah menganalisis aplikasi Wotgalih secara keseluruhan. Saat ini aplikasi menggunakan tema warna hijau (emerald) yang cukup dominan dan beberapa tata letak (layout) mungkin masih terasa kaku di perangkat *mobile*. 

Tujuan dari perombakan ini adalah:
1. **Mengubah Tema Warna:** Transisi dari tema "Emerald/Hijau" ke tema "Biru" yang melambangkan kepercayaan, ketenangan, dan profesionalisme.
2. **Lebih *Friendly* & Modern:** Membuat elemen antarmuka (UI) lebih lembut dengan pinggiran yang lebih membulat (*rounded-2xl* / *rounded-3xl*), bayangan (*shadow*) yang halus, dan efek *hover* yang dinamis agar website terasa "hidup".
3. **Responsivitas Ekstra:** Memastikan semua halaman (*Katalog*, *Detail Produk*, *Linktree*, hingga *Dashboard*) nyaman dilihat dari layar HP sekecil apa pun hingga monitor besar.

---

> [!WARNING]
> Perombakan ini bersifat masif dan akan menyentuh hampir seluruh file antarmuka (UI) dalam proyek ini. 

## User Review Required
Silakan tinjau rincian perubahan di bawah. Jika Anda setuju dengan arah desain ini, tekan tombol **Proceed** dan saya akan mulai mengeksekusinya lapis demi lapis.

---

## Rincian Perubahan (Proposed Changes)

### 1. Global Color Theme (Tema Warna Utama)
- **Primary Color:** `emerald-*` akan diganti secara menyeluruh menjadi `blue-600` hingga `blue-900`. 
- **Accent/Secondary:** Penggunaan warna `amber` (oranye kekuningan) untuk teks harga atau *highlight* akan tetap dipertahankan (karena sangat cocok dan kontras dengan biru), atau diganti ke kuning emas (`yellow-500`) yang lebih lembut.
- **Backgrounds:** Menggunakan warna latar belakang yang sangat terang seperti `slate-50` atau `blue-50` agar konten UMKM lebih menonjol.

### 2. Public Pages (Beranda, Direktori UMKM, Detail UMKM & Produk)
- **Beranda (`app/(public)/page.tsx`):**
  - Mengganti latar belakang *hero section* dan elemen dekoratif gradasi ke perpaduan `blue` dan `cyan` / `indigo`.
  - Memperhalus *grid* daftar UMKM dan Kategori agar lebih proporsional di layar HP (`grid-cols-2` yang rapat menjadi `grid-cols-1` di layar sangat kecil, atau `grid-cols-2` dengan jarak (*gap*) yang optimal).
- **Halaman Profil UMKM (`app/(public)/umkm/[slug]/page.tsx`):**
  - *Banner* atas akan menggunakan gradasi biru elegan jika gambar *banner* belum diunggah.
  - Kartu produk (*Product Cards*) akan dibuat lebih modern (pinggiran lebih bulat, tombol beli lebih mencolok).
- **Halaman Detail Produk (`app/(public)/produk/[slug]/page.tsx`):**
  - Memperbesar visual produk dan memastikan tombol *WhatsApp* (yang sudah kita optimalkan sebelumnya) tetap memiliki warna hijau khas WhatsApp (`#25D366`), namun tombol pendukung lainnya (seperti "Kembali") akan diselaraskan dengan tema biru.

### 3. Linktree Page (`app/link/[slug]/page.tsx`)
- **Visual Belakang (*Background*):** 
  - Gradasi saat ini (`emerald-900` ke `slate-900`) akan diubah menjadi nuansa lautan atau langit malam (`blue-900` via `indigo-950` ke `slate-900`) untuk kesan premium.
- **Tombol Link:** 
  - *Glassmorphism* (efek kaca) akan ditingkatkan.
  - Warna ikon perusahaan (Shopee, Tokopedia, WA, IG) **TIDAK** akan diubah (karena itu *brand identity* mereka), namun tombol utama "Katalog Web" akan bernuansa kebiruan menyala.

### 4. Dashboard & Navigasi (Untuk Pemilik UMKM)
- **Sidebar & Mobile Nav:** 
  - Indikator halaman aktif (garis pinggir / *background highlight*) akan menggunakan warna biru muda (`blue-100` / `blue-600`).
- **Formulir (Input & Tombol):** 
  - Setiap input (*text field*) saat dalam kondisi aktif (*focus*) akan memancarkan *ring* biru (`focus:ring-blue-500`).
  - Tombol-tombol *Simpan*, *Tambah*, *Unduh QR* akan menggunakan warna biru utama.

---

## Verification Plan

Setelah saya menerapkan seluruh perubahan di atas, saya akan:
1. Memastikan tidak ada *error* kompilasi (*build errors*).
2. Mengecek ulang fungsionalitas utama (tombol WA, formulir simpan data) untuk memastikan perubahan hanya sebatas tampilan (UI) dan tidak merusak logika bisnis.
3. Mengunggah laporan penyelesaian (*Walkthrough*) untuk Anda periksa langsung di browser/simulator Anda.
