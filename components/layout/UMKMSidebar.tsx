'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, UserCircle, ShoppingBag, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '@/services/auth.service';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard/umkm', icon: LayoutDashboard },
  { name: 'Edit Profil', href: '/dashboard/umkm/profile', icon: UserCircle },
  { name: 'Kelola Produk', href: '/dashboard/umkm/products', icon: ShoppingBag },
  { name: 'Pengaturan', href: '/dashboard/umkm/settings', icon: Settings },
];

export function UMKMSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shrink-0">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-6">
        <span className="text-xl font-bold text-slate-900">UMKM <span className="text-emerald-600">Panel</span></span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <span className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors my-1",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-emerald-700" : "text-slate-400")} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
