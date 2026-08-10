'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, ShoppingBag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard/umkm', icon: LayoutDashboard },
  { name: 'Profil', href: '/dashboard/umkm/profile', icon: UserCircle },
  { name: 'Produk', href: '/dashboard/umkm/products', icon: ShoppingBag },
  { name: 'Pengaturan', href: '/dashboard/umkm/settings', icon: Settings },
];

export function UMKMMobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white z-50">
      <nav className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/dashboard/umkm');
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="flex-1 flex justify-center">
              <div className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
              )}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
