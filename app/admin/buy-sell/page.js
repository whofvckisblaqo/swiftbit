'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth, useToast } from '@/store/useAppStore';
import { getStatusColor, getTxColor } from '@/lib/utils';

export default function BuySellPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0, volume: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/transactions?type=buy,sell', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.transactions || []);
      if (data.stats) setStats(data.stats);
    } catch { toast({ message: 'Failed to load orders', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n.toFixed(2)}`;

  const displayed = orders.filter(o => {
    const matchSearch = o.userName.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    return matchSearch && matchType;
  });

  const buyCount  = orders.filter(o => o.type === 'buy').length;
  const sellCount = orders.filter(o => o.type === 'sell').length;

  return (
    <div>
      <AdminHeader title="Buy / Sell" subtitle="All market order activity" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Buy Orders',   val: loading ? '—' : buyCount,               color: 'text-green-400', sub: 'Total buys' },
          { label: 'Sell Orders',  val: loading ? '—' : sellCount,              color: 'text-red-400',   sub: 'Total sells' },
          { label: 'Total Volume', val: loading ? '—' : fmt(stats.volume),      color: 'text-white',     sub: 'Combined volume' },
          { label: 'Completed',    val: loading ? '—' : stats.completed,        color: 'text-green-400', sub: 'Successful orders' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {['all', 'buy', 'sell'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${typeFilter === t ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>{t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <button onClick={fetchData} className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white">Orders</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>Buy: {buyCount}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Sell: {sellCount}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'User', 'Type', 'Asset', 'Amount', 'Qty', 'Price', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-600 text-sm">Loading orders...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-600 text-sm">No buy/sell orders yet</td></tr>
              ) : displayed.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-white">{o.userName}</div>
                    <div className="text-xs text-gray-600">{o.userEmail}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${getTxColor(o.type)}`}>
                      {o.type === 'buy' ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                      {o.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{o.symbol}</td>
                  <td className="px-5 py-4 text-sm font-bold text-white">{o.amountFormatted}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 font-mono">{o.qty ? `${o.qty.toFixed(4)} ${o.symbol}` : '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{o.price ? `$${o.price.toLocaleString()}` : '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">{o.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Showing {displayed.length} of {orders.length} orders</span>
        </div>
      </motion.div>
    </div>
  );
}
