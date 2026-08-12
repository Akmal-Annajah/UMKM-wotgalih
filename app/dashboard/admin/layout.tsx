import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminMobileNav } from '@/components/layout/AdminMobileNav';
import { LogoutButton } from '@/components/layout/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Pastikan user adalah admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard/umkm');
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row pb-16 md:pb-0">
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex h-16 items-center justify-between bg-white border-b border-slate-200 px-4 shrink-0">
        <span className="text-xl font-bold text-slate-900">Admin <span className="text-blue-600">Panel</span></span>
        <LogoutButton />
      </div>

      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>

      <AdminMobileNav />
    </div>
  );
}
