'use client';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import AdminHeader from '@/components/admin/AdminHeader';
import { adminChartData } from '@/lib/data';

const userGrowth = [
  { month: 'Jul', users: 180000, active: 132000 },
  { month: 'Aug', users: 194000, active: 145000 },
  { month: 'Sep', users: 206000, active: 154000 },
  { month: 'Oct', users: 221000, active: 168000 },
  { month: 'Nov', users: 235000, active: 178000 },
  { month: 'Dec', users: 241000, active: 182000 },
  { month: 'Jan', users: 248392, active: 184521 },
];

const revenueData = adminChartData.map(d => ({ ...d, revenue: d.revenue * 1000 }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-white/10 text-xs space-y-1">
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
  return (
    <div>
      <AdminHeader title="Analytics" subtitle="Platform performance metrics" />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Monthly Active Users', val: '184,521', change: '+8.2%', up: true },
          { label: 'Avg. Session Duration', val: '12m 34s', change: '+1.4%', up: true },
          { label: 'Trade Conversion Rate', val: '34.8%', change: '+2.1%', up: true },
          { label: 'Churn Rate', val: '2.4%', change: '-0.3%', up: true },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <div className="text-2xl font-black text-white mb-1">{k.val}</div>
            <div className="text-xs text-gray-500 mb-2">{k.label}</div>
            <div className={`text-xs font-medium ${k.up ? 'text-green-400' : 'text-red-400'}`}>{k.change} vs last month</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-base font-bold text-white mb-1">User Growth</h3>
          <p className="text-xs text-gray-500 mb-4">Total vs Active Users</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ color: '#6b7280', fontSize: 11 }}>{v}</span>} />
              <Area type="monotone" dataKey="users" name="Total" stroke="#22c55e" strokeWidth={2} fill="url(#totalGrad)" />
              <Area type="monotone" dataKey="active" name="Active" stroke="#6366f1" strokeWidth={2} fill="url(#activeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-base font-bold text-white mb-1">Revenue (USD K)</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly platform revenue</p>
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

      {/* Trade stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="text-base font-bold text-white mb-5">Top Trading Pairs</h3>
        <div className="space-y-4">
          {[
            { pair: 'BTC/USDT', vol: '$42.1M', trades: '18,420', change: '+8.2%', up: true },
            { pair: 'ETH/USDT', vol: '$28.4M', trades: '12,840', change: '+5.1%', up: true },
            { pair: 'SOL/USDT', vol: '$14.2M', trades: '8,210', change: '+12.4%', up: true },
            { pair: 'BNB/USDT', vol: '$8.9M', trades: '4,120', change: '-1.2%', up: false },
            { pair: 'XRP/USDT', vol: '$6.2M', trades: '2,840', change: '+3.8%', up: true },
          ].map((p, i) => (
            <div key={p.pair} className="flex items-center gap-4">
              <div className="w-8 text-xs text-gray-600 font-mono">#{i + 1}</div>
              <div className="w-24 text-sm font-bold text-white">{p.pair}</div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - i * 15}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 opacity-80" />
              </div>
              <div className="w-20 text-sm text-white text-right">{p.vol}</div>
              <div className="w-16 text-xs text-gray-500 text-right">{p.trades}</div>
              <div className={`w-14 text-xs font-medium text-right ${p.up ? 'text-green-400' : 'text-red-400'}`}>{p.change}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
