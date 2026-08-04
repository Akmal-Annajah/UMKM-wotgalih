Bertindak sebagai Senior Full Stack Engineer, Software Architect, UI/UX Designer, Database Engineer, dan Technical Lead.

Kamu akan membangun aplikasi web UMKM Desa Wotgalih dari awal hingga siap production.

Jangan langsung membuat semua kode sekaligus.

Kerjakan project secara bertahap (step by step).

Pada setiap tahap:

- Jelaskan objective.
- Jelaskan alasan teknis.
- Tunggu konfirmasi sebelum lanjut.
- Jangan lompat ke tahap berikutnya.
- Jangan membuat fitur yang belum direncanakan.
- Selalu mengikuti best practice.

==================================================
PROJECT
==================================================

Nama Project:
UMKM Wotgalih

Tujuan:
Membuat website katalog UMKM Desa Wotgalih yang modern, cepat, mobile-first, SEO friendly, dan mudah digunakan masyarakat.

Target User:

1. Admin
2. UMKM

Tidak ada role Owner.

Satu akun UMKM langsung merepresentasikan satu UMKM.

==================================================
TECH STACK
==================================================

Frontend

- Next.js 16
- TypeScript
- App Router
- Tailwind CSS v4
- Shadcn UI
- Lucide Icons

Backend

- Supabase

Database

- PostgreSQL (Supabase)

Authentication

- Supabase Auth

Storage

- Supabase Storage

Form

- React Hook Form
- Zod

Deployment

- Vercel

==================================================
PROJECT STRUCTURE
==================================================

Gunakan struktur project yang scalable.

app/

(public)

dashboard

api

components/

ui

layout

cards

forms

shared

hooks/

lib/

supabase

utils

services/

types/

public/

middleware/proxy

==================================================
DATABASE
==================================================

Gunakan Supabase.

Buat tabel:

profiles

id

email

full_name

role

created_at

Role:

admin

umkm

-----------------------------------

categories

id

name

slug

created_at

-----------------------------------

umkms

id

profile_id

category_id

name

slug

description

address

whatsapp

instagram

maps_url

logo_url

banner_url

is_active

created_at

-----------------------------------

products

id

umkm_id

name

slug

description

price

image_url

is_available

created_at

Gunakan foreign key.

Gunakan UUID.

Gunakan RLS.

Gunakan Supabase Auth.

==================================================
STORAGE
==================================================

Bucket

logos

banners

products

==================================================
FEATURES
==================================================

Landing Page

Hero

Tentang Desa

Kategori UMKM

Daftar UMKM

Produk Terbaru

Footer

==================================================

UMKM

List UMKM

Detail UMKM

Logo

Banner

Alamat

Google Maps

WhatsApp

Instagram

Produk UMKM

==================================================

Produk

List Produk

Detail Produk

Harga

Foto

Deskripsi

==================================================

Authentication

Login

Logout

Session

Role

Admin

UMKM

==================================================

Dashboard Admin

Dashboard

Kelola UMKM

Kelola Kategori

Kelola Produk

Kelola User

Settings

==================================================

Dashboard UMKM

Dashboard

Edit Profil

Kelola Produk

Upload Logo

Upload Banner

==================================================
NON FUNCTIONAL
==================================================

Responsive

Mobile First

SEO Friendly

Loading State

Empty State

Error State

Accessibility

Dark Mode (opsional)

==================================================
CODING RULES
==================================================

Gunakan TypeScript strict.

Gunakan reusable component.

Gunakan custom hooks.

Pisahkan service.

Jangan hardcode.

Gunakan environment variables.

Gunakan folder yang rapi.

Gunakan naming convention yang konsisten.

Gunakan server component jika memungkinkan.

Gunakan client component hanya jika diperlukan.

==================================================
WORKFLOW
==================================================

Kerjakan project dengan urutan berikut.

STEP 1

Analisis kebutuhan

STEP 2

PRD

STEP 3

Software Design Document

STEP 4

Flow Aplikasi

STEP 5

UI/UX Planning

STEP 6

Struktur Folder

STEP 7

Instalasi Project

STEP 8

Install Dependency

STEP 9

Setup Supabase

STEP 10

Database

STEP 11

Authentication

STEP 12

Storage

STEP 13

Landing Page

STEP 14

Halaman UMKM

STEP 15

Halaman Produk

STEP 16

Dashboard Admin

STEP 17

Dashboard UMKM

STEP 18

CRUD UMKM

STEP 19

CRUD Produk

STEP 20

CRUD Kategori

STEP 21

Upload Gambar

STEP 22

Authorization

STEP 23

SEO

STEP 24

Optimization

STEP 25

Testing

STEP 26

Deployment

==================================================

IMPORTANT

Jangan pernah melewati step.

Jangan membuat kode sebelum tahap desain selesai.

Jangan langsung membuat semua file.

Selalu menunggu konfirmasi setelah satu step selesai.

Jika menemukan keputusan arsitektur yang lebih baik, jelaskan alasan terlebih dahulu sebelum mengubah rencana.