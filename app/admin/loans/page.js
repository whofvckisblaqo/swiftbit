'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

const healthColor = { healthy: 'text-green-400 bg-green-500/10', warning: 'text-yellow-400 bg-yellow-500/10', danger: 'text-red-400 bg-red-500/10' };

export default function LoansPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({ active: 0, atRisk: 0, defaulted: 0, outstanding: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/loans', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setLoans(data.loans || []);
      if (data.stats) setStats(data.stats);
    } catch { toast({ message: 'Failed to load loans', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleStatus = async (id, userName, status) => {
    try {
      await fetch(`/api/admin/loans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setLoans(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast({ message: `Loan ${status} for ${userName}`, type: 'success' });
    } catch { toast({ message: 'Action failed', type: 'error' }); }
  };

  const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${n.toFixed(2)}`;
  const atRiskLoans = loans.filter(l => l.health === 'warning' || l.health === 'danger');

  return (
    <div>
      <AdminHeader title="Loans" subtitle="Crypto-backed loan portfolio" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Loans',  val: loading ? '—' : stats.active,                color: 'text-white',      sub: 'Collateral-backed' },
          { label: 'Outstanding',   val: loading ? '—' : fmt(stats.outstanding),      color: 'text-green-400',  sub: 'Total lent out' },
          { label: 'At-Risk',       val: loading ? '—' : stats.atRisk,               color: 'text-yellow-400', sub: 'LTV > 65%' },
          { label: 'Defaulted',     val: loading ? '—' : stats.defaulted,            color: 'text-red-400',    sub: 'This period' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {atRiskLoans.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 glass rounded-xl p-4 border border-yellow-500/25 bg-yellow-500/5 mb-5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300 font-medium">
            {atRiskLoans.length} loan{atRiskLoans.length > 1 ? 's' : ''} approaching liquidation threshold.
          </p>
        </motion.div>
      )}

      <div className="flex justify-end mb-5">
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
                {['Loan ID', 'Borrower', 'Collateral', 'Value', 'Loan Amt', 'Interest', 'LTV', 'Health', 'Status', 'Due', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={11} className="px-5 py-12 text-center text-gray-600 text-sm">Loading loans...</td></tr>
              ) : loans.length === 0 ? (
                <tr><td colSpan={11} className="px-5 py-12 text-center text-gray-600 text-sm">No loans yet</td></tr>
              ) : loans.map((l, i) => (
                <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-4 py-4 text-xs font-mono text-gray-500">{l.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-white">{l.userName}</div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-white">{l.collateral}</td>
                  <td className="px-4 py-4 text-sm text-green-400 font-medium">{l.collateralAmt}</td>
                  <td className="px-4 py-4 text-sm font-bold text-white">{l.loan}</td>
                  <td className="px-4 py-4 text-sm text-gray-400">{l.interest}</td>
                  <td className="px-4 py-4 text-sm text-gray-400">{l.ltv}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${healthColor[l.health] || healthColor.healthy}`}>{l.health}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(l.status)}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">{l.due}</td>
                  <td className="px-4 py-4">
                    {l.status === 'active' && (
                      <button onClick={() => handleStatus(l.id, l.userName, 'repaid')}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-all font-medium whitespace-nowrap">
                        Mark Repaid
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Showing {loans.length} loans</span>
        </div>
      </motion.div>
    </div>
  );
}
