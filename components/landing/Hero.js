'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap, TrendingDown } from 'lucide-react';
import { cryptoAssets } from '@/lib/data';

/* ── Fade-up helper ────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

/* ── Floating coin bubble ──────────────────────────── */
function Coin({ symbol, color, className }) {
  return (
    <div
      className={`w-12 h-12 rounded-full glass-md flex items-center justify-center text-base font-black select-none ${className}`}
      style={{ color, boxShadow: `0 0 24px ${color}30, 0 0 4px ${color}40`, borderColor: `${color}30` }}
    >
      {symbol}
    </div>
  );
}

/* ── Phone mockup ──────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="relative w-[220px] sm:w-[260px] mx-auto">
      {/* Outer shell */}
      <div className="rounded-[2.5rem] p-[3px] bg-gradient-to-b from-white/20 to-white/5 shadow-2xl shadow-black/60">
        <div className="rounded-[2.3rem] bg-[#0d1117] overflow-hidden border border-white/5">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="text-[9px] text-gray-500 font-medium">9:41</span>
            <div className="w-16 h-5 bg-black rounded-full" />
            <div className="flex gap-1 items-center">
              <div className="w-3 h-2 border border-gray-600 rounded-sm">
                <div className="w-2 h-full bg-green-400 rounded-sm" />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="px-4 pb-5">
            {/* Balance */}
            <div className="text-center py-4">
              <p className="text-[10px] text-gray-500 mb-1">Total Balance</p>
              <p className="text-2xl font-black text-white">$67,894.23</p>
              <p className="text-[11px] text-green-400 font-medium mt-0.5">▲ +$2,840 (+4.36%)</p>
            </div>

            {/* Mini chart bar */}
            <div className="flex items-end gap-0.5 h-10 mb-4 px-1">
              {[40,55,45,70,60,80,65,90,75,95,85,100].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm opacity-80"
                  style={{ height: `${h}%`, background: i === 11 ? '#22c55e' : `rgba(34,197,94,${0.2 + i * 0.05})` }} />
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {[
                { label: 'Buy',  color: '#22c55e' },
                { label: 'Sell', color: '#ef4444' },
                { label: 'Swap', color: '#6366f1' },
                { label: 'More', color: '#f59e0b' },
              ].map(a => (
                <div key={a.label} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }} />
                  </div>
                  <span className="text-[8px] text-gray-500">{a.label}</span>
                </div>
              ))}
            </div>

            {/* Asset rows */}
            {cryptoAssets.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-center gap-2 py-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                  style={{ background: `${c.color}20`, color: c.color }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-white">{c.symbol}</div>
                  <div className="text-[8px] text-gray-600">${c.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold" style={{ color: c.change24h >= 0 ? '#22c55e' : '#ef4444' }}>
                    {c.change24h >= 0 ? '+' : ''}{c.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-around py-2.5 px-4 border-t border-white/5">
            {['⌂','◎','⇄','☰'].map((icon, i) => (
              <div key={i} className={`text-sm ${i === 0 ? 'text-green-400' : 'text-gray-700'}`}>{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow under phone */}
      <div className="absolute -bottom-6 inset-x-8 h-12 rounded-full blur-xl opacity-30"
        style={{ background: 'radial-gradient(ellipse, #22c55e, transparent)' }} />
    </div>
  );
}

/* ── Stat pill ─────────────────────────────────────── */
function StatPill({ icon: Icon, value, label, delay }) {
  return (
    <motion.div {...fadeUp(delay)}
      className="glass-md rounded-2xl px-5 py-4 flex items-center gap-3 border-glow-green"
    >
      <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-green-400" />
      </div>
      <div>
        <p className="text-base font-black text-white leading-none mb-0.5">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#07090d]">

      {/* ── Background layers (strictly behind content) ── */}
      <div className="absolute inset-0 -z-10">
        {/* dot grid */}
        <div className="absolute inset-0 grid-dots opacity-[0.35]" />
        {/* green top glow */}
        <div className="orb w-[700px] h-[500px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.12]"
          style={{ background: '#22c55e' }} />
        {/* indigo right glow */}
        <div className="orb w-[400px] h-[400px] top-1/2 right-0 -translate-y-1/2 opacity-[0.06]"
          style={{ background: '#6366f1' }} />
        {/* dark fade bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07090d] to-transparent" />
      </div>

      {/* ── Floating coins ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div {...fadeUp(0.4)} className="absolute top-[18%] left-[5%] float-a">
          <Coin symbol="₿" color="#f7931a" className="" />
        </motion.div>
        <motion.div {...fadeUp(0.55)} className="absolute top-[14%] right-[8%] float-b">
          <Coin symbol="Ξ" color="#627eea" className="" />
        </motion.div>
        <motion.div {...fadeUp(0.7)} className="absolute bottom-[28%] left-[7%] float-c">
          <Coin symbol="◎" color="#9945ff" className="" />
        </motion.div>
        <motion.div {...fadeUp(0.65)} className="absolute top-[42%] right-[5%] float-a">
          <Coin symbol="B" color="#f3ba2f" className="" />
        </motion.div>
        <motion.div {...fadeUp(0.8)} className="absolute bottom-[20%] right-[12%] float-b">
          <Coin symbol="Ð" color="#c2a633" className="" />
        </motion.div>
      </div>

      {/* ── Main content ── */}
      <div className="container relative z-10 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

          {/* Left column — text */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

            {/* Badge */}
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 glass border border-green-500/25 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 pulse-ring shrink-0" />
              <span className="text-xs text-green-400 font-semibold">Live · 200+ assets · Zero fees for 30 days</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.2)}
              className="text-[2.6rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-black leading-[1.08] tracking-tight mb-6"
            >
              Secure. Fast.
              <br />
              <span className="shimmer-text">Crypto Banking</span>
              <br />
              Reimagined.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p {...fadeUp(0.3)}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Buy, store, swap, and manage 200+ cryptocurrencies with
              bank-grade security and a trading experience built for speed.
            </motion.p>

            {/* CTA row */}
            <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
              <Link
                href="/register"
                className="group btn-neon inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-base"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-base font-medium"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.5)} className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0">
              <StatPill icon={Shield}     value="248K+"  label="Active Users"     delay={0.55} />
              <StatPill icon={TrendingUp} value="$2.84B" label="Assets Secured"   delay={0.62} />
              <StatPill icon={Zap}        value="<0.1s"  label="Swap Execution"   delay={0.69} />
            </motion.div>
          </div>

          {/* Right column — phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1,   y: 0   }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="shrink-0 relative"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 scale-110 opacity-20 blur-3xl rounded-full"
              style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 70%)' }} />
            <PhoneMockup />
          </motion.div>
        </div>

        {/* ── Live ticker ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 relative overflow-hidden rounded-2xl glass border border-white/5 py-3"
        >
          {/* fade edges */}
          <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#07090d] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#07090d] to-transparent z-10 pointer-events-none" />

          <div className="ticker-tape flex gap-10 whitespace-nowrap w-max">
            {[...cryptoAssets, ...cryptoAssets].map((coin, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-xs font-bold" style={{ color: coin.color }}>{coin.symbol}</span>
                <span className="text-sm font-semibold text-white">
                  ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                </span>
                <span className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
                </span>
                <span className="text-gray-800 select-none">·</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
