'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CreditCard, Building2, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useWallet, useToast, useNotifs } from '@/store/useAppStore';

const payMethods = [
  { id: 'card',  label: 'Credit/Debit Card', icon: CreditCard,  fee: 1.5  },
  { id: 'bank',  label: 'Bank Transfer',      icon: Building2,   fee: 0    },
  { id: 'apple', label: 'Apple Pay',           icon: Smartphone,  fee: 1.2  },
];

export default function BuyPage() {
  const { assets, executeBuy } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifs();

  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(assets[0]);
  const [payMethod, setPayMethod] = useState('card');
  const [showCoins, setShowCoins] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const feeRate = payMethods.find(m => m.id === payMethod)?.fee ?? 1.5;
  const fee = feeRate / 100 * (parseFloat(amount) || 0);
  const total = (parseFloat(amount) || 0) + fee;
  const cryptoReceived = selectedCoin ? (parseFloat(amount) || 0) / selectedCoin.price : 0;

  const handleBuy = () => {
    if (step === 1 && amount) { setStep(2); return; }
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        executeBuy({ coin: selectedCoin, usdAmount: parseFloat(amount), method: payMethod });
        toast({ message: `Bought ${cryptoReceived.toFixed(6)} ${selectedCoin.symbol}`, type: 'success' });
        addNotification({
          title: `${selectedCoin.symbol} Purchased`,
          body: `You bought ${cryptoReceived.toFixed(4)} ${selectedCoin.symbol} for $${parseFloat(amount).toFixed(2)}`,
          type: 'transaction',
        });
        setLoading(false);
        setDone(true);
        setStep(3);
      }, 1400);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="pt-14 pb-4">
          <h1 className="text-2xl font-black text-white mb-1">Buy Crypto</h1>
          <p className="text-sm text-gray-500">Purchase with your preferred method</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Purchase Complete!</h2>
          <p className="text-gray-500 mb-2">You bought</p>
          <p className="text-3xl font-black text-green-400 mb-1">{cryptoReceived.toFixed(6)} {selectedCoin?.symbol}</p>
          <p className="text-gray-600 text-sm mb-8">≈ ${parseFloat(amount || 0).toFixed(2)} USD</p>
          <button onClick={() => { setStep(1); setAmount(''); setDone(false); }}
            className="btn-neon text-white font-semibold px-8 py-3 rounded-xl text-sm">
            Buy More
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-14 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">Buy Crypto</h1>
        <p className="text-sm text-gray-500">Purchase with your preferred method</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-green-400' : 'bg-white/10'}`} />
        ))}
      </div>

      {/* Amount input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 mb-4">
        <label className="text-xs text-gray-500 font-medium block mb-3">You pay (USD)</label>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-gray-600">$</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 text-4xl font-black bg-transparent text-white placeholder-gray-700 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {[50, 100, 500, 1000].map(v => (
            <button key={v} onClick={() => setAmount(String(v))}
              className={`flex-1 text-xs py-2 rounded-lg border transition-all font-medium ${amount == v ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'glass border-white/10 text-gray-400 hover:text-green-400 hover:border-green-500/30'}`}>
              ${v}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Coin selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-4 mb-4">
        <label className="text-xs text-gray-500 font-medium block mb-3">You receive</label>
        <button onClick={() => setShowCoins(!showCoins)}
          className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/8 transition-all">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${selectedCoin?.color}20`, color: selectedCoin?.color }}>
            {selectedCoin?.icon}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-white">{selectedCoin?.symbol}</div>
            <div className="text-xs text-gray-500">{selectedCoin?.name}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCoins ? 'rotate-180' : ''}`} />
        </button>

        {amount && selectedCoin && (
          <div className="mt-3 text-center">
            <span className="text-2xl font-black text-green-400">{cryptoReceived.toFixed(6)}</span>
            <span className="text-sm text-gray-500 ml-2">{selectedCoin.symbol}</span>
          </div>
        )}

        <AnimatePresence>
          {showCoins && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3 max-h-48 overflow-y-auto">
              {assets.map(c => (
                <button key={c.id} onClick={() => { setSelectedCoin(c); setShowCoins(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${c.id === selectedCoin?.id ? 'bg-green-500/10' : 'hover:bg-white/5'}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                  <span className="text-sm text-white font-medium">{c.symbol}</span>
                  <span className="text-xs text-gray-500 flex-1 text-left">{c.name}</span>
                  <span className="text-xs text-gray-500">${c.price.toLocaleString()}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Payment method (step 2) */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-2xl p-4 mb-4">
            <label className="text-xs text-gray-500 font-medium block mb-3">Payment Method</label>
            <div className="space-y-2">
              {payMethods.map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${payMethod === m.id ? 'border-green-500/40 bg-green-500/8' : 'border-white/5 hover:border-white/10'}`}>
                  <m.icon className={`w-5 h-5 ${payMethod === m.id ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`flex-1 text-left text-sm font-medium ${payMethod === m.id ? 'text-white' : 'text-gray-400'}`}>{m.label}</span>
                  <span className="text-xs text-gray-500">Fee: {m.fee}%</span>
                  {payMethod === m.id && <div className="w-2 h-2 rounded-full bg-green-400" />}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
              {[
                { label: 'Amount',      val: `$${parseFloat(amount || 0).toFixed(2)}` },
                { label: 'Platform Fee', val: `$${fee.toFixed(2)} (${feeRate}%)` },
                { label: 'Total',       val: `$${total.toFixed(2)}`, bold: true },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className={r.bold ? 'text-white font-bold' : 'text-gray-300'}>{r.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={handleBuy}
        disabled={!amount || parseFloat(amount) <= 0 || loading}
        className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
        {loading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
        ) : (
          <>{step === 1 ? 'Continue' : `Buy ${selectedCoin?.symbol}`} <ArrowRight className="w-4 h-4" /></>
        )}
      </motion.button>
    </div>
  );
}
