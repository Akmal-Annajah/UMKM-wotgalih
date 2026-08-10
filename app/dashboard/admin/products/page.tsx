import { createClient } from '@/lib/supabase/server';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export const metadata = {
  title: 'Kelola Produk - Admin',
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, umkms(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Produk</h1>
        <p className="mt-2 text-slate-500">Lihat seluruh produk dari semua UMKM yang terdaftar.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-20">Foto</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>UMKM</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!products || products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  Belum ada produk yang terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{product.name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{product.umkms?.name || '-'}</TableCell>
                  <TableCell className="font-bold text-amber-600">
                    Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.is_available ? 'default' : 'destructive'}
                      className={product.is_available ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                    >
                      {product.is_available ? 'Tersedia' : 'Habis'}
                    </Badge>
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
