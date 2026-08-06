import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Store, ShoppingBag, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/services/public.service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return { title: 'Produk Tidak Ditemukan' };
  
  return {
    title: `${product.name} - UMKM Wotgalih`,
    description: product.description || `Beli ${product.name} dari ${product.umkms?.name}`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  
  if (!product) {
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

  const umkmName = product.umkms?.name || 'UMKM';
  const waNumber = product.umkms?.whatsapp ? formatWA(product.umkms.whatsapp) : '';
  
  // Create pre-filled WhatsApp message
  const waMessage = encodeURIComponent(
    `Halo ${umkmName},\n\nSaya tertarik untuk membeli produk Anda:\n*${product.name}*\n(Rp ${new Intl.NumberFormat('id-ID').format(product.price)})\n\nApakah produk ini masih tersedia?`
  );
  const waLink = waNumber ? `https://api.whatsapp.com/send?phone=${waNumber}&text=${waMessage}` : null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/umkm/${product.umkms?.slug}`}>
            <Button variant="ghost" className="-ml-4 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke {umkmName}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm ring-1 ring-slate-200">
          
          {/* Product Image */}
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                <ShoppingBag className="h-32 w-32" />
              </div>
            )}
            {!product.is_available && (
              <div className="absolute top-4 right-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                Habis Terjual
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <Link href={`/umkm/${product.umkms?.slug}`} className="inline-block mb-4 group w-fit">
              <div className="flex items-center gap-3 rounded-full bg-slate-100 pr-4 pl-1.5 py-1.5 transition-colors group-hover:bg-emerald-50">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-white shrink-0">
                  {product.umkms?.logo_url ? (
                    <img src={product.umkms.logo_url} alt={umkmName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Store className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{umkmName}</span>
              </div>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
            
            <p className="text-3xl font-black text-amber-500 mb-8">
              Rp {new Intl.NumberFormat('id-ID').format(product.price)}
            </p>

            <div className="prose prose-slate max-w-none mb-10 text-slate-600 leading-relaxed whitespace-pre-wrap">
              {product.description || 'Tidak ada deskripsi untuk produk ini.'}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100">
              {waLink ? (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#1ebd5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-1" disabled={!product.is_available}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6 mr-3 brightness-0 invert" />
                    {product.is_available ? 'Beli via WhatsApp' : 'Sedang Habis'}
                  </Button>
                </a>
              ) : (
                <Button size="lg" disabled className="w-full h-14 text-lg">
                  Nomor Kontak Tidak Tersedia
                </Button>
              )}
              <p className="text-center text-xs text-slate-400 mt-4">
                Anda akan diarahkan ke WhatsApp untuk berkomunikasi langsung dengan penjual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
