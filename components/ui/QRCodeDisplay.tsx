'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  slug: string;
  umkmName: string;
}

export function QRCodeDisplay({ slug, umkmName }: QRCodeDisplayProps) {
  // In production, you might want to use process.env.NEXT_PUBLIC_BASE_URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const linkUrl = `${baseUrl}/link/${slug}`;

  const downloadQR = () => {
    const canvas = document.getElementById('umkm-qr-code') as HTMLCanvasElement;
    if (!canvas) {
      toast.error('QR Code tidak ditemukan');
      return;
    }

    try {
      // Konversi canvas ke data URL langsung
      const dataUrl = canvas.toDataURL('image/png');
      
      // Buat link download
      const link = document.createElement('a');
      link.download = `QR-Code-${umkmName}.png`;
      link.href = dataUrl;
      link.style.display = 'none';
      
      // Tambahkan ke body, klik, lalu hapus
      document.body.appendChild(link);
      link.click();
      
      // Delay penghapusan agar browser sempat memproses
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      toast.success('QR Code berhasil diunduh!');
    } catch {
      // Fallback: buka gambar di tab baru agar user bisa save manual
      const dataUrl = canvas.toDataURL('image/png');
      const win = window.open();
      if (win) {
        win.document.write(`<img src="${dataUrl}" alt="QR Code" /><p>Klik kanan pada gambar lalu pilih "Save image as..." untuk menyimpan.</p>`);
      }
      toast.info('Gambar QR dibuka di tab baru. Klik kanan untuk menyimpan.');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success('Tautan berhasil disalin!');
    } catch (err) {
      toast.error('Gagal menyalin tautan');
    }
  };

  return (
    <Card className="border-emerald-100 shadow-sm bg-gradient-to-b from-white to-emerald-50/30">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl text-emerald-900">QR Code Linktree</CardTitle>
        <CardDescription>
          Cetak atau bagikan QR Code ini agar pelanggan bisa melihat semua link Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 pt-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
          <QRCodeCanvas 
            id="umkm-qr-code"
            value={linkUrl} 
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#064e3b" // emerald-900
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            onClick={downloadQR}
          >
            <Download className="mr-2 h-4 w-4" /> Unduh QR
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={copyLink}
          >
            <LinkIcon className="mr-2 h-4 w-4" /> Salin Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
