import { createClient } from '@/lib/supabase/server';
import { getMyUMKM } from '@/services/umkm.service';
import { UMKMProfileForm } from '@/components/forms/UMKMProfileForm';
import { AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Edit Profil - Dashboard UMKM',
};

export default async function UMKMProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const umkm = user ? await getMyUMKM(user.id) : null;

  if (!umkm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-16 w-16 text-amber-400 mb-6" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profil UMKM Belum Ditemukan</h1>
        <p className="text-slate-500 max-w-md">
          Akun Anda belum terhubung dengan data UMKM. Hubungi Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Profil</h1>
        <p className="mt-2 text-slate-500">Perbarui informasi, logo, dan banner UMKM Anda.</p>
      </div>
      <UMKMProfileForm umkm={umkm} />
    </div>
  );
}
