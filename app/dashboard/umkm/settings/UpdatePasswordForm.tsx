'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePassword } from '@/services/auth.service';
import { KeyRound, Loader2 } from 'lucide-react';

export function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      toast.success('Password berhasil diubah!');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ganti Password</h2>
          <p className="text-sm text-slate-500">Perbarui password akun Anda.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password Baru</Label>
          <Input id="password" name="password" type="password" required minLength={6} placeholder="Minimal 6 karakter" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
          <Input id="confirm_password" name="confirm_password" type="password" required minLength={6} placeholder="Ketik ulang password baru" />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Password'
          )}
        </Button>
      </form>
    </div>
  );
}
