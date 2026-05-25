'use client';
import { useEffect } from 'react';
import BottomNav from '@/components/wallet/BottomNav';
import AuthGuard from '@/components/ui/AuthGuard';
import { useAuth, useNotifs, useWallet } from '@/store/useAppStore';

function UserSyncer() {
  const { token, updateUser } = useAuth();
  const { addNotification } = useNotifs();

  useEffect(() => {
    if (!token) return;

    const sync = () => {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.user) updateUser(data.user);
          if (data.pendingNotifications?.length) {
            data.pendingNotifications.forEach(n => addNotification(n));
          }
        })
        .catch(() => {});
    };

    sync();
    const interval = setInterval(sync, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return null;
}

function PriceSyncer() {
  const { updatePrices } = useWallet();

  useEffect(() => {
    const fetchPrices = () => {
      fetch('/api/prices')
        .then(r => r.json())
        .then(data => { if (data.prices) updatePrices(data.prices); })
        .catch(() => {});
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function WalletLayout({ children }) {
  return (
    <AuthGuard redirectTo="/login">
      <UserSyncer />
      <PriceSyncer />
      <div className="min-h-screen bg-[#080b0f] pb-24">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
