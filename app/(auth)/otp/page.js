'use client';
import { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/store/useAppStore';

function OTPForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email  = params.get('email') || '';
  const mode   = params.get('mode') || 'reset';
  const isVerify = mode === 'verify';
  const { setAuth } = useAuth();

  const [otp,     setOtp]     = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resent,  setResent]  = useState(false);
  const refs = useRef([]);

  const handleInput = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = text.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.join('').length !== 6) return;
    setError('');
    setLoading(true);
    try {
      if (isVerify) {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otp.join('') }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Invalid code'); setLoading(false); return; }
        setAuth(data.user, data.token);
        router.push('/wallet');
      } else {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otp.join('') }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Invalid code'); setLoading(false); return; }
        router.push(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResent(true);
    if (isVerify) {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } else {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    }
    setTimeout(() => setResent(false), 4000);
  }

  const filled = otp.join('').length === 6;

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #22c55e 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl btn-neon flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-black">Swift<span className="text-green-400">Bit</span></span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 border border-white/8">
          <div className="text-center mb-8">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4 glow-green-sm">
              <Shield className="w-8 h-8 text-green-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isVerify ? 'Verify your email' : 'Enter reset code'}
            </h1>
            <p className="text-gray-500 text-sm">
              {email ? <>Code sent to <span className="text-white">{email}</span></> : 'Enter the 6-digit code from your email'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
              {otp.map((val, i) => (
                <motion.input key={i} ref={el => refs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1} value={val}
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all focus:outline-none text-white ${
                    val ? 'border-green-500/60 bg-green-500/10 text-green-400' : 'border-white/10 bg-white/5 focus:border-green-500/40'
                  }`}
                />
              ))}
            </div>

            <motion.button type="submit" disabled={!filled || loading}
              whileHover={{ scale: filled ? 1.02 : 1 }} whileTap={{ scale: filled ? 0.97 : 1 }}
              className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                : <> {isVerify ? 'Verify Email' : 'Verify Code'} <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button onClick={handleResend} disabled={resent}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors disabled:opacity-60">
                {resent ? '✓ Sent again!' : 'Resend'}
              </button>
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-6">
          {isVerify ? (
            <Link href="/register" className="text-sm text-gray-600 hover:text-gray-300 transition-colors">
              ← Back to sign up
            </Link>
          ) : (
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-300 transition-colors">
              ← Use a different email
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPForm />
    </Suspense>
  );
}
