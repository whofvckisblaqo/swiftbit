'use client';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  Landmark, ShieldCheck, LifeBuoy, Activity, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCard from '@/components/admin/StatsCard';
import { adminTransactions, adminChartData, cryptoAssets } from '@/lib/data';
import { getStatusColor, getTxColor } from '@/lib/utils';
import { useAdminStore, useToast } from '@/store/useAppStore';

const statCards = [
  { title: 'Total Users', value: '248,392', change: 12.4, changeLabel: 'vs last month', icon: Users, color: '#22c55e' },
  { title: 'Total Balance', value: '$2.84B', change: 8.2, changeLabel: 'platform AUM', icon: DollarSign, color: '#6366f1' },
  { title: 'Daily Deposits', value: '$12.4M', change: 18.5, changeLabel: 'today', icon: ArrowDownToLine, color: '#f59e0b' },
  { title: 'Daily Withdrawals', value: '$8.9M', change: -2.1, changeLabel: 'today', icon: ArrowUpFromLine, color: '#ec4899' },
  { title: 'Revenue', value: '$184.2K', change: 24.8, changeLabel: 'this month', icon: TrendingUp, color: '#14b8a6' },
  { title: 'Active Loans', value: '3,842', change: 5.3, changeLabel: '$42.1M outstanding', icon: Landmark, color: '#8b5cf6' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-white/10 text-xs space-y-1.5">
      <div className="font-semibold text-gray-400">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="font-medium capitalize">{p.name}:</span>
          <span className="font-bold">${p.value}M</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { kycQueue, approveKyc, rejectKyc } = useAdminStore();
  const { toast } = useToast();

  const handleApprove = (id, name) => {
    approveKyc(id);
    toast({ message: `KYC approved for ${name}`, type: 'success' });
  };
  const handleReject = (id, name) => {
    rejectKyc(id);
    toast({ message: `KYC rejected for ${name}`, type: 'error' });
  };

  const pendingKyc = kycQueue.filter(k => k.status === 'pending').slice(0, 4);

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Welcome back, Super Admin" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((s, i) => <StatsCard key={s.title} {...s} delay={i * 0.05} />)}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {/* Volume chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Volume Overview</h3>
              <p className="text-xs text-gray-500">Deposits vs Withdrawals (M USD)</p>
            </div>
            <div className="flex gap-2">
              {['7D', '1M', '3M', 'YTD'].map(t => (
                <button key={t} className={`text-xs px-3 py-1.5 rounded-lg transition-all ${t === '1M' ? 'bg-green-500/20 text-green-400' : 'text-gray-600 hover:text-gray-300'}`}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={adminChartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ color: '#6b7280', fontSize: 11 }}>{v}</span>} />
              <Bar dataKey="deposits" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar dataKey="withdrawals" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Asset distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-base font-bold text-white mb-1">Top Assets</h3>
          <p className="text-xs text-gray-500 mb-5">By platform holdings</p>
          <div className="space-y-4">
            {cryptoAssets.slice(0, 5).map((c, i) => {
              const pct = [38, 22, 12, 9, 7][i];
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                      <span className="text-sm font-medium text-white">{c.symbol}</span>
                    </div>
                    <span className="text-xs text-gray-500">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      className="h-full rounded-full" style={{ background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent transactions + KYC */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {/* Recent transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-base font-bold text-white">Recent Transactions</h3>
            <a href="/admin/transactions" className="text-xs text-green-400 hover:text-green-300 transition-colors font-medium">View all</a>
          </div>
          <div className="divide-y divide-white/3">
            {adminTransactions.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/2 transition-all">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${getTxColor(tx.type)}`}>
                  {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : tx.type === 'swap' ? '⇄' : tx.type === 'buy' ? '↓' : '↑'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{tx.user}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="capitalize">{tx.type}</span>
                    <span>·</span>
                    <span>{tx.coin}</span>
                    <span>·</span>
                    <span>{tx.time}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white">{tx.amount}</div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(tx.status)}`}>{tx.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* KYC Pending */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">KYC Pending</h3>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">
                {pendingKyc.length}
              </span>
            </div>
            <a href="/admin/kyc" className="text-xs text-green-400 hover:text-green-300 transition-colors font-medium">View all</a>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {pendingKyc.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-gray-600">All caught up — no pending KYC</div>
            ) : pendingKyc.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{r.name}</div>
                  <div className="text-xs text-gray-600">{r.docType} · {r.country} · {r.submitted}</div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleApprove(r.id, r.name)}
                    className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 hover:bg-green-500/25 transition-all">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleReject(r.id, r.name)}
                    className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="text-base font-bold text-white mb-4">Live Activity Feed</h3>
        <div className="space-y-3">
          {[
            { msg: 'New user registered from 🇺🇸 United States', time: 'just now', type: 'user' },
            { msg: 'Withdrawal $25,000 BTC flagged for review', time: '1 min', type: 'warning' },
            { msg: 'KYC approved: Mohammed Al-Rashid', time: '3 min', type: 'success' },
            { msg: 'System: Liquidity rebalanced across 3 chains', time: '5 min', type: 'system' },
            { msg: 'Support ticket #1284 escalated to Tier 2', time: '8 min', type: 'warning' },
            { msg: 'Deposit $50,000 USDT confirmed — Priya Patel', time: '12 min', type: 'success' },
          ].map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                e.type === 'success' ? 'bg-green-400' :
                e.type === 'warning' ? 'bg-yellow-400' :
                e.type === 'user' ? 'bg-blue-400' : 'bg-gray-600'
              }`} />
              <span className="text-sm text-gray-400 flex-1">{e.msg}</span>
              <span className="text-xs text-gray-700 flex-shrink-0">{e.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
