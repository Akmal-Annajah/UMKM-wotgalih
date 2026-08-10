import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { UMKMSidebar } from '@/components/layout/UMKMSidebar';
import { UMKMMobileNav } from '@/components/layout/UMKMMobileNav';
import { LogoutButton } from '@/components/layout/LogoutButton';

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
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row pb-16 md:pb-0">
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex h-16 items-center justify-between bg-white border-b border-slate-200 px-4 shrink-0">
        <span className="text-xl font-bold text-slate-900">UMKM <span className="text-blue-600">Panel</span></span>
        <LogoutButton />
      </div>

      <div className="hidden md:block">
        <UMKMSidebar />
      </div>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>

      <UMKMMobileNav />
    </div>
  );
}
