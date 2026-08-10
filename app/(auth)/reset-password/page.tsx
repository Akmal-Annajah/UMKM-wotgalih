import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password - UMKM Wotgalih',
  description: 'Atur password baru untuk akun UMKM Wotgalih',
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Masukkan password baru untuk akun Anda.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  )
}
