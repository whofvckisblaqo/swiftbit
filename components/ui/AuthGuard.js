'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function AuthGuard({ children, redirectTo = '/login', requireAdmin = false }) {
  const router = useRouter();
  const _hydrated = useAppStore(s => s._hydrated);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const user = useAppStore(s => s.user);

  useEffect(() => {
    if (!_hydrated) return;
    if (!isAuthenticated) {
      router.replace(redirectTo);
    } else if (requireAdmin && user?.role !== 'admin') {
      router.replace('/wallet');
    }
  }, [_hydrated, isAuthenticated, user, router, redirectTo, requireAdmin]);

  // Wait for localStorage to rehydrate before rendering or redirecting
  if (!_hydrated) return null;
  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role !== 'admin') return null;
  return children;
}
