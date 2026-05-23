'use client';
import { motion } from 'framer-motion';
import AdminHeader from '@/components/admin/AdminHeader';
import { cryptoAssets } from '@/lib/data';

export default function WalletsPage() {
  const totalHoldings = cryptoAssets.reduce((acc, c) => acc + c.usdValue * 8420, 0);

  return (
    <div>
      <AdminHeader title="Wallets" subtitle="Platform wallet holdings overview" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Hot Wallet', val: '$284M', pct: '10%', color: 'text-yellow-400' },
          { label: 'Cold Storage', val: '$2.56B', pct: '90%', color: 'text-green-400' },
          { label: 'Staking Pool', val: '$142M', pct: '5%', color: 'text-purple-400' },
          { label: 'Liquidity', val: '$98M', pct: '3.4%', color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            <div className="text-xs text-gray-700 mt-0.5">{s.pct} of AUM</div>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white">Asset Holdings</h3>
          <span className="text-xs text-gray-500">Total: ${(totalHoldings / 1e9).toFixed(2)}B</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Asset', 'Price', '24h Change', 'Hot Wallet', 'Cold Storage', 'Total Value', 'Portfolio %'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {cryptoAssets.map((c, i) => {
                const hotAmt = c.usdValue * 842;
                const coldAmt = c.usdValue * 7578;
                const total = hotAmt + coldAmt;
                const pct = ((total / totalHoldings) * 100).toFixed(1);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/2 transition-all">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{c.symbol}</div>
                          <div className="text-xs text-gray-600">{c.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white font-medium">
                      ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${c.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {c.change24h >= 0 ? '+' : ''}{c.change24h}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-yellow-400">${(hotAmt / 1e6).toFixed(2)}M</td>
                    <td className="px-5 py-4 text-sm text-green-400">${(coldAmt / 1e6).toFixed(2)}M</td>
                    <td className="px-5 py-4 text-sm font-bold text-white">${(total / 1e6).toFixed(2)}M</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                        </div>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </td>
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
