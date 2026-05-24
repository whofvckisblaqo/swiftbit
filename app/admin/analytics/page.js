'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import AdminHeader from '@/components/admin/AdminHeader';
import { adminChartData } from '@/lib/data';
import { useAuth } from '@/store/useAppStore';

const revenueData = adminChartData.map(d => ({ ...d, revenue: +(d.revenue * 1000).toFixed(0) }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-white/10 text-xs">
      <div className="font-semibold text-gray-400 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, kycPending: 0 });
  const [txStats, setTxStats] = useState({ total: 0, completed: 0, volume: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/transactions', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([s, tx]) => {
      setStats(s);
      if (tx.stats) setTxStats(tx.stats);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n}`;

  const kpis = [
    { label: 'Total Users',      val: loading ? '—' : stats.total.toLocaleString(),   sub: 'Registered accounts' },
    { label: 'Active Users',     val: loading ? '—' : stats.active.toLocaleString(),  sub: 'Not suspended' },
    { label: 'Total Transactions', val: loading ? '—' : txStats.total.toLocaleString(), sub: 'All time' },
    { label: 'KYC Pending',      val: loading ? '—' : stats.kycPending.toLocaleString(), sub: 'Awaiting review' },
  ];

  return (
    <div>
      <AdminHeader title="Analytics" subtitle="Platform performance metrics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <div className="text-2xl font-black text-white mb-1">{k.val}</div>
            <div className="text-xs text-gray-500 mb-2">{k.label}</div>
            <div className="text-xs text-gray-700">{k.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-base font-bold text-white mb-1">Deposit / Withdrawal Volume</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly (millions USD) — historical</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={adminChartData}>
              <defs>
                <linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ color: '#6b7280', fontSize: 11 }}>{v}</span>} />
              <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#22c55e" strokeWidth={2} fill="url(#dGrad)" />
              <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#6366f1" strokeWidth={2} fill="url(#wGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-base font-bold text-white mb-1">Platform Revenue ($K)</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly — historical</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue ($K)" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="text-base font-bold text-white mb-5">User Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total',     val: stats.total,      pct: 100, color: '#22c55e' },
            { label: 'Active',    val: stats.active,     pct: stats.total ? Math.round(stats.active / stats.total * 100) : 0, color: '#6366f1' },
            { label: 'Suspended', val: stats.suspended,  pct: stats.total ? Math.round(stats.suspended / stats.total * 100) : 0, color: '#ef4444' },
            { label: 'KYC Pending', val: stats.kycPending, pct: stats.total ? Math.round(stats.kycPending / stats.total * 100) : 0, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4 border border-white/5">
              <div className="text-xl font-black text-white mb-1">{loading ? '—' : s.val.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mb-2">{s.label}</div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="h-full rounded-full" style={{ background: s.color }} />
              </div>
              <div className="text-xs mt-1" style={{ color: s.color }}>{loading ? '' : `${s.pct}%`}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
