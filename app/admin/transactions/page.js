'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, RefreshCw } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth, useToast } from '@/store/useAppStore';
import { getStatusColor, getTxColor } from '@/lib/utils';

export default function TransactionsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0, volume: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/transactions', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTransactions(data.transactions || []);
      if (data.stats) setStats(data.stats);
    } catch { toast({ message: 'Failed to load transactions', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const fmt = (n) => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n.toFixed(2)}`;

  const displayed = transactions.filter(tx => {
    const matchSearch = tx.userName.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <AdminHeader title="Transactions" subtitle="All platform transactions" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Volume', val: loading ? '—' : fmt(stats.volume), color: 'text-white' },
          { label: 'Completed', val: loading ? '—' : stats.completed.toLocaleString(), color: 'text-green-400' },
          { label: 'Pending', val: loading ? '—' : stats.pending.toLocaleString(), color: 'text-yellow-400' },
          { label: 'Failed', val: loading ? '—' : stats.failed.toLocaleString(), color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or TX ID..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none bg-transparent appearance-none min-w-[160px]">
          {['all', 'deposit', 'withdrawal', 'buy', 'sell', 'swap', 'send', 'receive'].map(t => (
            <option key={t} value={t} style={{ background: '#0d1117' }} className="capitalize">
              {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={fetchData} className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['TX ID', 'User', 'Type', 'Amount', 'Asset', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">Loading transactions...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">No transactions yet</td></tr>
              ) : displayed.map((tx, i) => (
                <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{tx.id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-white">{tx.userName}</div>
                    <div className="text-xs text-gray-600">{tx.userEmail}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getTxColor(tx.type)}`}>{tx.type}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-white">{tx.amountFormatted}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{tx.symbol}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{tx.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Showing {displayed.length} of {transactions.length} transactions</span>
        </div>
      </motion.div>
    </div>
  );
}
