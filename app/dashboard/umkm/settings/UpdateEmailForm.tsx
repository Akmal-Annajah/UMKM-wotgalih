'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmail } from '@/services/auth.service';
import { Mail, Loader2 } from 'lucide-react';

export function UpdateEmailForm({ currentEmail }: { currentEmail: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get('email') as string;

    try {
      await updateEmail(newEmail);
      toast.success('Link verifikasi telah dikirim ke email baru dan lama Anda. Silakan cek kotak masuk.');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ganti Email</h2>
          <p className="text-sm text-slate-500">Perbarui email yang digunakan untuk login.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Baru</Label>
          <Input id="email" name="email" type="email" required placeholder="Contoh: email.baru@gmail.com" />
          <p className="text-xs text-slate-500">Anda akan menerima email konfirmasi di kedua email (lama dan baru) setelah menyimpannya.</p>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Email'
          )}
        </Button>
      </form>
    </div>
  );
}
