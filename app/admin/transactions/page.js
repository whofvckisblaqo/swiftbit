'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { adminTransactions } from '@/lib/data';
import { getStatusColor, getTxColor } from '@/lib/utils';

const allTx = [
  ...adminTransactions,
  { id: 'TXN-84915', user: 'James Wilson', type: 'buy', amount: '$4,800', coin: 'ETH', status: 'completed', time: '1 hour ago' },
  { id: 'TXN-84914', user: 'Liu Wei', type: 'deposit', amount: '$31,200', coin: 'USDT', status: 'pending', time: '2 hours ago' },
  { id: 'TXN-84913', user: 'Amara Osei', type: 'sell', amount: '$2,100', coin: 'SOL', status: 'completed', time: '3 hours ago' },
  { id: 'TXN-84912', user: 'Ivan Petrov', type: 'withdrawal', amount: '$18,500', coin: 'BTC', status: 'failed', time: '4 hours ago' },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const displayed = allTx.filter(tx => {
    const matchSearch = tx.user.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <AdminHeader title="Transactions" subtitle="All platform transactions" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Volume', val: '$1.2B', color: 'text-white' },
          { label: 'Completed', val: '98,421', color: 'text-green-400' },
          { label: 'Pending', val: '1,284', color: 'text-yellow-400' },
          { label: 'Failed', val: '342', color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or TX ID..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none bg-transparent appearance-none min-w-[160px]">
          {['all', 'deposit', 'withdrawal', 'buy', 'sell', 'swap'].map(t => (
            <option key={t} value={t} style={{ background: '#0d1117' }} className="capitalize">{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <button className="glass border border-white/10 rounded-xl px-5 py-2.5 text-sm text-gray-400 flex items-center gap-2 hover:text-white transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['TX ID', 'User', 'Type', 'Amount', 'Asset', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {displayed.map((tx, i) => (
                <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/2 transition-all">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{tx.id}</td>
                  <td className="px-5 py-4 text-sm text-white font-medium">{tx.user}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getTxColor(tx.type)}`}>{tx.type}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-white">{tx.amount}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{tx.coin}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{tx.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
