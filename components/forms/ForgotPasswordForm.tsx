'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
  requestPasswordReset,
} from '@/services/auth.service'

export function ForgotPasswordForm() {
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      await requestPasswordReset(data.email)
      setSentEmail(data.email)
      setIsSent(true)
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan. Coba lagi nanti.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <Card className="shadow-lg border-0 ring-1 ring-slate-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Email Terkirim!</h3>
            <p className="text-sm text-slate-600">
              Kami telah mengirimkan link reset password ke{' '}
              <span className="font-medium text-slate-900">{sentEmail}</span>.
              Silakan cek inbox atau folder spam Anda.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 ring-1 ring-slate-200">
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
          <p className="text-sm text-slate-600">
            Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
          </p>
        </div>

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

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim Link Reset'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="inline mr-1 h-3 w-3" />
              Kembali ke Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
