import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Map, Store, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getUMKMBySlug } from '@/services/public.service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const umkm = await getUMKMBySlug(resolvedParams.slug);
  if (!umkm) return { title: 'UMKM Tidak Ditemukan' };
  
  return {
    title: `${umkm.name} - UMKM Wotgalih`,
    description: umkm.description || `Profil dan katalog produk dari ${umkm.name}`,
  };
}

export default async function UMKMDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const umkm = await getUMKMBySlug(resolvedParams.slug);
  
  if (!umkm) {
    notFound();
  }

  // Format WhatsApp number
  const formatWA = (wa: string) => {
    if (!wa) return '';
    let cleaned = wa.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  const waMessage = encodeURIComponent(`Halo Admin ${umkm.name}, saya ingin bertanya seputar produk UMKM Anda.`);
  const waLink = umkm.whatsapp ? `https://api.whatsapp.com/send?phone=${formatWA(umkm.whatsapp)}&text=${waMessage}` : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="h-48 sm:h-64 md:h-80 w-full bg-slate-200 relative">
        {umkm.banner_url ? (
          <img src={umkm.banner_url} alt={`Banner ${umkm.name}`} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-700 to-blue-900" />
        )}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <Link href="/umkm">
            <Button variant="ghost" className="text-slate-900 bg-white/80 hover:bg-white backdrop-blur-md shadow-sm rounded-full px-6 transition-all hover:-translate-x-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-20 mb-12 flex flex-col sm:flex-row gap-6 sm:items-end">
          <div className="h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden">
            {umkm.logo_url ? (
              <img src={umkm.logo_url} alt={`Logo ${umkm.name}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                <Store className="h-16 w-16" />
              </div>
            )}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {umkm.categories && 'name' in umkm.categories && (
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-2">
                    {umkm.categories.name}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{umkm.name}</h1>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                {waLink && (
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#25D366] hover:bg-[#1ebd5a] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                      <Phone className="mr-2 h-4 w-4" /> WhatsApp
                    </Button>
                  </a>
                )}
                {umkm.instagram && (
                  <a href={umkm.instagram} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 font-semibold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      Instagram
                    </Button>
                  </a>
                )}
                {umkm.tiktok_url && (
                  <a href={umkm.tiktok_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-100 font-semibold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      TikTok
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" /> Produk Kami
            </h2>
            
            {umkm.products && umkm.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {umkm.products.map((product: any) => (
                  <Link key={product.id} href={`/produk/${product.slug}`}>
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-slate-200 rounded-3xl group">
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                            <ShoppingBag className="h-12 w-12" />
                          </div>
                        )}
                        {!product.is_available && (
                          <div className="absolute top-2 right-2 rounded-md bg-red-500/90 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            Habis
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{product.name}</h3>
                        <p className="mt-2 text-xl font-extrabold text-amber-500">
                          Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">UMKM ini belum menambahkan produk.</p>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Tentang Kami</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {umkm.description || 'Tidak ada deskripsi.'}
                </p>
                
                <hr className="my-6 border-slate-100" />
                
                <h3 className="text-lg font-bold text-slate-900 mb-4">Informasi Kontak</h3>
                <ul className="space-y-4">
                  {umkm.address && (
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                      <span>{umkm.address}</span>
                    </li>
                  )}
                  {umkm.whatsapp && (
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-5 w-5 shrink-0 text-blue-600" />
                      <span>{umkm.whatsapp}</span>
                    </li>
                  )}
                </ul>

                {umkm.maps_url && (
                  <div className="mt-6">
                    <a href={umkm.maps_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                        <Map className="mr-2 h-4 w-4" /> Buka di Google Maps
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
