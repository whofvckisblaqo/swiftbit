'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Shield, ArrowRight } from 'lucide-react';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = useRef([]);

  const handleInput = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join('').length !== 6) return;
    setLoading(true);
    setTimeout(() => router.push('/wallet'), 1500);
  };

  const resend = () => { setResent(true); setTimeout(() => setResent(false), 3000); };

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
            <h1 className="text-2xl font-bold text-white mb-2">Verify your identity</h1>
            <p className="text-gray-500 text-sm">Enter the 6-digit code sent to your email</p>
          </div>

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
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : <> Verify & Continue <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button onClick={resend} className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                {resent ? '✓ Sent!' : 'Resend'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
