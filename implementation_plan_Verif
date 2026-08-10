# Fitur Lupa Password dengan Verifikasi Kode Email (OTP)

Menambahkan alur **lupa password** lengkap: user memasukkan email → menerima kode OTP 6 digit via email → memasukkan kode untuk verifikasi → mengatur password baru.

## Pendekatan Teknis

Menggunakan **Supabase Auth built-in** `resetPasswordForEmail()` yang mengirim email reset password melalui email system Supabase. Namun karena user menginginkan **verifikasi kode (OTP)**, kita akan menggunakan **Supabase Auth OTP flow** yang sudah built-in:

1. `supabase.auth.resetPasswordForEmail(email)` — mengirim magic link/OTP ke email
2. `supabase.auth.verifyOtp({ email, token, type: 'recovery' })` — verifikasi kode OTP
3. `supabase.auth.updateUser({ password })` — update password setelah terverifikasi

> [!IMPORTANT]
> **Konfigurasi Supabase diperlukan**: Di Supabase Dashboard → Authentication → Email Templates, pastikan template **"Reset Password"** menggunakan format kode OTP (6 digit `{{ .Token }}`), bukan magic link. Aktifkan juga di Settings → Auth → Email OTP length = 6.

## Proposed Changes

### Auth Service Layer

#### [MODIFY] [auth.service.ts](file:///c:/akmal/KKN/UMKM-wotgalih/services/auth.service.ts)
- Tambah Zod schema: `forgotPasswordSchema`, `verifyOtpSchema`, `resetPasswordSchema`
- Tambah fungsi: `requestPasswordReset(email)`, `verifyPasswordOtp(email, token)`, `updatePassword(password)`

---

### Forgot Password Pages (3-step flow)

#### [NEW] `app/(auth)/forgot-password/page.tsx`
- Halaman utama dengan komponen `ForgotPasswordFlow`
- SEO metadata

#### [NEW] `components/forms/ForgotPasswordFlow.tsx`
- **Step 1**: Form input email → kirim OTP
- **Step 2**: Form input kode OTP 6 digit (auto-focus antar input, timer resend) → verifikasi
- **Step 3**: Form input password baru + konfirmasi → update password
- State machine sederhana dengan `useState` untuk step management
- UI premium: animasi transisi antar step, input OTP individual per digit, countdown timer

---

### Login Form Update

#### [MODIFY] [LoginForm.tsx](file:///c:/akmal/KKN/UMKM-wotgalih/components/forms/LoginForm.tsx)
- Tambah link "Lupa Password?" di bawah input password, mengarah ke `/forgot-password`

---

## UI/UX Design

Setiap step memiliki animasi transisi halus. OTP input menggunakan 6 kotak individual yang auto-focus. Termasuk:
- Countdown timer untuk resend OTP (60 detik)
- Visual feedback: ikon success/error per step
- Responsive design konsisten dengan AuthContainer yang ada
- Warna dan style konsisten dengan design system (blue-600 primary)

## Verification Plan

### Manual Verification
1. Buka halaman login → klik "Lupa Password?" → redirect ke `/forgot-password`
2. Masukkan email → terima kode OTP di inbox
3. Masukkan kode OTP → form password baru muncul
4. Set password baru → redirect ke login dengan pesan sukses
5. Login dengan password baru → berhasil
