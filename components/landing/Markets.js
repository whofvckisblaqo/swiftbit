'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cryptoAssets } from '@/lib/data';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function SparkLine({ data, positive }) {
  return (
    <ResponsiveContainer width={72} height={32}>
      <LineChart data={data.map(v => ({ v }))}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={positive ? '#22c55e' : '#ef4444'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CoinRow({ coin, index }) {
  const positive = coin.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3.5 border-b border-white/4 last:border-0 hover:bg-white/[0.025] transition-colors rounded-xl -mx-1 px-3"
    >
      {/* Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0"
          style={{ background: `${coin.color}18`, color: coin.color, border: `1px solid ${coin.color}25` }}
        >
          {coin.icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">{coin.symbol}</p>
          <p className="text-xs text-gray-600 truncate">{coin.name}</p>
        </div>
      </div>

      {/* Sparkline — hidden on mobile */}
      <div className="hidden sm:block">
        <SparkLine data={coin.sparkline} positive={positive} />
      </div>

      {/* Change */}
      <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {positive ? '+' : ''}{coin.change24h}%
      </div>

      {/* Price */}
      <div className="text-sm font-bold text-white text-right">
        ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
      </div>

      {/* Market cap — hidden on mobile */}
      <div className="hidden sm:block text-xs text-gray-600 text-right">${coin.marketCap}</div>
    </motion.div>
  );
}

export default function Markets() {
  return (
    <section id="markets" className="section bg-[#07090d]">

      <div className="absolute inset-0 -z-10">
        <div className="orb w-[500px] h-[300px] top-0 right-0 opacity-[0.04]"
          style={{ background: '#6366f1' }} />
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Live Markets</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-5">
            Trade <span className="gradient-text">200+ assets</span>
          </h2>
          <p className="text-lg text-gray-500">
            Real-time prices, advanced charts, and lightning-fast order execution.
          </p>
        </motion.div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-[var(--radius-card)] border border-white/5 overflow-hidden"
        >
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            {/* Tab row */}
            <div className="flex gap-1">
              {['All', 'DeFi', 'Layer 1', 'Stablecoins'].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    i === 0
                      ? 'bg-green-500/15 text-green-400'
                      : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Live
            </span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-700">
            <span>Asset</span>
            <span className="hidden sm:block">7D Chart</span>
            <span>24h</span>
            <span className="text-right">Price</span>
            <span className="hidden sm:block text-right">Market Cap</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04] px-1">
            {cryptoAssets.map((coin, i) => (
              <CoinRow key={coin.id} coin={coin} index={i} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-10"
        >
          <Link
            href="/register"
            className="group btn-neon inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-sm"
          >
            Trade All Assets Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
