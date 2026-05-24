'use client';
import { useEffect } from 'react';
import BottomNav from '@/components/wallet/BottomNav';
import AuthGuard from '@/components/ui/AuthGuard';
import { useAuth } from '@/store/useAppStore';

function UserSyncer() {
  const { token, updateUser } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.user) updateUser(data.user); })
      .catch(() => {});
  }, [token]);

  return null;
}

export default function WalletLayout({ children }) {
  return (
    <AuthGuard redirectTo="/login">
      <UserSyncer />
      <div className="min-h-screen bg-[#080b0f] pb-24">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
