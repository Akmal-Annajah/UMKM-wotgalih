import { createClient } from '@/lib/supabase/server';
import { UMKMTable } from './UMKMTable';

export const metadata = {
  title: 'Kelola UMKM - Admin',
};

export default async function AdminUMKMPage() {
  const supabase = await createClient();

  const { data: umkms } = await supabase
    .from('umkms')
    .select('*, categories(name), profiles(email)')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola UMKM</h1>
          <p className="mt-2 text-slate-500">Daftarkan, aktifkan, atau nonaktifkan UMKM.</p>
        </div>
      </div>
      <UMKMTable umkms={umkms || []} categories={categories || []} />
    </div>
  );
}
