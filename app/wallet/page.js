'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bell, Eye, EyeOff, Send, Download, ArrowUpDown, CreditCard, TrendingUp, TrendingDown, Copy, Check, ChevronDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { portfolioData } from '@/lib/data';
import { useWallet, useAuth, useToast, useNotifs } from '@/store/useAppStore';
import Modal from '@/components/ui/Modal';

/* ── Tooltip ── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
        <div className="text-white font-bold">${payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

/* ── Quick action button ── */
function QuickAction({ icon: Icon, label, onClick, color }) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={onClick} className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </motion.button>
  );
}

/* ── Coin row ── */
function CoinItem({ coin, index, onSelect }) {
  const positive = coin.change24h >= 0;
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      onClick={() => onSelect?.(coin)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ background: `${coin.color}20`, color: coin.color, border: `1px solid ${coin.color}30` }}>
        {coin.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{coin.symbol}</span>
          <span className="text-sm font-semibold text-white">${coin.usdValue.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-gray-500">{coin.balance.toFixed(6)} {coin.symbol}</span>
          <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {positive ? '+' : ''}{coin.change24h}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Send modal ── */
function SendModal({ open, onClose }) {
  const { assets, executeSend } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifs();
  const [coin, setCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selected = coin || assets[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!amount || !address) return;
    setLoading(true);
    setTimeout(() => {
      executeSend({ coin: selected, amount: parseFloat(amount), address });
      toast({ message: `Sent ${amount} ${selected.symbol} successfully`, type: 'success' });
      addNotification({ title: `${selected.symbol} Sent`, body: `${amount} ${selected.symbol} sent to ${address.slice(0, 8)}...`, type: 'transaction' });
      setLoading(false);
      setDone(true);
      setTimeout(() => { setDone(false); setAmount(''); setAddress(''); onClose(); }, 1800);
    }, 1400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Send Crypto">
      {done ? (
        <div className="text-center py-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
            <Check className="w-8 h-8 text-green-400" />
          </motion.div>
          <p className="text-white font-bold">Sent successfully!</p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Asset</label>
            <div className="relative">
              <select value={selected?.id} onChange={e => setCoin(assets.find(a => a.id === e.target.value))}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 bg-transparent appearance-none">
                {assets.map(a => <option key={a.id} value={a.id} style={{ background: '#0d1117' }}>{a.symbol} — {a.balance.toFixed(4)} available</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Recipient address</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
              required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500">Amount ({selected?.symbol})</label>
              <button type="button" onClick={() => setAmount(selected?.balance.toFixed(6))}
                className="text-xs text-green-400 hover:text-green-300 transition-colors">MAX</button>
            </div>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="any" min="0"
              placeholder="0.00"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
              required />
            {amount && selected && (
              <p className="text-xs text-gray-600 mt-1">≈ ${(parseFloat(amount || 0) * selected.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            )}
          </div>
          <div className="pt-1">
            <p className="text-xs text-gray-600 mb-3">Network fee: ~$0.25 · Est. arrival: &lt;1 min</p>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full btn-neon text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><Send className="w-4 h-4" /> Send</>}
            </motion.button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/* ── Receive modal ── */
function ReceiveModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);
  const address = '0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B';

  const copy = () => {
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Receive Crypto">
      <div className="text-center space-y-4">
        <div className="w-44 h-44 mx-auto bg-white rounded-2xl flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-36 h-36">
            {[...Array(10)].map((_, r) => [...Array(10)].map((_, c) => (
              Math.random() > 0.5 ? <rect key={`${r}-${c}`} x={c * 10} y={r * 10} width={9} height={9} fill="#07090d" /> : null
            )))}
            <rect x={0} y={0} width={30} height={30} fill="#07090d" />
            <rect x={5} y={5} width={20} height={20} fill="white" />
            <rect x={10} y={10} width={10} height={10} fill="#07090d" />
            <rect x={70} y={0} width={30} height={30} fill="#07090d" />
            <rect x={75} y={5} width={20} height={20} fill="white" />
            <rect x={80} y={10} width={10} height={10} fill="#07090d" />
            <rect x={0} y={70} width={30} height={30} fill="#07090d" />
            <rect x={5} y={75} width={20} height={20} fill="white" />
            <rect x={10} y={80} width={10} height={10} fill="#07090d" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Your wallet address</p>
          <div className="glass border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono flex-1 truncate">{address}</span>
            <button onClick={copy} className="text-gray-500 hover:text-green-400 transition-colors shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600">Only send ETH or ERC-20 tokens to this address</p>
      </div>
    </Modal>
  );
}

/* ── Buy modal ── */
function BuyModal({ open, onClose }) {
  const { assets, executeBuy } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifs();
  const [coin, setCoin] = useState(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selected = coin || assets[0];
  const cryptoAmount = selected ? (parseFloat(usdAmount || 0) / selected.price) : 0;
  const fee = parseFloat(usdAmount || 0) * 0.015;

  const handleBuy = (e) => {
    e.preventDefault();
    if (!usdAmount) return;
    setLoading(true);
    setTimeout(() => {
      executeBuy({ coin: selected, usdAmount: parseFloat(usdAmount), method });
      toast({ message: `Bought ${cryptoAmount.toFixed(6)} ${selected.symbol}`, type: 'success' });
      addNotification({ title: `${selected.symbol} Purchased`, body: `You bought ${cryptoAmount.toFixed(4)} ${selected.symbol} for $${usdAmount}`, type: 'transaction' });
      setLoading(false);
      setDone(true);
      setTimeout(() => { setDone(false); setUsdAmount(''); onClose(); }, 1800);
    }, 1400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Buy Crypto">
      {done ? (
        <div className="text-center py-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
            <Check className="w-8 h-8 text-green-400" />
          </motion.div>
          <p className="text-white font-bold">Purchase complete!</p>
        </div>
      ) : (
        <form onSubmit={handleBuy} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Asset to buy</label>
            <div className="relative">
              <select value={selected?.id} onChange={e => setCoin(assets.find(a => a.id === e.target.value))}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 bg-transparent appearance-none">
                {assets.map(a => <option key={a.id} value={a.id} style={{ background: '#0d1117' }}>{a.symbol} — ${a.price.toLocaleString()}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input value={usdAmount} onChange={e => setUsdAmount(e.target.value)} type="number" step="any" min="0"
                placeholder="0.00"
                className="w-full glass border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
                required />
            </div>
            {usdAmount && selected && (
              <p className="text-xs text-gray-500 mt-1.5">
                You receive: <span className="text-white">{cryptoAmount.toFixed(6)} {selected.symbol}</span>
                <span className="text-gray-600 ml-2">· Fee: ${fee.toFixed(2)}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {[50, 100, 250, 500].map(v => (
              <button key={v} type="button" onClick={() => setUsdAmount(v.toString())}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${usdAmount == v ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass border border-white/10 text-gray-500 hover:text-gray-300'}`}>
                ${v}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Payment method</label>
            <div className="flex gap-2">
              {[{ id: 'card', label: 'Card' }, { id: 'bank', label: 'Bank' }, { id: 'usdt', label: 'USDT' }].map(m => (
                <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${method === m.id ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass border border-white/10 text-gray-500 hover:text-gray-300'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full btn-neon text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><ShoppingCart className="w-4 h-4" /> Buy Now</>}
          </motion.button>
        </form>
      )}
    </Modal>
  );
}

/* ── Swap modal ── */
function SwapModal({ open, onClose }) {
  const { assets, executeSwap } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifs();
  const [fromId, setFromId] = useState(assets[0]?.id);
  const [toId, setToId] = useState(assets[1]?.id);
  const [fromAmount, setFromAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const fromCoin = assets.find(a => a.id === fromId) || assets[0];
  const toCoin = assets.find(a => a.id === toId) || assets[1];
  const rate = fromCoin && toCoin ? fromCoin.price / toCoin.price : 0;
  const toAmount = parseFloat(fromAmount || 0) * rate;

  const flip = () => { setFromId(toId); setToId(fromId); setFromAmount(''); };

  const handleSwap = (e) => {
    e.preventDefault();
    if (!fromAmount) return;
    setLoading(true);
    setTimeout(() => {
      executeSwap({ fromCoin, toCoin, fromAmount: parseFloat(fromAmount) });
      toast({ message: `Swapped ${fromAmount} ${fromCoin.symbol} → ${toAmount.toFixed(6)} ${toCoin.symbol}`, type: 'success' });
      addNotification({ title: 'Swap Executed', body: `${fromAmount} ${fromCoin.symbol} → ${toAmount.toFixed(4)} ${toCoin.symbol}`, type: 'transaction' });
      setLoading(false);
      setDone(true);
      setTimeout(() => { setDone(false); setFromAmount(''); onClose(); }, 1800);
    }, 1400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Swap Crypto">
      {done ? (
        <div className="text-center py-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
            <Check className="w-8 h-8 text-green-400" />
          </motion.div>
          <p className="text-white font-bold">Swap complete!</p>
        </div>
      ) : (
        <form onSubmit={handleSwap} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">From</label>
            <div className="glass border border-white/10 rounded-xl p-3 space-y-2">
              <div className="relative">
                <select value={fromId} onChange={e => setFromId(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none pr-6">
                  {assets.filter(a => a.id !== toId).map(a => <option key={a.id} value={a.id} style={{ background: '#0d1117' }}>{a.symbol} ({a.balance.toFixed(4)} available)</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <input value={fromAmount} onChange={e => setFromAmount(e.target.value)} type="number" step="any" min="0"
                placeholder="0.00"
                className="w-full bg-transparent text-2xl font-black text-white placeholder-gray-700 focus:outline-none"
                required />
              {fromAmount && fromCoin && <p className="text-xs text-gray-600">≈ ${(parseFloat(fromAmount) * fromCoin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>}
            </div>
          </div>

          <div className="flex justify-center">
            <button type="button" onClick={flip}
              className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-500/30 transition-all">
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">To</label>
            <div className="glass border border-white/10 rounded-xl p-3 space-y-2">
              <div className="relative">
                <select value={toId} onChange={e => setToId(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none pr-6">
                  {assets.filter(a => a.id !== fromId).map(a => <option key={a.id} value={a.id} style={{ background: '#0d1117' }}>{a.symbol}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <div className="text-2xl font-black text-green-400">{toAmount > 0 ? toAmount.toFixed(6) : '0.00'}</div>
              {toAmount > 0 && toCoin && <p className="text-xs text-gray-600">≈ ${(toAmount * toCoin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>}
            </div>
          </div>

          {fromAmount && fromCoin && toCoin && (
            <div className="glass border border-white/5 rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Rate</span>
                <span className="text-gray-400">1 {fromCoin.symbol} = {rate.toFixed(6)} {toCoin.symbol}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Fee</span>
                <span className="text-gray-400">${(parseFloat(fromAmount) * fromCoin.price * 0.001).toFixed(2)} (0.1%)</span>
              </div>
            </div>
          )}

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full btn-neon text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><ArrowUpDown className="w-4 h-4" /> Swap</>}
          </motion.button>
        </form>
      )}
    </Modal>
  );
}

/* ── Main dashboard ── */
export default function WalletDashboard() {
  const { assets, totalBalance, change24h, changePct24h, hideBalance, toggleHideBalance, transactions } = useWallet();
  const { user } = useAuth();
  const { unreadCount } = useNotifs();

  const [modal, setModal] = useState(null); // 'send' | 'receive' | 'swap'

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-14 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-sm font-bold">
            {user?.avatar || 'AJ'}
          </div>
          <div>
            <div className="text-xs text-gray-500">{greeting()} 👋</div>
            <div className="text-sm font-semibold text-white">{user?.name || 'Alex Johnson'}</div>
          </div>
        </div>
        <Link href="/wallet/profile">
          <div className="relative w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 mb-5 relative overflow-hidden border-glow">
        <div className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(ellipse at top right, #22c55e 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium">Total Portfolio Value</span>
            <button onClick={toggleHideBalance} className="text-gray-600 hover:text-gray-400 transition-colors">
              {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-4xl font-black text-white mb-2 tracking-tight">
            {hideBalance ? '••••••' : `$${totalBalance.toLocaleString()}`}
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${changePct24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className="w-4 h-4" />
            {hideBalance ? '••••' : `+$${change24h.toLocaleString()} (+${changePct24h}%) today`}
          </div>
          <div className="mt-4 -mx-1" style={{ height: 60 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#balGrad)" dot={false} />
                <Tooltip content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 mb-5">
        <div className="grid grid-cols-4 gap-2">
          <QuickAction icon={Send}        label="Send"    onClick={() => setModal('send')}    color="#22c55e" />
          <QuickAction icon={Download}    label="Receive" onClick={() => setModal('receive')} color="#6366f1" />
          <QuickAction icon={ArrowUpDown} label="Swap"    onClick={() => setModal('swap')}    color="#f59e0b" />
          <QuickAction icon={CreditCard}  label="Card"    onClick={() => {}} color="#8b5cf6" />
        </div>
      </motion.div>

      {/* Assets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl overflow-hidden mb-5">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">My Assets</h2>
          <Link href="/wallet/market" className="text-xs text-green-400 font-medium hover:text-green-300 transition-colors">
            View all
          </Link>
        </div>
        <div className="py-2">
          {assets.slice(0, 5).map((coin, i) => (
            <CoinItem key={coin.id} coin={coin} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Recent Activity</h2>
          <Link href="/wallet/transactions" className="text-xs text-green-400 font-medium hover:text-green-300 transition-colors">
            View all
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {transactions.slice(0, 4).map((tx, i) => (
            <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-4 py-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                tx.type === 'buy' ? 'bg-green-500/15 text-green-400' :
                tx.type === 'sell' ? 'bg-red-500/15 text-red-400' :
                tx.type === 'swap' ? 'bg-amber-500/15 text-amber-400' :
                'bg-indigo-500/15 text-indigo-400'
              }`}>
                {tx.type === 'buy' ? '↓' : tx.type === 'sell' ? '↑' : tx.type === 'swap' ? '⇄' : '→'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white capitalize">{tx.type} {tx.symbol}</div>
                <div className="text-xs text-gray-500">{tx.time}</div>
              </div>
              <div className={`text-sm font-semibold ${tx.type === 'send' ? 'text-red-400' : 'text-green-400'}`}>
                {tx.type === 'send' ? '-' : '+'}${tx.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modals */}
      <SendModal    open={modal === 'send'}    onClose={() => setModal(null)} />
      <ReceiveModal open={modal === 'receive'} onClose={() => setModal(null)} />
      <SwapModal    open={modal === 'swap'}    onClose={() => setModal(null)} />
    </div>
  );
}
