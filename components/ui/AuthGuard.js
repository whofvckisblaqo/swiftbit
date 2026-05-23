'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function AuthGuard({ children, redirectTo = '/login', requireAdmin = false }) {
  const router = useRouter();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const user = useAppStore(s => s.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    } else if (requireAdmin && user?.role !== 'admin') {
      router.replace('/wallet');
    }
  }, [isAuthenticated, user, router, redirectTo, requireAdmin]);

  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role !== 'admin') return null;
  return children;
}
