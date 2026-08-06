# Struktur Folder - UMKM Wotgalih

Berdasarkan *best practice* pengembangan aplikasi skala menengah hingga besar menggunakan **Next.js 16 (App Router)**, berikut adalah arsitektur folder yang akan kita implementasikan.

Pendekatan ini memisahkan antara logika antarmuka (UI Components), logika bisnis (Services), fungsi bantuan (Lib/Utils), dan Routing.

```text
/ (Project Root)
├── app/                      # Next.js App Router (Routing Induk)
│   ├── (public)/             # Route Group untuk publik (tidak merubah URL path)
│   │   ├── page.tsx          # Landing Page (Hero, Kategori, UMKM List)
│   │   ├── umkm/             # Halaman List UMKM
│   │   └── produk/           # Halaman List Produk
│   ├── (auth)/               # Route Group khusus Autentikasi
│   │   └── login/            # Halaman Login
│   ├── dashboard/            # Protected Routes (Dashboard)
│   │   ├── admin/            # Area Admin (Kelola UMKM, Kategori, Master Produk)
│   │   └── umkm/             # Area Pemilik UMKM (Profil, Tambah/Edit Produk)
│   ├── api/                  # Next.js Route Handlers (jika butuh backend custom/webhook)
│   ├── layout.tsx            # Global Root Layout
│   └── globals.css           # Global CSS (Tailwind variables)
│
├── components/               # Reusable UI Components
│   ├── ui/                   # Komponen dasar (Button, Input, Modal) - Digenerate oleh Shadcn
│   ├── layout/               # Navbar, Sidebar, Footer
│   ├── cards/                # Komponen spesifik (Card UMKM, Card Produk)
│   ├── forms/                # Komponen formulir yang kompleks (React Hook Form)
│   └── shared/               # Komponen yang dipakai lintas halaman (EmptyState, Loader)
│
├── hooks/                    # Custom React Hooks
│   ├── useAuth.ts            # Hook untuk mengambil sesi user aktif
│   └── ...
│
├── lib/                      # Konfigurasi & Utility eksternal
│   ├── supabase/             # Inisialisasi Supabase Client (Browser & Server)
│   │   ├── client.ts         
│   │   └── server.ts         
│   └── utils.ts              # Fungsi utilitas (cn untuk class merge tailwind)
│
├── services/                 # Layer Logika Bisnis (Data Fetching / Supabase Queries)
│   ├── auth.service.ts       # Fungsi Login, Logout, Session
│   ├── umkm.service.ts       # Query Supabase tabel umkms
│   ├── product.service.ts    # Query Supabase tabel products
│   └── storage.service.ts    # Fungsi Upload ke Supabase Storage
│
├── types/                    # TypeScript Type Definitions
│   ├── database.types.ts     # Generate type dari Supabase
│   └── index.ts              # Custom types/interfaces tambahan
│
├── public/                   # Aset Statis (Icon, Ilustrasi, Placeholder)
│
├── middleware.ts             # Proteksi Route (Mengecek Sesi Supabase sebelum masuk dashboard)
├── tailwind.config.ts        # Konfigurasi Tailwind CSS v4 (atau CSS variables app)
└── next.config.ts            # Konfigurasi Next.js (Image domains whitelist)
```

## Keuntungan Struktur Ini:
1. **Separation of Concerns**: Komponen React (`components/`) hanya bertugas untuk *render UI*. Proses pengambilan data (*fetch*) dipindahkan ke `services/`.
2. **Modular Route Group**: Menggunakan kurung bulat seperti `(public)` atau `(auth)` membantu mengelompokkan layout tanpa menambah *segment URL* (misal: `/login` tidak menjadi `/(auth)/login`).
3. **Reusability**: Komponen di `ui/` dan `cards/` dapat dipakai berkali-kali di halaman Publik maupun Dashboard tanpa redundansi kode.
