import { createClient } from '@/lib/supabase/server';
import { getMyUMKM, getMyProducts } from '@/services/umkm.service';
import { ProductTable } from './ProductTable';
import { AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Kelola Produk - Dashboard UMKM',
};

export default async function UMKMProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const umkm = user ? await getMyUMKM(user.id) : null;

  if (!umkm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-16 w-16 text-amber-400 mb-6" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profil UMKM Belum Ditemukan</h1>
        <p className="text-slate-500 max-w-md">
          Akun Anda belum terhubung dengan data UMKM. Hubungi Admin.
        </p>
      </div>
    );
  }

  const products = await getMyProducts(umkm.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Produk</h1>
        <p className="mt-2 text-slate-500">Tambah, edit, atau hapus produk UMKM Anda.</p>
      </div>
      <ProductTable products={products} umkmId={umkm.id} />
    </div>
  );
}
