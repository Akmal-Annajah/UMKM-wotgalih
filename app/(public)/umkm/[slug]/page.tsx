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

  const socialLinks = [
    waLink && { href: waLink, label: 'WhatsApp', color: 'bg-[#25D366] hover:bg-[#1ebd5a] text-white', icon: <Phone className="h-3.5 w-3.5" /> },
    umkm.instagram && { href: umkm.instagram, label: 'Instagram', color: 'bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white', icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
    umkm.facebook_url && { href: umkm.facebook_url, label: 'Facebook', color: 'bg-[#1877F2] hover:bg-[#166FE5] text-white', icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
    umkm.tiktok_url && { href: umkm.tiktok_url, label: 'TikTok', color: 'bg-slate-900 hover:bg-slate-800 text-white', icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg> },
  ].filter(Boolean) as { href: string; label: string; color: string; icon: React.ReactNode }[];

  return (
    <div className="min-h-screen bg-slate-50 pb-16 sm:pb-24">
      {/* Banner */}
      <div className="h-40 sm:h-56 md:h-72 w-full bg-slate-200 relative">
        {umkm.banner_url ? (
          <img src={umkm.banner_url} alt={`Banner ${umkm.name}`} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10">
          <Link href="/umkm">
            <Button size="sm" variant="ghost" className="text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md shadow-sm rounded-full px-4 h-8 sm:h-9 sm:px-6 text-xs sm:text-sm transition-all hover:-translate-x-1">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header — centered on mobile, left-aligned on desktop */}
        <div className="relative -mt-14 sm:-mt-20 mb-6 sm:mb-10">
          <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
            {/* Logo */}
            <div className="h-24 w-24 sm:h-36 sm:w-36 shrink-0 rounded-2xl sm:rounded-3xl border-[3px] sm:border-4 border-white bg-white shadow-lg overflow-hidden">
              {umkm.logo_url ? (
                <img src={umkm.logo_url} alt={`Logo ${umkm.name}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                  <Store className="h-10 w-10 sm:h-16 sm:w-16" />
                </div>
              )}
            </div>
            
            {/* Name & Category */}
            <div className="mt-3 sm:mt-0 sm:pb-2 sm:pt-16 text-center sm:text-left flex-1 min-w-0">
              {umkm.categories && 'name' in umkm.categories && (
                <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 mb-1.5 sm:mb-2">
                  {umkm.categories.name}
                </span>
              )}
              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{umkm.name}</h1>
            </div>
          </div>

          {/* Social Links — horizontally scrollable on mobile */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4 sm:mt-5">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className={`${link.color} font-semibold rounded-full shadow-sm h-8 px-3.5 text-xs transition-all hover:-translate-y-0.5 hover:shadow-md`}>
                    {link.icon}
                    <span className="ml-1.5">{link.label}</span>
                  </Button>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          {/* Products */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" /> Produk Kami
            </h2>
            
            {umkm.products && umkm.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6">
                {umkm.products.map((product: any) => (
                  <Link key={product.id} href={`/produk/${product.slug}`}>
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl border-slate-200 rounded-2xl sm:rounded-3xl group">
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                            <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12" />
                          </div>
                        )}
                        {!product.is_available && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 rounded-md bg-red-500/90 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold text-white backdrop-blur-sm">
                            Habis
                          </div>
                        )}
                        {product.is_preorder && (
                          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded-md bg-amber-500/90 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold text-white backdrop-blur-sm">
                            Pre Order
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3 sm:p-4">
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
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">UMKM ini belum menambahkan produk.</p>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            {/* About */}
            <Card className="border-slate-200 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-4">Tentang Kami</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {umkm.description || 'Tidak ada deskripsi.'}
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-slate-200 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Informasi Kontak</h3>
                <ul className="space-y-3">
                  {umkm.address && (
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="mt-0.5 p-1.5 bg-blue-50 rounded-lg shrink-0">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="leading-relaxed">{umkm.address}</span>
                    </li>
                  )}
                  {umkm.whatsapp && (
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>{umkm.whatsapp}</span>
                    </li>
                  )}
                </ul>

                {umkm.maps_url && (
                  <div className="mt-4 sm:mt-6">
                    <a href={umkm.maps_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl h-9 sm:h-10 text-xs sm:text-sm">
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

