'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { cryptoAssets, topGainers, topLosers } from '@/lib/data';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const tabs = ['All', 'Favorites', 'Gainers', 'Losers'];

function SparkLine({ data, positive }) {
  const d = data.map(v => ({ v }));
  return (
    <ResponsiveContainer width={60} height={28}>
      <LineChart data={d}>
        <Line type="monotone" dataKey="v" stroke={positive ? '#22c55e' : '#ef4444'} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CoinRow({ coin, i }) {
  const positive = coin.change24h >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ background: `${coin.color}20`, color: coin.color, border: `1px solid ${coin.color}30` }}>
        {coin.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-white">{coin.symbol}</span>
            <span className="text-xs text-gray-600 ml-2">{coin.name}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">
              ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
            </div>
            <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${positive ? 'text-green-400' : 'text-red-400'}`}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {positive ? '+' : ''}{coin.change24h}%
            </div>
          </div>
        </div>
      </div>
      <SparkLine data={coin.sparkline} positive={positive} />
    </motion.div>
  );
}

export default function MarketPage() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [favs, setFavs] = useState(['bitcoin', 'ethereum']);

  const tabData = { All: cryptoAssets, Favorites: cryptoAssets.filter(c => favs.includes(c.id)), Gainers: topGainers, Losers: topLosers };
  const displayed = (tabData[tab] || cryptoAssets).filter(c =>
    c.symbol.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="pt-14 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">Markets</h1>
        <p className="text-sm text-gray-500">Live crypto prices</p>
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search coins..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex gap-1 glass rounded-xl p-1 mb-4">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${tab === t ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </motion.div>

      {/* Market overview pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {[
          { label: 'Mkt Cap', val: '$2.7T', up: true },
          { label: '24h Vol', val: '$142B', up: false },
          { label: 'BTC Dom', val: '49.2%', up: true },
          { label: 'Fear', val: '68 Greed', up: true },
        ].map(p => (
          <div key={p.label} className="flex-shrink-0 glass rounded-xl px-3 py-2 text-center min-w-[90px]">
            <div className="text-xs text-gray-500 mb-0.5">{p.label}</div>
            <div className={`text-xs font-bold ${p.up ? 'text-green-400' : 'text-red-400'}`}>{p.val}</div>
          </div>
        ))}
      </div>

      {/* Coin list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl overflow-hidden">
        {displayed.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-sm text-gray-500">No coins found for "{search}"</div>
          </div>
        ) : (
          <div className="py-2">
            {displayed.map((coin, i) => <CoinRow key={coin.id} coin={coin} i={i} />)}
          </div>
        )}
      </motion.div>
    </div>
  );
}
