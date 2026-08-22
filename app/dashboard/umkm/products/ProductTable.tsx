// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ShoppingBag, ImagePlus, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/PriceInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { createProduct, updateProduct, deleteProduct, updateProductImage } from './actions';
import { createClient } from '@/lib/supabase/client';

interface ProductTableProps {
  products: any[];
  umkmId: string;
}

export function ProductTable({ products, umkmId }: ProductTableProps) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreorder, setIsPreorder] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('umkm_id', umkmId);
    formData.set('is_preorder', isPreorder ? 'true' : 'false');

    if (imageFile) {
      const supabase = createClient();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
      
      if (uploadError) {
        toast.error('Gagal mengunggah foto: ' + uploadError.message);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      formData.set('image_url', data.publicUrl);
    }

    const result = await createProduct(formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Produk berhasil ditambahkan!');
      setAddOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setIsPreorder(false);
      router.refresh();
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (imageFile) {
      const supabase = createClient();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
      
      if (uploadError) {
        toast.error('Gagal mengunggah foto: ' + uploadError.message);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      formData.set('image_url', data.publicUrl);
    }

    const result = await updateProduct(editingProduct.id, formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Produk berhasil diperbarui!');
      setEditOpen(false);
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      router.refresh();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const result = await deleteProduct(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Produk berhasil dihapus.');
      router.refresh();
    }
  };

  const handleImageUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB.');
      return;
    }

    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      toast.error('Gagal mengunggah foto: ' + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('products').getPublicUrl(fileName);
    const result = await updateProductImage(productId, data.publicUrl);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Foto produk berhasil diperbarui!');
      router.refresh();
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product.image_url || null);
    setIsPreorder(product.is_preorder || false);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={(v) => { setAddOpen(v); if (!v) { setImageFile(null); setImagePreview(null); setIsPreorder(false); } }}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Foto Produk</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                  <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG, dll. Maks. 2MB.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_name">Nama Produk *</Label>
              <Input id="add_name" name="name" required placeholder="Nama produk Anda" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_price">Harga (Rp) *</Label>
              <PriceInput id="add_price" name="price" required placeholder="15.000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_description">Deskripsi</Label>
              <Textarea id="add_description" name="description" placeholder="Deskripsi produk..." rows={4} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-slate-50">
              <div className="space-y-0.5">
                <Label htmlFor="add_preorder" className="text-sm font-medium cursor-pointer">Pre Order</Label>
                <p className="text-xs text-slate-500">Aktifkan jika produk ini hanya bisa dipesan di awal (Pre Order).</p>
              </div>
              <Switch
                id="add_preorder"
                checked={isPreorder}
                onCheckedChange={setIsPreorder}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menambahkan...</> : 'Tambah Produk'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) { setEditingProduct(null); setImageFile(null); setImagePreview(null); } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Foto Produk</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                    <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG, dll. Maks. 2MB. Biarkan kosong jika tidak ingin mengubah foto.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_name">Nama Produk *</Label>
                <Input id="edit_name" name="name" required defaultValue={editingProduct.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_price">Harga (Rp) *</Label>
                <PriceInput id="edit_price" name="price" required defaultValue={editingProduct.price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Deskripsi</Label>
                <Textarea id="edit_description" name="description" defaultValue={editingProduct.description || ''} rows={4} />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="edit_available">Ketersediaan</Label>
                <select name="is_available" defaultValue={editingProduct.is_available ? 'true' : 'false'} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">
                  <option value="true">Tersedia</option>
                  <option value="false">Habis</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-slate-50">
                <div className="space-y-0.5">
                  <Label htmlFor="edit_preorder" className="text-sm font-medium cursor-pointer">Pre Order</Label>
                  <p className="text-xs text-slate-500">Aktifkan jika produk ini hanya bisa dipesan di awal.</p>
                </div>
                <Switch
                  id="edit_preorder"
                  checked={isPreorder}
                  onCheckedChange={setIsPreorder}
                />
              </div>
              <input type="hidden" name="is_preorder" value={isPreorder ? 'true' : 'false'} />
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

      {/* Product Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-20">Foto</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  Belum ada produk. Klik &quot;Tambah Produk&quot; untuk memulai.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative group h-14 w-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <ImagePlus className="h-5 w-5 text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(product.id, e)} />
                      </label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{product.description || '-'}</p>
                  </TableCell>
                  <TableCell className="font-bold text-amber-600">
                    Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge variant={product.is_available ? 'default' : 'destructive'} className={product.is_available ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}>
                        {product.is_available ? 'Tersedia' : 'Habis'}
                      </Badge>
                      {product.is_preorder && (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-50 text-[10px]">
                          <Clock className="mr-1 h-3 w-3" /> Pre Order
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id, product.name)}>
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
