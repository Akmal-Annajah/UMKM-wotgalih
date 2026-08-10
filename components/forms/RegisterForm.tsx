'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { registerSchema, type RegisterFormData, registerWithEmail } from '@/services/auth.service'
import { toast } from 'sonner'

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      toast.success('Pendaftaran berhasil! Silakan masuk dengan akun Anda.')
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/login')
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal melakukan pendaftaran. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
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
