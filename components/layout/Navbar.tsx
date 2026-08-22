'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Store, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog UMKM', href: '/umkm' },
    { name: 'Katalog Produk', href: '/produk' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 transition-transform hover:scale-105 z-50 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-200">
            <img src="/logos/logo-diktisaintek.png" alt="Diktisaintek" className="h-5 sm:h-7 md:h-8 w-auto object-contain" />
            <img src="/logos/logo-itb-wiga.png" alt="ITB Wiga" className="h-4 sm:h-6 md:h-7 w-auto object-contain" />
            <img src="/logos/logo-lumajang.png" alt="Lumajang" className="h-6 sm:h-8 md:h-9 w-auto object-contain" />
            <img src="/logos/logo-kkn.png" alt="KKN Wotgalih" className="h-5 sm:h-7 md:h-8 w-auto object-contain scale-105" />
          </div>
          <span className="text-sm sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-none">
            UMKM <span className="text-blue-600">Wotgalih</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Login Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden z-50">
          <Link href="/login" className="mr-1">
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs h-8 px-3">
              Login
            </Button>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-base font-medium border-b border-slate-100",
                pathname === link.href ? "text-blue-600" : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
                Login ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
