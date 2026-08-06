import { createClient } from '@/lib/supabase/server';
import { getMyUMKM } from '@/services/umkm.service';
import { UMKMProfileForm } from '@/components/forms/UMKMProfileForm';
import { QRCodeDisplay } from '@/components/ui/QRCodeDisplay';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Edit Profil - Dashboard UMKM',
};

export default async function UMKMProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const umkm = user ? await getMyUMKM(user.id) : null;

  if (!umkm) {
    redirect('/dashboard/umkm');
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profil UMKM</h1>
        <p className="text-slate-500 mt-1">Kelola informasi publik dan QR Code untuk usaha Anda.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Column */}
        <div className="lg:col-span-2">
          <UMKMProfileForm umkm={umkm} />
        </div>
        
        {/* Side Column (QR Code) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <QRCodeDisplay slug={umkm.slug} umkmName={umkm.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
