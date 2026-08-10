// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Tags, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { createCategory, updateCategory, deleteCategory } from './actions';

interface CategoryTableProps {
  categories: any[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Kategori berhasil ditambahkan!');
      setAddOpen(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateCategory(editingCategory.id, formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Kategori berhasil diperbarui!');
      setEditOpen(false);
      setEditingCategory(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Kategori yang sudah memiliki UMKM mungkin tidak bisa dihapus jika relasinya restrict.`)) return;
    const result = await deleteCategory(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Kategori berhasil dihapus.');
    }
  };

  const openEdit = (category: any) => {
    setEditingCategory(category);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori *</Label>
              <Input id="name" name="name" required placeholder="Misal: Makanan & Minuman" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" name="description" placeholder="Deskripsi kategori..." rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Tambah Kategori'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditingCategory(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Nama Kategori *</Label>
                <Input id="edit_name" name="name" required defaultValue={editingCategory.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Deskripsi</Label>
                <Textarea id="edit_description" name="description" defaultValue={editingCategory.description || ''} rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  <Tags className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  Belum ada kategori yang terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{category.name}</TableCell>
                  <TableCell className="text-slate-500 font-mono text-sm">{category.slug}</TableCell>
                  <TableCell className="text-sm text-slate-600">{category.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(category)}>
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id, category.name)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
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
