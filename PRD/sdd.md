# Software Design Document (SDD) - UMKM Wotgalih

## 1. Arsitektur Sistem
Sistem ini menggunakan arsitektur modern Serverless dengan pendekatan decoupled backend-as-a-service (BaaS):
- **Frontend**: Next.js 16 (App Router) yang menyediakan kombinasi Server-Side Rendering (SSR) dan Client-Side Rendering (CSR). SSR digunakan untuk halaman publik agar SEO optimal.
- **Backend & Database**: Supabase (PostgreSQL) menangani autentikasi, penyimpanan data, operasi database, serta otorisasi via RLS (Row Level Security).
- **Storage**: Supabase Storage untuk menyimpan aset gambar (Logo, Banner, Produk).
- **Hosting**: Vercel untuk Frontend Next.js.

## 2. Skema Database (PostgreSQL / Supabase)

Tabel menggunakan `id` dengan tipe data UUID dan terikat relasi *Foreign Key* sesuai *best practice*.

### 2.1. Tabel `profiles`
Menyimpan data pengguna yang terdaftar di Supabase Auth. Dibuat secara otomatis lewat *trigger* saat ada *user sign-up*.
- `id` (UUID, Primary Key, berelasi dengan `auth.users.id`)
- `email` (String)
- `full_name` (String)
- `role` (String/Enum: `admin`, `umkm`) - Default: `umkm`
- `created_at` (Timestamp)

### 2.2. Tabel `categories`
Menyimpan master data kategori UMKM.
- `id` (UUID, Primary Key)
- `name` (String)
- `slug` (String, Unique)
- `created_at` (Timestamp)

### 2.3. Tabel `umkms`
Menyimpan entitas bisnis UMKM. Satu profile (jika role umkm) terkait ke satu data di tabel ini.
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key ke `profiles.id`) - Bisa null jika dikelola sepenuhnya oleh admin, namun umumnya terikat 1:1.
- `category_id` (UUID, Foreign Key ke `categories.id`)
- `name` (String)
- `slug` (String, Unique)
- `description` (Text)
- `address` (Text)
- `whatsapp` (String)
- `instagram` (String, nullable)
- `maps_url` (String, nullable)
- `logo_url` (String, nullable)
- `banner_url` (String, nullable)
- `is_active` (Boolean) - Default: true
- `created_at` (Timestamp)

### 2.4. Tabel `products`
Menyimpan data produk dari setiap UMKM.
- `id` (UUID, Primary Key)
- `umkm_id` (UUID, Foreign Key ke `umkms.id`)
- `name` (String)
- `slug` (String)
- `description` (Text)
- `price` (Integer/Numeric)
- `image_url` (String, nullable)
- `is_available` (Boolean) - Default: true
- `created_at` (Timestamp)

## 3. Strategi Keamanan (RLS - Row Level Security)
Kebijakan RLS (Policy) pada Supabase akan diterapkan untuk memastikan keamanan data:
- **Tabel Publik** (`categories`, `umkms` dengan `is_active=true`, `products` dengan UMKM aktif): `SELECT` diizinkan untuk semua (anon / authenticated).
- **Akses Admin**: Role `admin` bebas melakukan `SELECT`, `INSERT`, `UPDATE`, `DELETE` pada semua tabel.
- **Akses UMKM**: Role `umkm` hanya dapat melakukan `UPDATE` pada tabel `umkms` dengan `id` miliknya sendiri, serta CRUD penuh pada tabel `products` di mana `umkm_id` miliknya sendiri.

## 4. Struktur Penyimpanan (Supabase Storage)
Terdapat satu bucket utama (atau tiga bucket terpisah jika diperlukan konfigurasi spesifik), namun standar terbaik adalah 1 bucket `umkm-assets` dengan folder:
- `/logos` - Logo UMKM
- `/banners` - Banner profil UMKM
- `/products` - Foto produk
Akses BACA bersifat Publik, namun akses TULIS/HAPUS dibatasi hanya untuk *Authenticated User* (sesuai kepemilikan) atau *Admin*.
