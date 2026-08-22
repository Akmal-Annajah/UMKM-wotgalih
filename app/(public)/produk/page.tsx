import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllProducts } from '@/services/public.service';

export const metadata = {
  title: 'Katalog Produk - Desa Wotgalih',
  description: 'Daftar seluruh produk UMKM di Desa Wotgalih',
};

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQ = params.q?.toLowerCase() || '';
  
  const products = await getAllProducts(searchQ);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Katalog Produk</h1>
        <p className="mt-4 text-lg text-slate-600">
          Temukan produk dan kerajinan terbaik dari UMKM Desa Wotgalih.
        </p>
      </div>

      <div className="mb-8 max-w-md">
        <form className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              name="q"
              defaultValue={params.q}
              placeholder="Cari nama produk..." 
              className="pl-10 border-slate-300 focus-visible:ring-blue-500"
            />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Cari
          </Button>
          {params.q && (
            <Link href="/produk">
              <Button variant="outline">Reset</Button>
            </Link>
          )}
        </form>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/produk/${product.slug}`}>
              <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg group border-slate-200 rounded-2xl sm:rounded-3xl">
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                      <ShoppingBag className="h-16 w-16" />
                    </div>
                  )}
                  {product.is_preorder && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded-md bg-amber-500/90 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold text-white backdrop-blur-sm">
                      Pre Order
                    </div>
                  )}
                </div>
                <CardContent className="p-3 sm:p-5">
                  <p className="text-[10px] sm:text-xs font-medium text-blue-600 mb-1 line-clamp-1">
                    {(product.umkms as any)?.name}
                  </p>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 line-clamp-2">{product.name}</h3>
                  <p className="mt-1 sm:mt-2 text-base sm:text-xl font-extrabold text-amber-500">
                    Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Tidak ada produk ditemukan</h2>
          <p className="mt-2 text-slate-500">Silakan gunakan kata kunci pencarian yang lain.</p>
        </div>
      )}
    </div>
  );
}
