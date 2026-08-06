'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { deleteMyAccount } from './actions';

interface DeleteAccountSectionProps {
  umkmName: string | null;
}

export function DeleteAccountSection({ umkmName }: DeleteAccountSectionProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const expectedText = 'HAPUS AKUN SAYA';

  const handleDelete = async () => {
    if (confirmText !== expectedText) {
      toast.error(`Silakan ketik "${expectedText}" untuk mengonfirmasi.`);
      return;
    }

    setLoading(true);
    const result = await deleteMyAccount();
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Akun berhasil dihapus. Selamat tinggal!');
      router.push('/');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-red-900">Zona Berbahaya</h2>
            <p className="text-sm text-red-700 mt-1">
              Menghapus akun akan menghapus seluruh data Anda secara permanen, termasuk
              {umkmName ? ` profil UMKM "${umkmName}",` : ''} semua produk, dan akun login Anda.
              <strong className="block mt-1">Tindakan ini tidak bisa dibatalkan.</strong>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-red-100">
          <Button
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-semibold"
            onClick={() => setDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Hapus Akun Saya
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setConfirmText(''); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Konfirmasi Hapus Akun
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Semua data berikut akan dihapus secara <strong className="text-red-700">permanen</strong>:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <ul className="bg-red-50 rounded-xl p-4 space-y-2 text-sm text-red-800">
              {umkmName && <li className="flex items-center gap-2">• Profil UMKM: <strong>{umkmName}</strong></li>}
              <li className="flex items-center gap-2">• Semua produk yang terdaftar</li>
              <li className="flex items-center gap-2">• Logo, banner, dan foto produk</li>
              <li className="flex items-center gap-2">• Akun login (email & password)</li>
            </ul>

            <div className="space-y-2">
              <Label htmlFor="confirm_delete" className="text-sm text-slate-700">
                Ketik <strong className="text-red-600 font-mono">{expectedText}</strong> untuk mengonfirmasi:
              </Label>
              <Input
                id="confirm_delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={expectedText}
                className="border-red-200 focus-visible:ring-red-400"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setDialogOpen(false); setConfirmText(''); }}
              >
                Batalkan
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={confirmText !== expectedText || loading}
                onClick={handleDelete}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...</>
                ) : (
                  <><Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
