import { Loader2 } from 'lucide-react';

export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full border-4 border-blue-100"></div>
        <div className="absolute h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <Loader2 className="h-6 w-6 text-blue-600 animate-pulse" />
      </div>
      <p className="mt-6 text-sm font-semibold text-slate-500 animate-pulse tracking-wide">
        Memuat konten...
      </p>
    </div>
  );
}
