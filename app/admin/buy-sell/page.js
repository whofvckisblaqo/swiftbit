'use client';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getStatusColor, getTxColor } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { cryptoAssets } from '@/lib/data';

const orders = [
  { id: 'ORD-5521', user: 'Alex Johnson',      type: 'buy',  coin: 'BTC',  amount: '$3,534',  qty: '0.0521 BTC', price: '$67,842', status: 'completed', time: '2 min ago'  },
  { id: 'ORD-5520', user: 'Sarah Chen',        type: 'sell', coin: 'ETH',  amount: '$5,314',  qty: '1.5 ETH',    price: '$3,542',  status: 'completed', time: '8 min ago'  },
  { id: 'ORD-5519', user: 'Priya Patel',       type: 'buy',  coin: 'SOL',  amount: '$1,824',  qty: '10 SOL',     price: '$182.4',  status: 'pending',   time: '15 min ago' },
  { id: 'ORD-5518', user: 'Carlos Mendez',     type: 'buy',  coin: 'BNB',  amount: '$1,455',  qty: '2.5 BNB',    price: '$582.3',  status: 'completed', time: '22 min ago' },
  { id: 'ORD-5517', user: 'Mohammed Al-Rashid',type: 'sell', coin: 'ADA',  amount: '$817',    qty: '1,695 ADA',  price: '$0.482',  status: 'failed',    time: '35 min ago' },
  { id: 'ORD-5516', user: 'Emma Williams',     type: 'buy',  coin: 'DOGE', amount: '$2,451',  qty: '15,000 DOGE',price: '$0.163',  status: 'completed', time: '1 hr ago'   },
];

const volumeData = [
  { coin: 'BTC',  buy: 4.2, sell: 2.8 },
  { coin: 'ETH',  buy: 2.8, sell: 1.9 },
  { coin: 'SOL',  buy: 1.4, sell: 0.8 },
  { coin: 'BNB',  buy: 0.9, sell: 0.6 },
  { coin: 'DOGE', buy: 0.6, sell: 0.4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-white/10 text-xs">
      <p className="font-semibold text-gray-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: ${p.value}M</p>
      ))}
    </div>
  );
};

export default function BuySellPage() {
  const totalBuy  = orders.filter(o => o.type === 'buy').length;
  const totalSell = orders.filter(o => o.type === 'sell').length;

  return (
    <div>
      <AdminHeader title="Buy / Sell" subtitle="All market order activity" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Buy Orders Today',   val: '18,420', color: 'text-green-400', sub: '$42.1M volume'    },
          { label: 'Sell Orders Today',  val: '12,840', color: 'text-red-400',   sub: '$28.4M volume'    },
          { label: 'Avg Order Size',     val: '$2,280', color: 'text-white',      sub: 'Across all pairs' },
          { label: 'Conversion Rate',    val: '34.8%',  color: 'text-blue-400',  sub: 'Visit → Trade'    },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Volume chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 border border-white/5 mb-6">
        <h3 className="font-bold text-white mb-1">Buy vs Sell Volume by Asset</h3>
        <p className="text-xs text-gray-500 mb-4">Today's trading volume (millions USD)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={volumeData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="coin" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={v => <span style={{ color: '#6b7280', fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="buy"  name="Buy"  fill="#22c55e" radius={[4,4,0,0]} opacity={0.85} />
            <Bar dataKey="sell" name="Sell" fill="#ef4444" radius={[4,4,0,0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Orders table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white">Recent Orders</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>Buy: {totalBuy}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Sell: {totalSell}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'User', 'Type', 'Asset', 'Amount', 'Quantity', 'Price', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">{o.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-white">{o.user}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${getTxColor(o.type)}`}>
                      {o.type === 'buy' ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                      {o.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{o.coin}</td>
                  <td className="px-5 py-4 text-sm font-bold text-white">{o.amount}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 font-mono">{o.qty}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{o.price}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">{o.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
