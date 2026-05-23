'use client';
import BottomNav from '@/components/wallet/BottomNav';
import AuthGuard from '@/components/ui/AuthGuard';

export default function WalletLayout({ children }) {
  return (
    <AuthGuard redirectTo="/login">
      <div className="min-h-screen bg-[#080b0f] pb-24">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
