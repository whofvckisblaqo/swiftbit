'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cryptoAssets } from '@/lib/data';
import { useAuth } from '@/store/useAppStore';

// Base coins from cryptoAssets, then inject USDT_TRC20 / USDT_ERC20 in place of USDT
const usdtBase = { id: 'tether', symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26a17b' };
const RECEIVE_COINS = [
  ...cryptoAssets.filter(c => !['tether'].includes(c.id) && ['bitcoin','ethereum','bnb','solana','ripple','dogecoin','cardano'].includes(c.id)),
  { ...usdtBase, id: 'usdt-trc20', symbol: 'USDT_TRC20', name: 'USDT · TRC20 (Tron)' },
  { ...usdtBase, id: 'usdt-erc20', symbol: 'USDT_ERC20', name: 'USDT · ERC20 (Ethereum)' },
];

function ReceiveContent() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(RECEIVE_COINS[0]);
  const [showCoins, setShowCoins] = useState(false);

  const walletAddresses = user?.walletAddresses || {};
  const address = walletAddresses[selectedCoin.symbol] || '';

  const copy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <div className="text-sm font-semibold text-white">{selectedCoin.name}</div>
            <div className="text-xs text-gray-500">{selectedCoin.symbol}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCoins ? 'rotate-180' : ''}`} />
        </button>

        {showCoins && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 max-h-56 overflow-y-auto space-y-1">
            {RECEIVE_COINS.map(c => (
              <button key={c.id} onClick={() => { setSelectedCoin(c); setShowCoins(false); }}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${c.id === selectedCoin.id ? 'bg-green-500/10' : 'hover:bg-white/5'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{c.name}</div>
                  <div className="text-xs text-gray-600">{c.symbol}</div>
                </div>
                {walletAddresses[c.symbol] && (
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full flex-shrink-0">Ready</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* QR / Address card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-8 mb-5 text-center relative overflow-hidden border-glow">
        <div className="absolute inset-0 opacity-3"
          style={{ background: `radial-gradient(ellipse at center, ${selectedCoin.color}20 0%, transparent 70%)` }} />

        {address ? (
          <>
            <div className="relative inline-block p-4 bg-white rounded-2xl mb-5">
              <QRCodeSVG value={address} size={168} bgColor="#ffffff" fgColor="#000000" level="M" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg"
                  style={{ border: `2px solid ${selectedCoin.color}` }}>
                  <span className="text-lg font-black" style={{ color: selectedCoin.color }}>{selectedCoin.icon}</span>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{selectedCoin.name} Address</span>
            </div>
            <div className="text-xs text-gray-400 font-mono break-all leading-relaxed px-2 mb-4">
              {address}
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full">
              ⚠ Only send {selectedCoin.symbol.replace('_', ' ')} to this address
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-500/10 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-2">Address Not Assigned</p>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
              Your {selectedCoin.name} deposit address hasn't been assigned yet. Please contact support or check back later.
            </p>
          </div>
        )}
      </motion.div>

      {/* Action buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3">
        <button onClick={copy} disabled={!address}
          className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${copied ? 'border-green-500/50 bg-green-500/10' : 'glass border-white/10 hover:border-white/20'} disabled:opacity-40`}>
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
          <span className={`text-xs font-medium ${copied ? 'text-green-400' : 'text-gray-500'}`}>{copied ? 'Copied!' : 'Copy Address'}</span>
        </button>
        <button disabled={!address} className="flex flex-col items-center gap-2 py-4 rounded-2xl glass border border-white/10 hover:border-white/20 transition-all disabled:opacity-40">
          <Share2 className="w-5 h-5 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Share</span>
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-5 glass rounded-xl p-4 border border-white/5">
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          Sending any other cryptocurrency to this address may result in permanent loss of funds. Always verify the network before sending.
        </p>
      </motion.div>
    </div>
  );
}

export default function ReceivePage() {
  return <ReceiveContent />;
}
