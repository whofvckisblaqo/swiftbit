'use client';
import { motion } from 'framer-motion';
import { Landmark, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getStatusColor } from '@/lib/utils';

const loans = [
  { id: 'LN-2241', user: 'Alex Johnson',       collateral: 'BTC',  collateralAmt: '$84,000', loan: '$42,000', interest: '8.5%', ltv: '50%', status: 'active',   health: 'healthy', due: 'Mar 15, 2024' },
  { id: 'LN-2240', user: 'Sarah Chen',         collateral: 'ETH',  collateralAmt: '$28,400', loan: '$14,200', interest: '9.2%', ltv: '50%', status: 'active',   health: 'healthy', due: 'Feb 28, 2024' },
  { id: 'LN-2239', user: 'Mohammed Al-Rashid', collateral: 'BTC',  collateralAmt: '$62,000', loan: '$43,400', interest: '8.5%', ltv: '70%', status: 'active',   health: 'warning', due: 'Apr 1, 2024'  },
  { id: 'LN-2238', user: 'Carlos Mendez',      collateral: 'SOL',  collateralAmt: '$12,000', loan: '$6,000',  interest: '11%',  ltv: '50%', status: 'repaid',   health: 'healthy', due: 'Jan 31, 2024' },
  { id: 'LN-2237', user: 'Emma Williams',      collateral: 'BNB',  collateralAmt: '$9,600',  loan: '$7,200',  interest: '9.8%', ltv: '75%', status: 'active',   health: 'danger',  due: 'Feb 10, 2024' },
  { id: 'LN-2236', user: 'Priya Patel',        collateral: 'ETH',  collateralAmt: '$48,000', loan: '$24,000', interest: '9.2%', ltv: '50%', status: 'defaulted',health: 'danger',  due: 'Jan 5, 2024'  },
];

const healthColor = { healthy: 'text-green-400 bg-green-500/10', warning: 'text-yellow-400 bg-yellow-500/10', danger: 'text-red-400 bg-red-500/10' };

export default function LoansPage() {
  const active    = loans.filter(l => l.status === 'active');
  const warning   = loans.filter(l => l.health === 'warning' || l.health === 'danger');
  const totalOut  = active.reduce((acc, l) => acc + parseFloat(l.loan.replace(/[$,]/g, '')), 0);

  return (
    <div>
      <AdminHeader title="Loans" subtitle="Crypto-backed loan portfolio" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Loans',       val: active.length,                         color: 'text-white',       sub: 'Collateral-backed' },
          { label: 'Outstanding',        val: `$${(totalOut/1000).toFixed(0)}K`,     color: 'text-green-400',   sub: 'Total lent out'    },
          { label: 'At-Risk Loans',      val: warning.length,                        color: 'text-yellow-400',  sub: 'LTV > 65%'         },
          { label: 'Defaulted',          val: loans.filter(l=>l.status==='defaulted').length, color: 'text-red-400', sub: 'This month'   },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Risk alert */}
      {warning.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 glass rounded-xl p-4 border border-yellow-500/25 bg-yellow-500/5 mb-5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300 font-medium">
            {warning.length} loan{warning.length > 1 ? 's' : ''} approaching liquidation threshold. Immediate review recommended.
          </p>
          <button className="ml-auto text-xs font-semibold text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 transition-all shrink-0">
            Review
          </button>
        </motion.div>
      )}

      {/* Loan breakdown cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'BTC Collateral',  val: '$146K', pct: 60, color: '#f7931a' },
          { label: 'ETH Collateral',  val: '$76.4K',pct: 31, color: '#627eea' },
          { label: 'Other Assets',    val: '$21.6K',pct: 9,  color: '#22c55e' },
        ].map(c => (
          <div key={c.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{c.label}</span>
              <span className="text-sm font-black" style={{ color: c.color }}>{c.val}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ delay: 0.4, duration: 0.6 }}
                className="h-full rounded-full" style={{ background: c.color }} />
            </div>
            <p className="text-xs text-gray-600 mt-2">{c.pct}% of collateral pool</p>
          </div>
        ))}
      </div>

      {/* Loans table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Loan ID', 'Borrower', 'Collateral', 'Value', 'Loan Amt', 'Interest', 'LTV', 'Health', 'Status', 'Due'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loans.map((l, i) => (
                <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-4 py-4 text-xs font-mono text-gray-500">{l.id}</td>
                  <td className="px-4 py-4 text-sm font-medium text-white">{l.user}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-white">{l.collateral}</td>
                  <td className="px-4 py-4 text-sm text-green-400 font-medium">{l.collateralAmt}</td>
                  <td className="px-4 py-4 text-sm font-bold text-white">{l.loan}</td>
                  <td className="px-4 py-4 text-sm text-gray-400">{l.interest}</td>
                  <td className="px-4 py-4 text-sm text-gray-400">{l.ltv}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${healthColor[l.health]}`}>{l.health}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(l.status)}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">{l.due}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
