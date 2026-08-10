// @ts-nocheck
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toggleUMKMStatus, createUMKMWithAccount } from './actions';

interface UMKMTableProps {
  umkms: any[];
  categories: { id: string; name: string }[];
}

export function UMKMTable({ umkms, categories }: UMKMTableProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await toggleUMKMStatus(id, !currentStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`UMKM berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await createUMKMWithAccount(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('UMKM berhasil didaftarkan!');
      setOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Daftarkan UMKM Baru
        </Button>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Daftarkan UMKM Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <p className="text-sm font-semibold text-slate-700">Akun Login</p>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="umkm@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" required minLength={6} placeholder="Min. 6 karakter" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Pemilik *</Label>
                <Input id="full_name" name="full_name" required placeholder="Nama lengkap pemilik" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">Data UMKM</p>
              <div className="space-y-2">
                <Label htmlFor="umkm_name">Nama UMKM *</Label>
                <Input id="umkm_name" name="umkm_name" required placeholder="Misal: Keripik Singkong Mak Mur" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori</Label>
                <Select name="category_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" placeholder="Deskripsi singkat UMKM" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" name="address" placeholder="Alamat lengkap UMKM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">No. WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Mendaftarkan...' : 'Daftarkan UMKM'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nama UMKM</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aktif/Nonaktif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {umkms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  <Store className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  Belum ada UMKM yang terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              umkms.map((umkm, index) => (
                <TableRow key={umkm.id}>
                  <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{umkm.name}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{umkm.profiles?.email || '-'}</TableCell>
                  <TableCell>
                    {umkm.categories?.name ? (
                      <Badge variant="secondary">{umkm.categories.name}</Badge>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={umkm.is_active ? 'default' : 'destructive'} className={umkm.is_active ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}>
                      {umkm.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={umkm.is_active}
                      onCheckedChange={() => handleToggle(umkm.id, umkm.is_active)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
