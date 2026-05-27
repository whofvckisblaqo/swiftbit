'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronDown, Info, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import Link from 'next/link';
import { useWallet, useToast, useNotifs } from '@/store/useAppStore';
import KycGate from '@/components/ui/KycGate';

function CoinSelect({ label, coins, selected, onSelect, amount, onAmount, readonly }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs text-gray-600">
          Balance: {selected?.balance?.toFixed(4) ?? '0.0000'} {selected?.symbol}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {readonly ? (
          <div className="flex-1 text-2xl font-bold text-green-400">
            {amount ? parseFloat(amount).toFixed(6) : '0.00'}
          </div>
        ) : (
          <input type="number" value={amount} onChange={e => onAmount(e.target.value)}
            placeholder="0.00" min="0" step="any"
            className="flex-1 text-2xl font-bold bg-transparent text-white placeholder-gray-700 focus:outline-none" />
        )}
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-white/8 transition-all flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `${selected?.color}20`, color: selected?.color }}>
            {selected?.icon}
          </div>
          <span className="text-sm font-semibold text-white">{selected?.symbol}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3 max-h-48 overflow-y-auto space-y-1">
            {coins.map(c => (
              <button key={c.id} onClick={() => { onSelect(c); setOpen(false); }}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl transition-all text-left ${c.id === selected?.id ? 'bg-green-500/10' : 'hover:bg-white/5'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{c.symbol}</div>
                  <div className="text-xs text-gray-600">{c.name}</div>
                </div>
                <div className="text-xs text-gray-500">${c.price.toLocaleString()}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SwapContent() {
  const { assets, executeSwap } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifs();

  const [fromCoin, setFromCoin] = useState(assets[0]);
  const [toCoin, setToCoin] = useState(assets[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const rate = fromCoin && toCoin ? fromCoin.price / toCoin.price : 0;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(6) : '';
  const fee = fromAmount ? (parseFloat(fromAmount) * (fromCoin?.price ?? 0) * 0.001).toFixed(4) : '0.00';

  const ethBalance     = assets.find(a => a.symbol === 'ETH')?.balance || 0;
  const usdtErc20Bal   = assets.find(a => a.symbol === 'USDT_ERC20')?.balance || 0;
  const needsEthGas    = fromCoin?.symbol === 'USDT_ERC20' && usdtErc20Bal > 100000 && ethBalance < 0.5;
  const insufficientBalance = fromAmount && parseFloat(fromAmount) > (fromCoin?.balance || 0);

  const flip = () => {
    const tmp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(tmp);
    setFromAmount(toAmount || '');
  };

  const handleSwap = async () => {
    if (step === 1 && fromAmount) { setStep(2); return; }
    if (step === 2) {
      setLoading(true);
      try {
        const tx = await executeSwap({ fromCoin, toCoin, fromAmount: parseFloat(fromAmount) });
        if (tx) {
          toast({ message: `Swapped ${fromAmount} ${fromCoin.symbol} → ${toAmount} ${toCoin.symbol}`, type: 'success' });
          addNotification({
            title: 'Swap Complete',
            body: `${fromAmount} ${fromCoin.symbol} → ${toAmount} ${toCoin.symbol} executed`,
            type: 'transaction',
          });
          setStep(3);
        }
      } catch {
        toast({ message: 'Swap failed. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="pt-14 pb-4">
          <h1 className="text-2xl font-black text-white mb-1">Swap</h1>
          <p className="text-sm text-gray-500">Exchange crypto instantly</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Swap Complete!</h2>
          <div className="glass rounded-2xl p-5 mb-6 text-left space-y-3 max-w-xs mx-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sent</span>
              <span className="text-red-400 font-medium">-{fromAmount} {fromCoin?.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Received</span>
              <span className="text-green-400 font-medium">+{toAmount} {toCoin?.symbol}</span>
            </div>
          </div>
          <button onClick={() => { setStep(1); setFromAmount(''); }}
            className="btn-neon text-white font-semibold px-8 py-3 rounded-xl text-sm">
            New Swap
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-14 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">Swap</h1>
        <p className="text-sm text-gray-500">Exchange crypto instantly</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-5">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-green-400' : 'bg-white/10'}`} />
        ))}
      </div>

      <div className="space-y-2 mb-4 relative">
        <CoinSelect label="From" coins={assets.filter(a => a.id !== toCoin?.id)}
          selected={fromCoin} onSelect={setFromCoin}
          amount={fromAmount} onAmount={setFromAmount} />

        <div className="flex justify-center relative z-10 -my-1">
          <motion.button onClick={flip} whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-green-400 hover:border-green-500/30 transition-all shadow-lg">
            <ArrowUpDown className="w-5 h-5" />
          </motion.button>
        </div>

        <CoinSelect label="To" coins={assets.filter(a => a.id !== fromCoin?.id)}
          selected={toCoin} onSelect={setToCoin}
          amount={toAmount} onAmount={() => {}} readonly />
      </div>

      {/* Rate info */}
      <AnimatePresence>
        {fromAmount && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-xl p-4 mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="text-white">1 {fromCoin?.symbol} = {rate.toFixed(6)} {toCoin?.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-500">
                <Info className="w-3 h-3" /> Slippage
              </div>
              <span className="text-white">0.5%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Network Fee</span>
              <span className="text-white">${fee}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Min. Received</span>
              <span className="text-green-400 font-medium">
                {toAmount ? (parseFloat(toAmount) * 0.995).toFixed(6) : '0'} {toCoin?.symbol}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm details panel (step 2) */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-xl p-4 mb-4 border border-green-500/20 space-y-2">
            <p className="text-xs font-semibold text-green-400 mb-2">Confirm Swap</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">You send</span>
              <span className="text-white font-medium">{fromAmount} {fromCoin?.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">You receive</span>
              <span className="text-green-400 font-medium">{toAmount} {toCoin?.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fee</span>
              <span className="text-gray-400">${fee}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {insufficientBalance && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 mb-4 border border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1">Insufficient Balance</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                You only have <span className="text-white font-semibold">{(fromCoin?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 6 })} {fromCoin?.symbol}</span> available to swap.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {needsEthGas && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 mb-4 border border-orange-500/30 bg-orange-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-400 mb-1">Insufficient ETH for gas</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Regarding the amount of USDT ERC20 you have (<span className="text-white font-semibold">{usdtErc20Bal.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT</span>), you need to have at least <span className="text-white font-semibold">0.5 ETH</span> in your wallet to cover network gas fees. Your current ETH balance: <span className="text-white font-semibold">{ethBalance.toFixed(4)} ETH</span>.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {toCoin?.symbol === 'ETH' && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 mb-4 border border-orange-500/30 bg-orange-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-400 mb-1">ETH Swaps Unavailable</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Converting to Ethereum (ETH) via swap is not supported. To receive ETH, please make a direct deposit to your ETH wallet address.
              </p>
              <Link href="/wallet/receive"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-orange-500/20 border border-orange-500/30 px-3 py-2 rounded-xl hover:bg-orange-500/30 transition-all">
                <Download className="w-3.5 h-3.5" /> Go to Receive
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={handleSwap}
        disabled={!fromAmount || parseFloat(fromAmount) <= 0 || loading || toCoin?.symbol === 'ETH' || needsEthGas || insufficientBalance}
        className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
        {loading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
        ) : (
          step === 1 ? `Swap ${fromCoin?.symbol} → ${toCoin?.symbol}` : 'Confirm & Swap'
        )}
      </motion.button>
    </div>
  );
}

export default function SwapPage() {
  return (
    <KycGate>
      <SwapContent />
    </KycGate>
  );
}
