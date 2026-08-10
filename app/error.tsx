'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-slate-50">
      <div className="rounded-full bg-red-100 p-4 mb-6 shadow-sm ring-8 ring-red-50">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Ups, Terjadi Kesalahan!</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Mohon maaf, sistem gagal memproses halaman ini (mungkin karena koneksi lambat atau kesalahan data).
      </p>
      <Button 
        onClick={() => reset()} 
        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
      >
        Muat Ulang Halaman
      </Button>
    </div>
  );
}
