'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/forms/LoginForm'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="w-full max-w-md space-y-8 relative">
      <div className="text-center">
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-slate-500 hover:text-slate-900 absolute -top-12 left-0 sm:static sm:top-auto sm:left-auto sm:mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Button>
        </Link>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {isLogin ? 'Masuk ke Akun UMKM Anda' : 'Daftar Akun Baru'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isLogin
            ? 'Atau belum punya akun? '
            : 'Sudah memiliki akun? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </button>
        </p>
      </div>

      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm onSuccess={() => setIsLogin(true)} />
      )}
    </div>
  )
}
