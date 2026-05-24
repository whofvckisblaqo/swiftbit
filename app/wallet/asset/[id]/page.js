'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Download, ArrowUpDown, Copy, Check,
  TrendingUp, TrendingDown, ChevronDown, X, AlertCircle,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useWallet, useAuth, useToast, useNotifs } from '@/store/useAppStore';

const RANGES = ['1D', '1W', '1M', '3M', 'ALL'];

function buildChart(sparkline, range) {
  const points = range === '1D' ? 7 : range === '1W' ? 7 : range === '1M' ? 14 : range === '3M' ? 21 : 30;
  const base = sparkline[0];
  return Array.from({ length: points }, (_, i) => {
    const v = sparkline[i % sparkline.length];
    return { i, value: v + (Math.sin(i * 0.7) * base * 0.01) };
  });
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
        <div className="text-white font-bold">${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      </div>
    );
  }
  return null;
};

/* ── Send sheet ── */
function SendSheet({ coin, onClose }) {
  const { assets, executeSend } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifs();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const usdValue = parseFloat(amount || 0) * coin.price;

  const ethBalance     = assets.find(a => a.symbol === 'ETH')?.balance        || 0;
  const usdtErc20Bal   = assets.find(a => a.symbol === 'USDT_ERC20')?.balance || 0;
  const needsEthGas    = coin.symbol === 'USDT_ERC20' && usdtErc20Bal > 100000 && ethBalance < 0.5;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!amount || !address) return;
    setLoading(true);
    try {
      const tx = await executeSend({ coin, amount: parseFloat(amount), address });
      if (tx) {
        toast({ message: `${amount} ${coin.symbol} sent — pending approval`, type: 'success' });
        addNotification({ title: `${coin.symbol} Sent`, body: `${amount} ${coin.symbol} sent to ${address.slice(0, 10)}… (pending)`, type: 'transaction' });
        setDone(true);
      }
    } catch {
      toast({ message: 'Send failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 glass-dark border-t border-white/10 rounded-t-3xl p-6 max-w-lg mx-auto">
      <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${coin.color}20`, color: coin.color }}>{coin.icon}</div>
          <h3 className="text-base font-bold text-white">Send {coin.symbol}</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {done ? (
        <div className="text-center py-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
            <Check className="w-8 h-8 text-green-400" />
          </motion.div>
          <p className="text-white font-bold">Sent — pending approval</p>
          <p className="text-xs text-gray-500 mt-1">Admin will process this shortly</p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          {needsEthGas && (
            <div className="flex items-start gap-3 rounded-xl p-3 border border-orange-500/30 bg-orange-500/5">
              <span className="text-orange-400 text-base flex-shrink-0">⚠</span>
              <div>
                <p className="text-xs font-semibold text-orange-400 mb-0.5">Insufficient ETH for gas</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Regarding the amount of USDT ERC20 you have (<span className="text-white font-semibold">{usdtErc20Bal.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT</span>), you need to have at least <span className="text-white font-semibold">0.5 ETH</span> in your wallet to cover gas fees. Your ETH balance: <span className="text-white font-semibold">{ethBalance.toFixed(4)} ETH</span>.
                </p>
              </div>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Recipient address</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
              required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500">Amount ({coin.symbol})</label>
              <button type="button" onClick={() => setAmount(coin.balance.toFixed(6))}
                className="text-xs text-green-400 hover:text-green-300 transition-colors">MAX</button>
            </div>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="any" min="0"
              placeholder="0.00"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
              required />
            {amount && <p className="text-xs text-gray-600 mt-1">≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>}
          </div>
          <p className="text-xs text-gray-600">Network fee: ~$0.25 · Est. arrival: &lt;1 min</p>
          <motion.button type="submit" disabled={loading || needsEthGas} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
            {loading
              ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              : <><Send className="w-4 h-4" /> Send {coin.symbol}</>}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}

/* ── Receive sheet ── */
function ReceiveSheet({ coin, walletAddress, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 glass-dark border-t border-white/10 rounded-t-3xl p-6 max-w-lg mx-auto">
      <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${coin.color}20`, color: coin.color }}>{coin.icon}</div>
          <h3 className="text-base font-bold text-white">Receive {coin.symbol}</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {walletAddress ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG value={walletAddress} size={160} bgColor="#ffffff" fgColor="#000000" level="M" />
            </div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-xs text-gray-500 mb-2">{coin.symbol} Deposit Address</p>
            <p className="text-xs font-mono text-gray-300 break-all leading-relaxed">{walletAddress}</p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-xl w-full justify-center">
            ⚠ Only send {coin.symbol} to this address
          </div>
          <button onClick={copy}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border font-semibold text-sm transition-all ${copied ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'glass border-white/10 text-gray-300 hover:text-white hover:border-white/20'}`}>
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Address</>}
          </button>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-500/10 border border-white/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-7 h-7 text-gray-600" />
          </div>
          <p className="text-sm font-semibold text-gray-400 mb-1">Address Not Assigned</p>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
            Your {coin.symbol} deposit address hasn't been set yet. Contact support or check back later.
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ── Main page ── */
export default function AssetPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { assets } = useWallet();
  const { user } = useAuth();

  const coin = assets.find(a => a.id === id);
  const [range, setRange] = useState('1W');
  const [sheet, setSheet] = useState(null); // 'send' | 'receive'

  if (!coin) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 text-center">
        <p className="text-gray-500">Asset not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-green-400 text-sm">Go back</button>
      </div>
    );
  }

  const chartData = buildChart(coin.sparkline || [coin.price], range);
  const positive = coin.change24h >= 0;
  const walletAddress = user?.walletAddresses?.[coin.symbol] || '';

  return (
    <>
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 pt-14 pb-6">
          <button onClick={() => router.back()}
            className="p-2 rounded-xl glass border border-white/10 text-gray-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
              style={{ background: `${coin.color}20`, color: coin.color, border: `1px solid ${coin.color}30` }}>
              {coin.icon}
            </div>
            <div>
              <div className="text-base font-bold text-white">{coin.name}</div>
              <div className="text-xs text-gray-500">{coin.symbol}</div>
            </div>
          </div>
          <div className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${positive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {positive ? '+' : ''}{coin.change24h}%
          </div>
        </div>

        {/* Price */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 mb-4 relative overflow-hidden border-glow">
          <div className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(ellipse at top right, ${coin.color} 0%, transparent 70%)` }} />
          <div className="relative">
            <p className="text-xs text-gray-500 mb-1">Current Price</p>
            <p className="text-4xl font-black text-white mb-1">${coin.price.toLocaleString()}</p>
            <p className={`text-sm font-medium mb-5 ${positive ? 'text-green-400' : 'text-red-400'}`}>
              {positive ? '+' : ''}{coin.change24h}% today
            </p>

            {/* Chart */}
            <div style={{ height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`grad-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={coin.color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={coin.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={coin.color} strokeWidth={2}
                    fill={`url(#grad-${coin.id})`} dot={false} />
                  <Tooltip content={<CustomTooltip />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Range selector */}
            <div className="flex gap-1 mt-3">
              {RANGES.map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${range === r ? 'text-white font-semibold' : 'text-gray-600 hover:text-gray-400'}`}
                  style={range === r ? { background: `${coin.color}25`, color: coin.color } : {}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Balance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="glass rounded-2xl p-5 mb-4 border border-white/5">
          <p className="text-xs text-gray-500 mb-3 font-medium">Your Balance</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-black text-white">{coin.balance.toFixed(6)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{coin.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-400">${coin.usdValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">USD Value</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="glass rounded-2xl p-5 mb-6 border border-white/5">
          <p className="text-xs text-gray-500 mb-3 font-medium">Market Info</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Market Cap', val: coin.marketCap },
              { label: '24h Volume', val: coin.volume },
              { label: '7d Change', val: `${coin.change7d > 0 ? '+' : ''}${coin.change7d}%`, color: coin.change7d >= 0 ? 'text-green-400' : 'text-red-400' },
              { label: 'Price', val: `$${coin.price.toLocaleString()}` },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xs text-gray-600">{s.label}</p>
                <p className={`text-sm font-semibold mt-0.5 ${s.color || 'text-white'}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed action buttons */}
      <div className="fixed bottom-20 inset-x-0 px-4 max-w-lg mx-auto left-0 right-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setSheet('send')}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 glass text-white font-semibold text-sm hover:border-white/20 transition-all">
            <Send className="w-4 h-4 text-green-400" /> Send
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setSheet('receive')}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl btn-neon text-white font-semibold text-sm">
            <Download className="w-4 h-4" /> Receive
          </motion.button>
        </motion.div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {sheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSheet(null)} />
        )}
      </AnimatePresence>

      {/* Sheets */}
      <AnimatePresence>
        {sheet === 'send' && (
          <SendSheet coin={coin} onClose={() => setSheet(null)} />
        )}
        {sheet === 'receive' && (
          <ReceiveSheet coin={coin} walletAddress={walletAddress} onClose={() => setSheet(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
