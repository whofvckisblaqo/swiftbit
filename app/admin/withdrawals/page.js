'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

const localWithdrawals = [
  { id: 'WD-7420', user: 'Mohammed Al-Rashid', amount: '$25,000', coin: 'BTC',  address: '1A1zP...gY9', status: 'completed', risk: 'low',    time: '22 min ago' },
  { id: 'WD-7419', user: 'Ivan Petrov',         amount: '$18,500', coin: 'BTC',  address: '3J98t...1aX', status: 'failed',    risk: 'high',   time: '1 hr ago'   },
  { id: 'WD-7418', user: 'Emma Williams',        amount: '$3,400',  coin: 'USDT', address: '0x2c4f...B8d', status: 'completed', risk: 'low',    time: '2 hr ago'   },
  { id: 'WD-7416', user: 'Carlos Mendez',        amount: '$6,800',  coin: 'SOL',  address: '5xK9m...Pz7', status: 'completed', risk: 'low',    time: '4 hr ago'   },
];

const riskColor = { low: 'text-green-400 bg-green-500/10', medium: 'text-yellow-400 bg-yellow-500/10', high: 'text-red-400 bg-red-500/10' };

export default function WithdrawalsPage() {
  const { withdrawalQueue, approveWithdrawal, rejectWithdrawal } = useAdminStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const allWithdrawals = [...withdrawalQueue, ...localWithdrawals];

  const displayed = allWithdrawals.filter(w => {
    const matchSearch = w.user.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pending = allWithdrawals.filter(w => w.status === 'pending');

  const handleApprove = (id, user) => {
    approveWithdrawal(id);
    toast({ message: `Withdrawal ${id} approved for ${user}`, type: 'success' });
  };

  const handleReject = (id, user) => {
    rejectWithdrawal(id);
    toast({ message: `Withdrawal ${id} rejected`, type: 'error' });
  };

  return (
    <div>
      <AdminHeader title="Withdrawals" subtitle="Outgoing withdrawal requests" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Total",   val: '$8.9M',          sub: 'Processed today',       color: 'text-white'       },
          { label: 'Pending Review',  val: pending.length,   sub: 'Awaiting approval',     color: 'text-yellow-400'  },
          { label: 'High Risk',       val: allWithdrawals.filter(w => w.risk === 'high').length, sub: 'Flagged for review', color: 'text-red-400' },
          { label: 'Avg Process Time',val: '4.2 min',        sub: 'Auto-approved',         color: 'text-green-400'   },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {pending.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 glass rounded-xl p-4 border border-yellow-500/25 mb-5 bg-yellow-500/5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300 font-medium">
            {pending.length} withdrawal{pending.length > 1 ? 's' : ''} pending approval — review required.
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
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>
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
              {displayed.map((w, i) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{w.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-white">{w.user}</td>
                  <td className="px-5 py-4 text-sm font-black text-red-400">-{w.amount}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{w.coin}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-600">{w.address}</td>
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
                        <button onClick={() => handleApprove(w.id, w.user)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-all font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleReject(w.id, w.user)}
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
      </motion.div>
    </div>
  );
}
