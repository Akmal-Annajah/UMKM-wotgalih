import { AuthContainer } from '@/components/forms/AuthContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - UMKM Wotgalih',
  description: 'Masuk ke dashboard Admin atau UMKM',
}

export default function LoginPage() {
  return <AuthContainer />
}
