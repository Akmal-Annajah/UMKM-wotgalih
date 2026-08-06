import { createClient } from '@/lib/supabase/server';
import { getMyUMKM } from '@/services/umkm.service';
import { redirect } from 'next/navigation';
import { DeleteAccountSection } from './DeleteAccountSection';

export const metadata = {
  title: 'Pengaturan Akun - Dashboard UMKM',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const umkm = await getMyUMKM(user.id);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Pengaturan Akun</h1>
        <p className="mt-2 text-slate-500">Kelola pengaturan dan keamanan akun Anda.</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Informasi Akun</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Email</p>
            <p className="font-semibold text-slate-900">{user.email}</p>
          </div>
          {umkm && (
            <div>
              <p className="text-slate-500">Nama UMKM</p>
              <p className="font-semibold text-slate-900">{umkm.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <DeleteAccountSection umkmName={umkm?.name || null} />
    </div>
  );
}
