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

// Reusable styles for the new premium layout
const sectionHeaderStyle = "text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400/80 mb-3 flex items-center gap-3";
const glassCardStyle = "relative w-full h-[56px] flex items-center rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] overflow-hidden group bg-white/5 border border-white/10 text-slate-100 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]";
const iconContainerStyle = "absolute left-1.5 h-[44px] w-[44px] flex items-center justify-center rounded-xl bg-white/5 transition-transform duration-300 group-hover:scale-105 group-hover:bg-white/10";
const socialCardStyle = "flex-1 min-w-[90px] max-w-[120px] flex flex-col items-center justify-center gap-2 h-24 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 group";
const socialIconWrapper = "p-2.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors";

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
    <div className="min-h-screen bg-[#060D1A] text-slate-50 relative flex flex-col items-center selection:bg-orange-500/30">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute top-[40%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
      </div>

      {/* Main Container - Mobile First Constrained */}
      <div className="relative z-10 w-full max-w-[430px] min-h-screen flex flex-col mx-auto px-5 py-12">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-28 w-28 rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden bg-slate-900 mb-5 relative group">
            {umkm.logo_url ? (
              <img src={umkm.logo_url} alt={`Logo ${umkm.name}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500 bg-slate-800/50">
                <Store className="h-10 w-10" />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full pointer-events-none"></div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{umkm.name}</h1>
          
          {umkm.description && (
            <p className="text-slate-400 text-sm leading-relaxed max-w-[320px] mx-auto line-clamp-3">
              {umkm.description}
            </p>
          )}
        </div>

        {/* Link Groups */}
        <div className="w-full space-y-8 flex-1">
          
          {/* Primary Actions */}
          <div className="w-full flex flex-col gap-3">
            <Link
              href={`/umkm/${umkm.slug}`}
              className="relative w-full h-[60px] flex items-center justify-center rounded-2xl text-[15px] font-bold transition-all duration-300 active:scale-[0.98] overflow-hidden group bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 border border-orange-400/30"
            >
              <Store className="absolute left-5 h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span>Katalog Produk & Profil</span>
            </Link>

            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="relative w-full h-[56px] flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] overflow-hidden group bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366]/50"
              >
                <Phone className="absolute left-5 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span>Chat via WhatsApp</span>
              </a>
            )}
          </div>

          {/* Belanja Online */}
          {(umkm.shopee_url || umkm.tokopedia_url) && (
            <div className="w-full">
              <h2 className={sectionHeaderStyle}>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></span>
                <span>Belanja</span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></span>
              </h2>
              <div className="flex flex-col gap-3">
                {umkm.shopee_url && (
                  <a href={umkm.shopee_url} target="_blank" rel="noopener noreferrer" className={glassCardStyle}>
                    <div className={iconContainerStyle}>
                      <ShoppingBag className="h-4 w-4 text-[#EE4D2D]" />
                    </div>
                    <span className="w-full text-center pr-12 pl-14">Toko di Shopee</span>
                  </a>
                )}
                {umkm.tokopedia_url && (
                  <a href={umkm.tokopedia_url} target="_blank" rel="noopener noreferrer" className={glassCardStyle}>
                    <div className={iconContainerStyle}>
                      <ShoppingBag className="h-4 w-4 text-[#42B549]" />
                    </div>
                    <span className="w-full text-center pr-12 pl-14">Toko di Tokopedia</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Sosial Media */}
          {(umkm.instagram || umkm.facebook_url || umkm.tiktok_url) && (
            <div className="w-full">
              <h2 className={sectionHeaderStyle}>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></span>
                <span className="whitespace-nowrap">Ikuti Kami</span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></span>
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {umkm.instagram && (
                  <a href={umkm.instagram} target="_blank" rel="noopener noreferrer" className={socialCardStyle}>
                    <div className={socialIconWrapper}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#833ab4" />
                            <stop offset="50%" stopColor="#fd1d1d" />
                            <stop offset="100%" stopColor="#fcb045" />
                          </linearGradient>
                        </defs>
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </div>
                    <span>Instagram</span>
                  </a>
                )}
                {umkm.facebook_url && (
                  <a href={umkm.facebook_url} target="_blank" rel="noopener noreferrer" className={socialCardStyle}>
                    <div className={socialIconWrapper}>
                      <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span>Facebook</span>
                  </a>
                )}
                {umkm.tiktok_url && (
                  <a href={umkm.tiktok_url} target="_blank" rel="noopener noreferrer" className={socialCardStyle}>
                    <div className={socialIconWrapper}>
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Lokasi */}
          {umkm.maps_url && (
            <div className="w-full">
              <h2 className={sectionHeaderStyle}>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></span>
                <span>Lokasi</span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></span>
              </h2>
              <a href={umkm.maps_url} target="_blank" rel="noopener noreferrer" className={glassCardStyle}>
                <div className={iconContainerStyle}>
                  <MapPin className="h-4 w-4 text-red-400" />
                </div>
                <span className="w-full text-center pr-12 pl-14">Buka Google Maps</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-600/80 text-[10px] tracking-widest uppercase mb-1">
            Member Of
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-slate-400 font-bold tracking-wider text-xs">UMKM WOTGALIH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
