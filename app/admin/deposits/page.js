'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowDownToLine, CheckCircle2, Clock, XCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getStatusColor } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const deposits = [
  { id: 'DEP-9821', user: 'Alex Johnson',        amount: '$12,500', coin: 'BTC',  method: 'Crypto',       status: 'completed', time: '2 min ago'  },
  { id: 'DEP-9820', user: 'Priya Patel',          amount: '$50,000', coin: 'USDT', method: 'Bank Transfer', status: 'completed', time: '14 min ago' },
  { id: 'DEP-9819', user: 'Liu Wei',              amount: '$31,200', coin: 'ETH',  method: 'Crypto',       status: 'pending',   time: '1 hr ago'   },
  { id: 'DEP-9818', user: 'Mohammed Al-Rashid',   amount: '$88,400', coin: 'BTC',  method: 'Crypto',       status: 'completed', time: '2 hr ago'   },
  { id: 'DEP-9817', user: 'Emma Williams',        amount: '$4,200',  coin: 'SOL',  method: 'Card',         status: 'pending',   time: '3 hr ago'   },
  { id: 'DEP-9816', user: 'Carlos Mendez',        amount: '$9,800',  coin: 'BNB',  method: 'Crypto',       status: 'completed', time: '5 hr ago'   },
  { id: 'DEP-9815', user: 'Sarah Chen',           amount: '$22,100', coin: 'USDT', method: 'Bank Transfer', status: 'completed', time: '6 hr ago'   },
  { id: 'DEP-9814', user: 'James Wilson',         amount: '$7,500',  coin: 'ETH',  method: 'Card',         status: 'failed',    time: '8 hr ago'   },
];

const chartData = [
  { time: '00:00', value: 1.2 }, { time: '03:00', value: 2.8 }, { time: '06:00', value: 1.9 },
  { time: '09:00', value: 4.2 }, { time: '12:00', value: 5.8 }, { time: '15:00', value: 3.4 },
  { time: '18:00', value: 6.1 }, { time: '21:00', value: 4.8 }, { time: '24:00', value: 7.2 },
];

const statusIcon = { completed: CheckCircle2, pending: Clock, failed: XCircle };

export default function DepositsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const displayed = deposits.filter(d => {
    const matchSearch = d.user.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <AdminHeader title="Deposits" subtitle="Incoming platform deposits" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Today\'s Total',  val: '$12.4M', sub: '+18.5% vs yesterday', color: 'text-green-400' },
          { label: 'Completed',       val: '2,841',  sub: '94.2% success rate',  color: 'text-green-400' },
          { label: 'Pending',         val: '184',    sub: 'Awaiting confirmation',color: 'text-yellow-400'},
          { label: 'Failed',          val: '23',     sub: '0.76% failure rate',  color: 'text-red-400'  },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Deposit Volume</h3>
            <p className="text-xs text-gray-500">Today — hourly (millions USD)</p>
          </div>
          <span className="text-sm font-bold text-green-400">$12.4M total</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#depGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Filters */}
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
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Deposit ID', 'User', 'Amount', 'Asset', 'Method', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {displayed.map((d, i) => {
                const Icon = statusIcon[d.status] || Clock;
                return (
                  <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/[0.02] transition-all">
                    <td className="px-5 py-4 text-xs font-mono text-gray-500">{d.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">
                          {d.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-white">{d.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-black text-green-400">+{d.amount}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-medium">{d.coin}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{d.method}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(d.status)}`}>
                        <Icon className="w-3 h-3" />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{d.time}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
