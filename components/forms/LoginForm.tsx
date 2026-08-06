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
import { loginSchema, type LoginFormData, loginWithEmail } from '@/services/auth.service'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const authData = await loginWithEmail(data)
      // Periksa role user setelah login
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()
        
      if (profile?.role === 'admin') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard/umkm')
      }
    } catch (error: any) {
      const msg = error.message || ''
      if (msg.includes('Email not confirmed')) {
        setErrorMsg('Email belum dikonfirmasi. Silakan cek inbox email Anda atau hubungi admin.')
      } else if (msg.includes('Invalid login credentials')) {
        setErrorMsg('Email atau password salah.')
      } else {
        setErrorMsg(msg || 'Terjadi kesalahan saat login.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-0 ring-1 ring-slate-200">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMsg && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
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
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
