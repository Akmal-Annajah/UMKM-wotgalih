import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { UMKMSidebar } from '@/components/layout/UMKMSidebar';

export default async function UMKMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Pastikan user adalah umkm
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    redirect('/dashboard/admin');
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <UMKMSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
