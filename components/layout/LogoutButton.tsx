'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
