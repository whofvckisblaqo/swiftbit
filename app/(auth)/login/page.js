'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Fingerprint } from 'lucide-react';
import { useAuth } from '@/store/useAppStore';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      setAuth(data.user, data.token);
      router.push('/wallet');
    } catch {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your SwiftBit account</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 border border-white/8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all"
                required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-green-400 hover:text-green-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all pr-12"
                  required />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/20 bg-white/5 accent-green-500" />
              <label htmlFor="remember" className="text-sm text-gray-500">Remember me for 30 days</label>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">
                {error}
              </motion.p>
            )}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <Fingerprint className="w-4 h-4 text-green-400" />
              Sign in with biometrics
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-gray-700">or continue with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map(provider => (
              <button key={provider}
                className="glass border border-white/10 rounded-xl py-3 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all font-medium">
                {provider}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
            Create one free
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
