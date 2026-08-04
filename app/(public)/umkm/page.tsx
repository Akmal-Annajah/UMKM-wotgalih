import Link from 'next/link';
import { Store, Search } from 'lucide-react';
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
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Katalog UMKM</h1>
        <p className="mt-4 text-lg text-slate-600">
          Jelajahi berbagai unit usaha yang ada di Desa Wotgalih. 
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUmkms.map((umkm) => (
            <Link key={umkm.id} href={`/umkm/${umkm.slug}`}>
              <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-slate-200 group">
                <div className="aspect-[4/3] bg-slate-100 relative">
                  {umkm.logo_url ? (
                    <img src={umkm.logo_url} alt={umkm.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-200">
                      <Store className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  {(umkm.categories as any)?.name && (
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 mb-3">
                      {(umkm.categories as any).name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{umkm.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {umkm.description || 'UMKM Lokal Desa Wotgalih.'}
                  </p>
                </CardContent>
              </Card>
            </Link>
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
