'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/store/useAppStore';

export default function KycGate({ children }) {
  const { user, token, updateUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const refreshStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.user) updateUser(data.user);
    } catch {}
    finally { setRefreshing(false); }
  };

  if (user?.kycStatus === 'verified') return children;

  const config = {
    unverified: {
      icon: ShieldCheck,
      color: '#22c55e',
      title: 'Identity Verification Required',
      body: 'You must complete KYC verification before making any transactions on SwiftBit.',
      cta: { label: 'Verify My Identity', href: '/wallet/kyc', primary: true },
    },
    pending: {
      icon: Clock,
      color: '#f59e0b',
      title: 'Verification Under Review',
      body: 'Your KYC application is being reviewed by our compliance team. This usually takes 1–2 business days.',
      cta: { label: 'Refresh Status', onClick: refreshStatus, primary: false },
    },
    rejected: {
      icon: XCircle,
      color: '#ef4444',
      title: 'Verification Rejected',
      body: 'Your KYC application was not approved. Please resubmit with accurate information and a valid document.',
      cta: { label: 'Resubmit KYC', href: '/wallet/kyc', primary: true },
    },
  };

  const c = config[user?.kycStatus] || config.unverified;
  const Icon = c.icon;

  return (
    <div className="max-w-lg mx-auto px-4 pt-14 pb-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-white/5 text-center">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
          <Icon className="w-10 h-10" style={{ color: c.color }} />
        </motion.div>
        <h2 className="text-xl font-black text-white mb-3">{c.title}</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">{c.body}</p>

        {c.cta.href ? (
          <Link href={c.cta.href}
            className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${c.cta.primary ? 'btn-neon text-white' : 'glass border border-white/20 text-gray-300 hover:text-white'}`}>
            {c.cta.label}
          </Link>
        ) : (
          <button onClick={c.cta.onClick} disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold glass border border-white/20 text-gray-300 hover:text-white transition-all disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {c.cta.label}
          </button>
        )}

        <p className="text-xs text-gray-700 mt-6">
          KYC verification is required by law to prevent fraud and money laundering.
        </p>
      </motion.div>
    </div>
  );
}
