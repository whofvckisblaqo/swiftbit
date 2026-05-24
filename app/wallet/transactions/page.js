'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, ArrowUpDown, ShoppingCart, RefreshCw, Clock } from 'lucide-react';
import { useAuth, useWallet } from '@/store/useAppStore';
import { getStatusColor, getTxColor } from '@/lib/utils';

const typeFilters = ['All', 'Buy', 'Sell', 'Send', 'Receive', 'Swap', 'Deposit'];

const txIcons = {
  buy: ShoppingCart,
  sell: ArrowUpRight,
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  swap: ArrowUpDown,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  withdraw: ArrowUpRight,
};

function TxItem({ tx, index }) {
  const Icon = txIcons[tx.type] || ArrowUpDown;
  const txColor = getTxColor(tx.type);
  const statusColor = getStatusColor(tx.status);
  const isPositive = ['buy', 'receive', 'deposit'].includes(tx.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all"
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${txColor}`}>
        {tx.status === 'pending' ? <Clock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-semibold text-white capitalize">{tx.type}</span>
          <span className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : '-'}{tx.amountFormatted}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 truncate max-w-[120px]">{tx.coin}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor}`}>
              {tx.status}
            </span>
          </div>
          <span className="text-xs text-gray-600 flex-shrink-0">{tx.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TransactionsPage() {
  const { token } = useAuth();
  const { transactions: storeTxs } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.transactions) setTransactions(data.transactions);
    } catch {
      // fall back to store transactions
      setTransactions(storeTxs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [token]);

  const displayed = transactions.filter(tx => {
    const matchFilter = filter === 'All' || tx.type.toLowerCase() === filter.toLowerCase();
    const matchSearch = (tx.coin || '').toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      (tx.id || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalIn  = transactions.filter(t => ['buy','receive','deposit'].includes(t.type) && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => ['send','withdrawal','sell'].includes(t.type) && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const pending  = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">History</h1>
          <p className="text-sm text-gray-500">Your transaction history</p>
        </div>
        <button onClick={fetchTransactions}
          className="glass border border-white/10 rounded-xl p-2.5 text-gray-400 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all"
          />
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {typeFilters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === f ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass border border-white/5 text-gray-500 hover:text-gray-300'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-green-400">+${totalIn.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-600 mt-0.5">Total In</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-red-400">-${totalOut.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-600 mt-0.5">Total Out</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-yellow-400">{pending}</div>
          <div className="text-xs text-gray-600 mt-0.5">Pending</div>
        </div>
      </div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-6 h-6 text-gray-600 animate-spin mx-auto mb-3" />
            <div className="text-sm text-gray-500">Loading transactions...</div>
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm text-gray-500">No transactions found</div>
          </div>
        ) : (
          <div className="py-2">
            {displayed.map((tx, i) => <TxItem key={tx.id} tx={tx} index={i} />)}
          </div>
        )}
      </motion.div>
    </div>
  );
}
