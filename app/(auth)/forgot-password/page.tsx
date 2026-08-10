import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lupa Password - UMKM Wotgalih',
  description: 'Reset password akun UMKM Wotgalih',
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Lupa Password?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Tidak apa-apa, kami akan mengirimkan link reset ke email Anda.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
