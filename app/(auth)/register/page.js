'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/store/useAppStore';

const passwordChecks = [
  { label: 'At least 8 characters',  fn: v => v.length >= 8           },
  { label: 'One uppercase letter',    fn: v => /[A-Z]/.test(v)         },
  { label: 'One number',              fn: v => /\d/.test(v)            },
  { label: 'One special character',   fn: v => /[^a-zA-Z0-9]/.test(v) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      if (data.requiresVerification) {
        router.push(`/otp?email=${encodeURIComponent(data.email)}&mode=verify`);
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
    <div className="min-h-screen bg-hero flex items-center justify-center px-4 relative overflow-hidden py-12">
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
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">Join 248,000+ crypto traders on SwiftBit</p>
        </motion.div>

        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? 'bg-green-400 flex-1' : 'bg-white/10 flex-1'}`} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 border border-white/8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full name</label>
                  <input type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                    required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
                  <input type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                    required />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Create a strong password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all pr-12"
                      required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                      onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-3 space-y-1.5">
                      {passwordChecks.map(c => {
                        const ok = c.fn(form.password);
                        return (
                          <div key={c.label} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${ok ? 'text-green-400' : 'text-gray-700'}`} />
                            <span className={ok ? 'text-green-400' : 'text-gray-600'}>{c.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={form.agree}
                    onChange={e => setForm({ ...form, agree: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-green-500 mt-0.5 flex-shrink-0" required />
                  <label className="text-sm text-gray-500">
                    I agree to the{' '}
                    <a href="#" className="text-green-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </>
            )}

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
              ) : (<>{step === 1 ? 'Continue' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>

          {step === 1 && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-gray-700">or sign up with</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Google', 'Apple'].map(p => (
                  <button key={p}
                    className="glass border border-white/10 rounded-xl py-3 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all font-medium">
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">Sign in</Link>
        </motion.p>
      </div>
    </div>
  );
}
