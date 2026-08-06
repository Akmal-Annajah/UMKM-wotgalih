import { createClient } from '@/lib/supabase/server';
import { getMyUMKM, getMyProducts } from '@/services/umkm.service';
import { ProductTable } from './ProductTable';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Kelola Produk - Dashboard UMKM',
};

export default async function UMKMProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const umkm = user ? await getMyUMKM(user.id) : null;

  if (!umkm) {
    redirect('/dashboard/umkm');
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
