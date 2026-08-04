import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { getMyUMKM, getMyProductCount } from '@/services/umkm.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard UMKM',
};

export default async function UMKMDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const umkm = user ? await getMyUMKM(user.id) : null;
  const productCount = umkm ? await getMyProductCount(umkm.id) : 0;

  if (!umkm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-16 w-16 text-amber-400 mb-6" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profil UMKM Belum Ditemukan</h1>
        <p className="text-slate-500 max-w-md">
          Akun Anda belum terhubung dengan data UMKM. Hubungi Admin untuk mendaftarkan usaha Anda.
        </p>
      </div>
    );
  }

  const isProfileComplete = umkm.description && umkm.address && umkm.whatsapp && umkm.logo_url;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Selamat Datang, {umkm.name}!
        </h1>
        <p className="mt-2 text-slate-500">Kelola profil dan produk UMKM Anda dari sini.</p>
      </div>

      {!isProfileComplete && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Lengkapi Profil Anda</h3>
              <p className="mt-1 text-sm text-amber-700">
                Profil yang lengkap akan membantu pelanggan menemukan dan menghubungi Anda lebih mudah.
              </p>
              <Link href="/dashboard/umkm/profile" className="mt-4 inline-block">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Lengkapi Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Produk</CardTitle>
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{productCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Status Toko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${umkm.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-lg font-bold text-slate-900">
                {umkm.is_active ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
