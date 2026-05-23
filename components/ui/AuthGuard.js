'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function AuthGuard({ children, redirectTo = '/login' }) {
  const router = useRouter();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  if (!isAuthenticated) return null;
  return children;
}
