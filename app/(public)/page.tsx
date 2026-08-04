import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, MapPin, Store } from 'lucide-react';
import { getCategories, getFeaturedUMKMs, getLatestProducts } from '@/services/public.service';
import { Card, CardContent } from '@/components/ui/card';

export default async function LandingPage() {
  const categories = await getCategories();
  const featuredUMKMs = await getFeaturedUMKMs(4);
  const latestProducts = await getLatestProducts(4);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 text-white sm:pt-32 sm:pb-40">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute top-1/2 right-0 h-80 w-80 -translate-y-1/2 translate-x-1/3 rounded-full bg-amber-500/20 blur-3xl" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Katalog Digital UMKM
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Jelajahi Potensi Kreatif <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
              Desa Wotgalih
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl leading-relaxed">
            Dukung pertumbuhan ekonomi lokal dengan menemukan, memesan, dan menikmati produk serta jasa langsung dari para pembuatnya di Desa Wotgalih.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/umkm">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 border-0">
                Jelajahi UMKM
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#tentang">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 border-slate-600 bg-slate-800/50 hover:bg-slate-800 text-white text-base font-semibold backdrop-blur-sm">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Kategori UMKM</h2>
          <p className="mt-4 text-slate-600">Temukan produk berdasarkan kategori yang tersedia.</p>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/umkm?category=${cat.slug}`}>
                <Card className="group cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all duration-300 bg-white">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="mb-3 rounded-full bg-emerald-50 p-3 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-transform">
                      <Store className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-slate-900 text-center">{cat.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada kategori yang ditambahkan.</p>
          </div>
        )}
      </section>

      {/* Featured UMKM Section */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">UMKM Pilihan</h2>
              <p className="mt-2 text-slate-600 max-w-2xl">Beberapa unit usaha lokal yang siap melayani kebutuhan Anda.</p>
            </div>
            <Link href="/umkm">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                Lihat Semua UMKM <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredUMKMs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredUMKMs.map((umkm) => (
                <Link key={umkm.id} href={`/umkm/${umkm.slug}`}>
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-slate-200">
                    <div className="aspect-[4/3] bg-slate-100 relative">
                      {umkm.logo_url ? (
                        <img src={umkm.logo_url} alt={umkm.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-200">
                          <Store className="h-16 w-16" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      {umkm.categories && (umkm.categories as any).name && (
                        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 mb-3">
                          {(umkm.categories as any).name}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{umkm.name}</h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {umkm.description || 'UMKM Lokal Desa Wotgalih.'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Store className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Belum Ada UMKM</h3>
              <p className="text-slate-500 mt-1">Daftar UMKM akan segera hadir.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Produk Terbaru</h2>
            <p className="mt-2 text-slate-600 max-w-2xl">Eksplorasi inovasi dan karya terbaru dari masyarakat Wotgalih.</p>
          </div>
          <Link href="/produk">
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <Link key={product.id} href={`/produk/${product.slug}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg group">
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                        <ShoppingBag className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-emerald-600 mb-1">{(product.umkms as any)?.name}</p>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{product.name}</h3>
                    <p className="mt-2 text-lg font-extrabold text-amber-500">
                      Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Belum Ada Produk</h3>
            <p className="text-slate-500 mt-1">Produk-produk menarik akan segera ditambahkan.</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="tentang" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-emerald-900 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 sm:p-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Membangun Ekonomi Kreatif Desa Wotgalih</h2>
              <p className="text-emerald-100 text-lg leading-relaxed mb-8">
                Desa Wotgalih memiliki potensi besar dalam bidang agrikultur, kerajinan, dan kuliner tradisional. Melalui platform digital ini, kami menjembatani pelaku UMKM dengan pasar yang lebih luas, membuka peluang baru, dan mendorong kemandirian ekonomi desa.
              </p>
              <div className="flex items-center gap-4 text-emerald-200">
                <MapPin className="h-6 w-6" />
                <span>Kecamatan Nguling, Kabupaten Pasuruan</span>
              </div>
            </div>
            <div className="hidden lg:block relative aspect-video rounded-2xl overflow-hidden bg-emerald-800 border border-emerald-700 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center text-emerald-600/50">
                <Store className="h-32 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
