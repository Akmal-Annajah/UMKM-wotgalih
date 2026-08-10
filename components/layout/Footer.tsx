export function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">UMKM Wotgalih</h3>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Platform katalog digital untuk memberdayakan dan mempromosikan produk unggulan dari Usaha Mikro, Kecil, dan Menengah di Desa Wotgalih.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Tautan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Beranda</a></li>
              <li><a href="/umkm" className="hover:text-blue-400 transition-colors">Daftar UMKM</a></li>
              <li><a href="/login" className="hover:text-blue-400 transition-colors">Login UMKM</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Desa Wotgalih, Yosowilangun</li>
              <li>Lumajang, Jawa Timur</li>
              <li>Email: kknwotgalih26@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Desa Wotgalih. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
