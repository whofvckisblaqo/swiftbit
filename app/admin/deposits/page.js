'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const statusIcon = { completed: CheckCircle2, pending: Clock, failed: XCircle };

export default function DepositsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [deposits, setDeposits] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0, volume: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/transactions?type=deposit', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDeposits(data.transactions || []);
      if (data.stats) setStats(data.stats);
    } catch { toast({ message: 'Failed to load deposits', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n.toFixed(2)}`;

  const displayed = deposits.filter(d => {
    const matchSearch = d.userName.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <AdminHeader title="Deposits" subtitle="Incoming platform deposits" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Volume',  val: loading ? '—' : fmt(stats.volume), sub: 'All time completed', color: 'text-green-400' },
          { label: 'Completed',     val: loading ? '—' : stats.completed,   sub: 'Successful deposits', color: 'text-green-400' },
          { label: 'Pending',       val: loading ? '—' : stats.pending,     sub: 'Awaiting confirmation', color: 'text-yellow-400' },
          { label: 'Failed',        val: loading ? '—' : stats.failed,      sub: 'Failed attempts', color: 'text-red-400' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deposits..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {['all', 'completed', 'pending', 'failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={fetchData} className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'User', 'Amount', 'Asset', 'Method', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">Loading deposits...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">No deposits yet</td></tr>
              ) : displayed.map((d, i) => {
                const Icon = statusIcon[d.status] || Clock;
                return (
                  <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/[0.02] transition-all">
                    <td className="px-5 py-4 text-xs font-mono text-gray-500">{d.id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">
                          {d.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{d.userName}</div>
                          <div className="text-xs text-gray-600">{d.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-black text-green-400">+{d.amountFormatted}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-medium">{d.symbol}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{d.method || 'Crypto'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(d.status)}`}>
                        <Icon className="w-3 h-3" />{d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{d.time}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Showing {displayed.length} of {deposits.length} deposits</span>
        </div>
      </motion.div>
    </div>
  );
}
