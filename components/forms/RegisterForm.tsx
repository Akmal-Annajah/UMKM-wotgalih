'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { registerSchema, type RegisterFormData, registerWithEmail } from '@/services/auth.service'
import Link from 'next/link'

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      await registerWithEmail(data)
      setRegisteredEmail(data.email)
      setIsRegistered(true)
      // Remove onSuccess() from here so the success screen stays visible
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal melakukan pendaftaran. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistered) {
    return (
      <Card className="shadow-lg border-0 ring-1 ring-slate-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Pendaftaran Berhasil!</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Kami telah mengirimkan email verifikasi ke{' '}
                <span className="font-medium text-slate-900">{registeredEmail}</span>.
              </p>
              <p className="text-sm text-slate-600">
                Silakan cek <strong>inbox</strong> atau <strong>folder spam</strong> Anda, lalu klik link verifikasi untuk mengaktifkan akun.
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-md text-sm text-amber-800 border border-amber-200">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Anda tidak akan bisa login sebelum link email diklik.</span>
            </div>
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.preventDefault()
                  if (onSuccess) onSuccess()
                  else router.push('/login')
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 ring-1 ring-slate-200">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap Pemilik / UMKM</Label>
            <Input 
              id="fullName" 
              placeholder="Masukkan nama lengkap" 
              {...register('fullName')}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-register">Email</Label>
            <Input 
              id="email-register" 
              type="email" 
              placeholder="nama@email.com" 
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password-register">Password</Label>
            <Input 
              id="password-register" 
              type="password" 
              placeholder="Minimal 6 karakter"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Ulangi password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Daftar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
