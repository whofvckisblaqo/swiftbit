'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

const riskColor = { low: 'text-green-400 bg-green-500/10', medium: 'text-yellow-400 bg-yellow-500/10', high: 'text-red-400 bg-red-500/10' };

export default function WithdrawalsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0, volume: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/transactions?type=withdrawal', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setWithdrawals(data.transactions || []);
      if (data.stats) setStats(data.stats);
    } catch { toast({ message: 'Failed to load withdrawals', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleAction = async (id, userName, status) => {
    try {
      await fetch(`/api/admin/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      toast({ message: `Withdrawal ${status === 'completed' ? 'approved' : 'rejected'} for ${userName}`, type: status === 'completed' ? 'success' : 'error' });
    } catch { toast({ message: 'Action failed', type: 'error' }); }
  };

  const displayed = withdrawals.filter(w => {
    const matchSearch = w.userName.toLowerCase().includes(search.toLowerCase()) || w.id.includes(search);
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n.toFixed(2)}`;

  return (
    <div>
      <AdminHeader title="Withdrawals" subtitle="Outgoing withdrawal requests" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Volume",    val: loading ? '—' : fmt(stats.volume), sub: 'All time processed', color: 'text-white' },
          { label: 'Pending Review',  val: loading ? '—' : stats.pending,     sub: 'Awaiting approval',  color: 'text-yellow-400' },
          { label: 'Completed',       val: loading ? '—' : stats.completed,   sub: 'Processed',          color: 'text-green-400' },
          { label: 'Failed',          val: loading ? '—' : stats.failed,      sub: 'Rejected/failed',    color: 'text-red-400' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {pendingCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 glass rounded-xl p-4 border border-yellow-500/25 mb-5 bg-yellow-500/5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300 font-medium">
            {pendingCount} withdrawal{pendingCount > 1 ? 's' : ''} pending approval — review required.
          </p>
          <button onClick={() => setStatusFilter('pending')}
            className="ml-auto text-xs font-semibold text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 transition-all shrink-0">
            Review All
          </button>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search withdrawals..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {['all', 'completed', 'pending', 'failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>{s}</button>
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
                {['ID', 'User', 'Amount', 'Asset', 'Address', 'Risk', 'Status', 'Time', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-600 text-sm">Loading withdrawals...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-600 text-sm">No withdrawals yet</td></tr>
              ) : displayed.map((w, i) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{w.id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-white">{w.userName}</div>
                    <div className="text-xs text-gray-600">{w.userEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-sm font-black text-red-400">-{w.amountFormatted}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{w.symbol}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-600">{w.address ? `${w.address.slice(0, 8)}...` : '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${riskColor[w.risk] || riskColor.low}`}>{w.risk}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(w.status)}`}>{w.status}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">{w.time}</td>
                  <td className="px-5 py-4">
                    {w.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleAction(w.id, w.userName, 'completed')}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-all font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleAction(w.id, w.userName, 'failed')}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Showing {displayed.length} of {withdrawals.length} withdrawals</span>
        </div>
      </motion.div>
    </div>
  );
}
