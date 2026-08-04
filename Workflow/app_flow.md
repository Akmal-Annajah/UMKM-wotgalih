# Flow Aplikasi - UMKM Wotgalih

Dokumen ini memetakan alur (*User Flow*) dari sisi Publik, UMKM, dan Admin di dalam sistem.

## 1. Flow Pengunjung (Publik)
Pengunjung tidak perlu memiliki akun untuk mengeksplorasi aplikasi.

1. **Akses Landing Page (`/`)**:
   - Pengunjung melihat *Hero section*, informasi desa, daftar kategori populer, dan beberapa UMKM serta produk terbaru.
2. **Eksplorasi Katalog UMKM (`/umkm`)**:
   - Pengunjung menekan menu "UMKM" untuk melihat seluruh daftar UMKM.
   - Bisa melakukan filter berdasarkan kategori atau pencarian nama.
3. **Melihat Detail UMKM (`/umkm/[slug]`)**:
   - Menampilkan profil UMKM secara spesifik (Logo, Banner, Deskripsi, Alamat, Peta).
   - Menampilkan daftar produk (katalog) yang dimiliki UMKM tersebut.
4. **Melihat Detail Produk (`/produk/[slug]`)**:
   - Menampilkan foto, harga, dan ketersediaan produk.
   - **Tindakan (Call to Action)**: Jika tertarik, pengunjung menekan tombol "Hubungi via WhatsApp".
   - Sistem akan mengarahkan (redirect) ke `wa.me` (WhatsApp Web/App) dengan format pesan yang sudah disiapkan otomatis, contoh: *"Halo [Nama UMKM], saya tertarik dengan produk [Nama Produk]. Apakah masih tersedia?"*

## 2. Flow Login & Autentikasi (`/login`)
Berlaku untuk Admin dan Pemilik UMKM.
1. Masuk ke halaman `/login`.
2. Input Email dan Password.
3. Middleware akan mengecek *Session* dan atribut *Role*.
   - Jika Role = `admin` ➔ *Redirect* ke `/dashboard/admin`
   - Jika Role = `umkm` ➔ *Redirect* ke `/dashboard/umkm`
4. Jika tidak login namun mencoba mengakses `/dashboard/*` ➔ *Redirect* otomatis ke `/login`.

## 3. Flow Dashboard UMKM (`/dashboard/umkm`)
Terbatas untuk role `umkm`.
1. **Masuk ke Dashboard (`/dashboard/umkm`)**: Menampilkan statistik singkat (jumlah produk) dan notifikasi kelengkapan profil.
2. **Kelola Profil (`/dashboard/umkm/profile`)**:
   - *Form* update informasi (Deskripsi, Kontak, Alamat, Sosial Media).
   - Upload Logo dan Banner (Sistem mengunggah ke Supabase Storage, mengembalikan URL, lalu menyimpannya ke *database*).
3. **Kelola Produk (`/dashboard/umkm/products`)**:
   - Melihat *table/list* produk.
   - **Tambah Produk**: Buka *modal/page* tambah produk (Input detail + Upload foto).
   - **Edit Produk**: Mengubah harga, status ketersediaan, atau foto.
   - **Hapus Produk**: Memunculkan konfirmasi dialog penghapusan.

## 4. Flow Dashboard Admin (`/dashboard/admin`)
Terbatas untuk role `admin`.
1. **Masuk ke Dashboard (`/dashboard/admin`)**: Menampilkan ringkasan metrik (Total UMKM, Kategori, dsb).
2. **Kelola Kategori (`/dashboard/admin/categories`)**:
   - Tambah, Edit, Hapus kategori utama aplikasi.
3. **Kelola UMKM (`/dashboard/admin/umkm`)**:
   - Melihat seluruh UMKM yang ada.
   - **Registrasi UMKM Baru**: Admin membuatkan akun (Email & Password), sistem mendaftarkan ke Supabase Auth, kemudian profil di tabel `umkms` terbuat, serta Admin memilih kategori yang sesuai.
   - **Toggle Status**: Mengaktifkan atau menonaktifkan UMKM agar tidak muncul di publik jika melanggar ketentuan.
4. **Kelola Produk (Master) (`/dashboard/admin/products`)**:
   - Admin dapat melihat semua produk lintas-UMKM (untuk pengawasan).
5. **Kelola User (Opsional) (`/dashboard/admin/users`)**:
   - Manajemen password *reset* dan *roles* dari pengguna.
