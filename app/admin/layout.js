'use client';
import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AuthGuard from '@/components/ui/AuthGuard';
import { Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard redirectTo="/login" requireAdmin={true}>
      <div className="flex min-h-screen bg-[#080b0f]">
        <Sidebar />

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 glass-dark border-r border-white/5 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <div className="lg:hidden flex items-center gap-3 px-4 py-4 glass-dark border-b border-white/5">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl glass border border-white/10 text-gray-400">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg btn-neon flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-black">Swift<span className="text-green-400">Bit</span></span>
            </Link>
          </div>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
