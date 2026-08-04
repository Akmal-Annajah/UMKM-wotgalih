# UI/UX Planning - UMKM Wotgalih

Desain UI/UX ini difokuskan pada pendekatan **Mobile First**, **Clean**, dan **Modern**, untuk memastikan aplikasi terasa premium namun tetap ramah bagi pengguna di perdesaan maupun masyarakat luas.

## 1. Tema & Estetika Visual (Design System)

### 1.1. Palet Warna (Color Palette)
- **Primary**: `Emerald Green` (Hijau zamrud) untuk merepresentasikan agrikultur, kesejahteraan, dan perdesaan Wotgalih. 
  - *Hex*: `#10b981` (Tailwind `emerald-500`)
- **Secondary / Accent**: `Amber` (Kuning keemasan) untuk merepresentasikan kerajinan, kehangatan, dan energi.
  - *Hex*: `#f59e0b` (Tailwind `amber-500`)
- **Background (Light Mode)**: Putih bersih `#ffffff` dan abu-abu sangat muda `#f8fafc` (`slate-50`).
- **Text / Foreground**: `#0f172a` (`slate-900`) untuk judul (Heading) dan `#475569` (`slate-600`) untuk teks paragraf agar mata tidak cepat lelah (high readability).

### 1.2. Tipografi (Typography)
Menggunakan Google Fonts via `next/font/google`:
- **Heading (H1-H6)**: **Inter** atau **Outfit** (Tegas, modern, geometris).
- **Body / Paragraph**: **Inter** (Keterbacaan sangat tinggi, rendering bersih di mobile).

### 1.3. Radius & Bayangan (Border & Shadow)
- **Border Radius**: Menggunakan *rounded-xl* (12px) atau *rounded-2xl* (16px) untuk kesan *friendly* dan modern (mirip *card* iOS).
- **Shadows**: *Subtle shadows* (Soft drop-shadow) untuk mengangkat elemen kartu UMKM dan Produk agar tampak menonjol (efek *glassmorphism* atau *soft neumorphism* ringan di beberapa *card*).

## 2. Komponen UI Inti (Shadcn UI)
Komponen yang akan di-*install* dari Shadcn UI untuk mempercepat *development*:
- `Button`: Tombol CTA utama (Hubungi WhatsApp, Login, Submit Form).
- `Card`: Membungkus informasi produk, detail UMKM, dan statistik di dashboard.
- `Form`, `Input`, `Textarea`, `Label`: Kebutuhan CRUD dan Autentikasi.
- `Select` & `Dropdown Menu`: Untuk filter pencarian kategori dan menu *Profile/Logout*.
- `Dialog` (Modal): Konfirmasi hapus data atau form cepat.
- `Toast` (Sonner): Notifikasi sukses/gagal secara *real-time*.
- `Skeleton`: Animasi pemuatan data (*Loading state*).
- `Avatar`: Profil/Logo UMKM atau Admin.

## 3. Tata Letak (Layouting) & Interaksi

### 3.1. Halaman Publik (Katalog)
- **Navbar**: Sticky *glassmorphism* di atas. Logo di kiri, menu "Katalog" & "Login" di kanan. Di *mobile*, gunakan *Hamburger Menu* (Sheet Shadcn).
- **Hero**: Menggunakan gambar latar belakang (Desa Wotgalih) yang di-overlay gradien gelap, dengan teks *Call to Action* tebal berwarna putih di tengah.
- **Grid UMKM & Produk**: 
  - Layar HP: 1 atau 2 kolom (Grid: `grid-cols-1` atau `grid-cols-2`).
  - Layar Tablet: 2 atau 3 kolom.
  - Layar Desktop: 4 kolom (`lg:grid-cols-4`).
- **Micro-interactions**: 
  - *Hover effect* (gambar *zoom in* sedikit saat kartu disorot *mouse*, dan kartu sedikit terangkat / *translate-y*).

### 3.2. Dashboard (Admin & UMKM)
- **Sidebar**: *Fixed sidebar* di sebelah kiri untuk navigasi antar menu (Overview, Produk, Profil). Di layar *mobile*, disembunyikan dalam *Sheet/Drawer*.
- **Top Header**: Judul halaman yang sedang aktif dan menu profil (*logout*).
- **Content Area**: Menggunakan latar *slate-50* agar tabel atau *card* putih yang berada di atasnya tampak kontras.

## 4. State Management Visual
- **Loading State**: Menggunakan *Skeleton loaders* (bukan hanya *spinner*) pada daftar UMKM dan produk saat sedang mengambil data dari Supabase, sehingga tidak terjadi *layout shift* yang mengganggu.
- **Empty State**: Jika tidak ada data UMKM/Produk, akan ditampilkan ilustrasi SVG yang menarik dengan teks deskriptif (Misal: "Belum ada produk yang ditambahkan.").
- **Error State**: Pesan *error* tidak akan merusak layout, melainkan disajikan dengan *Toast notification* berwarna merah lembut atau komponen alert statis.
