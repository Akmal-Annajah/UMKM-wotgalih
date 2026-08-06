import Link from 'next/link';
import { Store, Search, ArrowLeft, ShoppingBag, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllUMKMs } from '@/services/public.service';

export const metadata = {
  title: 'Katalog UMKM - Desa Wotgalih',
  description: 'Daftar seluruh UMKM yang ada di Desa Wotgalih',
};

export default async function UMKMListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const searchQ = params.q?.toLowerCase() || '';
  
  const umkms = await getAllUMKMs(category);
  
  const filteredUmkms = umkms.filter(u => 
    u.name.toLowerCase().includes(searchQ) || 
    (u.description && u.description.toLowerCase().includes(searchQ))
  );

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 text-slate-500 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Button>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Katalog UMKM & Produk</h1>
        <p className="mt-4 text-lg text-slate-600">
          Jelajahi berbagai unit usaha dan produk unggulan yang ada di Desa Wotgalih.
          {category && <span className="font-semibold text-emerald-600"> Kategori: {category}</span>}
        </p>
      </div>

      <div className="mb-8 max-w-md">
        <form className="flex items-center gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              name="q"
              defaultValue={params.q}
              placeholder="Cari nama UMKM..." 
              className="pl-10 border-slate-300 focus-visible:ring-emerald-500"
            />
          </div>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Cari
          </Button>
          {(params.q || category) && (
            <Link href="/umkm">
              <Button variant="outline">Reset</Button>
            </Link>
          )}
        </form>
      </div>

      {filteredUmkms.length > 0 ? (
        <div className="flex flex-col gap-12">
          {filteredUmkms.map((umkm) => (
            <div key={umkm.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Profile UMKM (Kiri / Atas) */}
              <div className="md:w-1/3 p-6 md:p-8 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
                <Link href={`/umkm/${umkm.slug}`} className="group inline-block">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                      {umkm.logo_url ? (
                        <img src={umkm.logo_url} alt={umkm.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <Store className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">{umkm.name}</h3>
                      {(umkm.categories as any)?.name && (
                        <span className="inline-block mt-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          {(umkm.categories as any).name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                  {umkm.description || 'UMKM Lokal Desa Wotgalih.'}
                </p>
                <div className="mt-auto pt-4">
                  <Link href={`/umkm/${umkm.slug}`}>
                    <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                      Lihat Profil Lengkap
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Produk (Kanan / Bawah) */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-600" /> Katalog Produk
                  </h4>
                  {umkm.products && umkm.products.length > 3 && (
                    <Link href={`/umkm/${umkm.slug}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                      Lihat Semua ({umkm.products.length})
                    </Link>
                  )}
                </div>

                {umkm.products && umkm.products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {umkm.products.slice(0, 3).map((product: any) => (
                      <Link key={product.id} href={`/produk/${product.slug}`}>
                        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200 group">
                          <div className="aspect-square bg-slate-100 relative">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <ShoppingBag className="h-8 w-8" />
                              </div>
                            )}
                            {!product.is_available && (
                              <div className="absolute top-1 right-1 rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                Habis
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h5>
                            <p className="mt-1 text-sm font-bold text-amber-600">
                              Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 rounded-xl border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
                    Belum ada produk.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <Store className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Tidak ada UMKM ditemukan</h2>
          <p className="mt-2 text-slate-500">Coba ubah kata kunci pencarian atau kategori Anda.</p>
        </div>
      )}
    </div>
  );
}
