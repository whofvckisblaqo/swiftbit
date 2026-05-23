'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Download, Check, ChevronDown } from 'lucide-react';
import { cryptoAssets, walletAddress } from '@/lib/data';

export default function ReceivePage() {
  const [copied, setCopied] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(cryptoAssets[0]);
  const [showCoins, setShowCoins] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple QR-like visual using CSS grid pattern
  const qrSize = 12;
  const qrPattern = Array.from({ length: qrSize * qrSize }, (_, i) => {
    const row = Math.floor(i / qrSize);
    const col = i % qrSize;
    // Create fixed corners
    if ((row < 3 && col < 3) || (row < 3 && col >= qrSize - 3) || (row >= qrSize - 3 && col < 3)) return true;
    // Random-ish middle pattern seeded by address
    return (row * 7 + col * 13 + row * col) % 3 === 0;
  });

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-14 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">Receive</h1>
        <p className="text-sm text-gray-500">Share your address to receive crypto</p>
      </div>

      {/* Coin selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 mb-5">
        <label className="text-xs text-gray-500 font-medium block mb-3">Select asset to receive</label>
        <button onClick={() => setShowCoins(!showCoins)}
          className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/8 transition-all">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${selectedCoin.color}20`, color: selectedCoin.color, border: `1px solid ${selectedCoin.color}30` }}>
            {selectedCoin.icon}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-white">{selectedCoin.symbol}</div>
            <div className="text-xs text-gray-500">{selectedCoin.name} Network</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCoins ? 'rotate-180' : ''}`} />
        </button>

        {showCoins && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 max-h-48 overflow-y-auto space-y-1">
            {cryptoAssets.map(c => (
              <button key={c.id} onClick={() => { setSelectedCoin(c); setShowCoins(false); }}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${c.id === selectedCoin.id ? 'bg-green-500/10' : 'hover:bg-white/5'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                <span className="text-sm font-medium text-white">{c.symbol}</span>
                <span className="text-xs text-gray-500">{c.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* QR Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-8 mb-5 text-center relative overflow-hidden border-glow">
        <div className="absolute inset-0 opacity-3"
          style={{ background: `radial-gradient(ellipse at center, ${selectedCoin.color}20 0%, transparent 70%)` }} />

        {/* QR code visual */}
        <div className="relative inline-block p-4 bg-white rounded-2xl mb-5">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${qrSize}, 1fr)`, width: 168 }}>
            {qrPattern.map((filled, i) => (
              <div key={i} style={{ width: 12, height: 12, background: filled ? '#000' : '#fff', borderRadius: filled ? 2 : 0 }} />
            ))}
          </div>
          {/* Coin icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg"
              style={{ border: `2px solid ${selectedCoin.color}` }}>
              <span className="text-lg font-black" style={{ color: selectedCoin.color }}>{selectedCoin.icon}</span>
            </div>
          </div>
        </div>

        <div className="mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{selectedCoin.symbol} Address</span>
        </div>
        <div className="text-xs text-gray-400 font-mono break-all leading-relaxed px-2 mb-2">
          {walletAddress}
        </div>

        <div className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full">
          ⚠ Only send {selectedCoin.symbol} to this address
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3">
        <button onClick={copy}
          className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${copied ? 'border-green-500/50 bg-green-500/10' : 'glass border-white/10 hover:border-white/20'}`}>
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
          <span className={`text-xs font-medium ${copied ? 'text-green-400' : 'text-gray-500'}`}>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
        <button className="flex flex-col items-center gap-2 py-4 rounded-2xl glass border border-white/10 hover:border-white/20 transition-all">
          <Share2 className="w-5 h-5 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Share</span>
        </button>
        <button className="flex flex-col items-center gap-2 py-4 rounded-2xl glass border border-white/10 hover:border-white/20 transition-all">
          <Download className="w-5 h-5 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Save QR</span>
        </button>
      </motion.div>

      {/* Warning */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-5 glass rounded-xl p-4 border border-white/5">
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          Sending any other cryptocurrency to this address may result in permanent loss of funds. Always verify the network before sending.
        </p>
      </motion.div>
    </div>
  );
}
