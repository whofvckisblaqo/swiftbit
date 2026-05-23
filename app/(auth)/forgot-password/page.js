'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowRight, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
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
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 border border-white/8">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
                <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                    required
                  />
                </div>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : <> Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 glow-green">
                <Mail className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Check your inbox</h2>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
              <Link href="/otp" className="btn-neon inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl text-sm">
                Enter OTP Code
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-300 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
