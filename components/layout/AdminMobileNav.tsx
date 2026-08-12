'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Tags, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'UMKM', href: '/dashboard/admin/umkm', icon: Store },
  { name: 'Kategori', href: '/dashboard/admin/categories', icon: Tags },
  { name: 'Produk', href: '/dashboard/admin/products', icon: ShoppingBag },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white z-50">
      <nav className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/dashboard/admin');
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
