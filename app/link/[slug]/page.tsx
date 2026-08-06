import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Store, ShoppingBag } from 'lucide-react';
import { getUMKMBySlug } from '@/services/public.service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const umkm = await getUMKMBySlug(resolvedParams.slug);
  if (!umkm) return { title: 'UMKM Tidak Ditemukan' };
  
  return {
    title: `${umkm.name} - Links`,
    description: `Kumpulan tautan resmi dari ${umkm.name}`,
  };
}

// Menghapus 'flex items-center gap-3' agar teks bisa benar-benar di tengah
const linkBaseStyle = "relative w-full h-14 flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";
const iconStyle = "absolute left-5 h-5 w-5 shrink-0"; // Ikon dipaku di kiri

export default async function LinktreePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const umkm = await getUMKMBySlug(resolvedParams.slug);
  
  if (!umkm) {
    notFound();
  }

  const formatWA = (wa: string) => {
    if (!wa) return '';
    let cleaned = wa.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
    return cleaned;
  };

  const waMessage = encodeURIComponent(`Halo Admin ${umkm.name}, saya ingin bertanya seputar UMKM Anda.`);
  const waLink = umkm.whatsapp ? `https://api.whatsapp.com/send?phone=${formatWA(umkm.whatsapp)}&text=${waMessage}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-slate-50 relative overflow-hidden flex flex-col items-center">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/30 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-700/30 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12 flex flex-col items-center">
        {/* Profile */}
        <div className="h-28 w-28 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white mb-5">
          {umkm.logo_url ? (
            <img src={umkm.logo_url} alt={`Logo ${umkm.name}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <Store className="h-12 w-12" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">{umkm.name}</h1>
        
        {umkm.description && (
          <p className="text-emerald-100/70 text-center text-sm mb-10 line-clamp-3">{umkm.description}</p>
        )}

        {/* Links */}
        <div className="w-full space-y-3">
          <Link
            href={`/umkm/${umkm.slug}`}
            className={`${linkBaseStyle} bg-white/10 border border-white/20 text-white backdrop-blur-md`}
          >
            <Store className={iconStyle} />
            <span>Katalog Produk & Profil Web</span>
          </Link>

          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className={`${linkBaseStyle} bg-[#25D366] text-white`}
            >
              <Phone className={iconStyle} />
              <span>Chat via WhatsApp</span>
            </a>
          )}

          {umkm.shopee_url && (
            <a href={umkm.shopee_url} target="_blank" rel="noopener noreferrer"
              className={`${linkBaseStyle} bg-[#EE4D2D] text-white`}
            >
              <ShoppingBag className={iconStyle} />
              <span>Toko di Shopee</span>
            </a>
          )}

          {umkm.tokopedia_url && (
            <a href={umkm.tokopedia_url} target="_blank" rel="noopener noreferrer"
              className={`${linkBaseStyle} bg-[#42B549] text-white`}
            >
              <ShoppingBag className={iconStyle} />
              <span>Toko di Tokopedia</span>
            </a>
          )}

          {umkm.instagram && (
            <a href={umkm.instagram} target="_blank" rel="noopener noreferrer"
              className={`${linkBaseStyle} text-white`}
              style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
            >
              <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Instagram</span>
            </a>
          )}

          {umkm.tiktok_url && (
            <a href={umkm.tiktok_url} target="_blank" rel="noopener noreferrer"
              className={`${linkBaseStyle} bg-black border border-white/20 text-white`}
            >
              <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span>TikTok</span>
            </a>
          )}

          {umkm.maps_url && (
            <a href={umkm.maps_url} target="_blank" rel="noopener noreferrer"
              className={`${linkBaseStyle} bg-transparent border border-white/10 text-white/70 hover:text-white hover:bg-white/5 mt-4`}
            >
              <MapPin className={iconStyle} />
              <span>Buka Google Maps</span>
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="mt-12 text-emerald-200/40 text-xs">UMKM Wotgalih</p>
      </div>
    </div>
  );
}
