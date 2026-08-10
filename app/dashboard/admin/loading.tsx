import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 py-32">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      <p className="mt-4 text-sm font-medium text-slate-500">Menarik data dari server...</p>
    </div>
  );
}
