import { LoginForm } from '@/components/forms/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - UMKM Wotgalih',
  description: 'Masuk ke dashboard Admin atau UMKM',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Atau hubungi admin desa untuk pendaftaran UMKM
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
