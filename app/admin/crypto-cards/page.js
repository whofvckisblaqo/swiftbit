'use client';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getStatusColor } from '@/lib/utils';

const cards = [
  { id: 'SB-4821', user: 'Alex Johnson',       tier: 'Black',    limit: '$50,000', spent: '$12,480', cashback: '$124.80', status: 'active',   issued: 'Jan 2, 2024'    },
  { id: 'SB-4820', user: 'Sarah Chen',         tier: 'Gold',     limit: '$25,000', spent: '$8,200',  cashback: '$41.00',  status: 'active',   issued: 'Dec 28, 2023'   },
  { id: 'SB-4819', user: 'Mohammed Al-Rashid', tier: 'Platinum', limit: '$100,000',spent: '$45,200', cashback: '$678.00', status: 'active',   issued: 'Dec 15, 2023'   },
  { id: 'SB-4818', user: 'Emma Williams',      tier: 'Standard', limit: '$5,000',  spent: '$1,240',  cashback: '$6.20',   status: 'suspended',issued: 'Nov 22, 2023'   },
  { id: 'SB-4817', user: 'Carlos Mendez',      tier: 'Gold',     limit: '$25,000', spent: '$9,800',  cashback: '$49.00',  status: 'active',   issued: 'Nov 10, 2023'   },
  { id: 'SB-4816', user: 'Priya Patel',        tier: 'Black',    limit: '$50,000', spent: '$28,400', cashback: '$284.00', status: 'pending',  issued: 'Jan 10, 2024'   },
];

const tierColor = {
  Standard: 'text-gray-400  bg-gray-500/10  border-gray-500/20',
  Gold:     'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Platinum: 'text-blue-400  bg-blue-500/10  border-blue-500/20',
  Black:    'text-white     bg-white/10     border-white/20',
};

function CardVisual({ tier, user, id }) {
  const colors = {
    Black:    'from-gray-900 to-black border-white/20',
    Platinum: 'from-blue-900/60 to-indigo-900/60 border-blue-500/30',
    Gold:     'from-yellow-900/50 to-amber-900/50 border-yellow-500/30',
    Standard: 'from-gray-800 to-gray-900 border-white/10',
  };
  return (
    <div className={`w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-br ${colors[tier]} border p-4 relative overflow-hidden`}>
      <div className="absolute top-3 right-3 text-right">
        <div className="text-[10px] font-black text-white/80">SWIFT<span className="text-green-400">BIT</span></div>
      </div>
      <div className="absolute bottom-3 left-4 right-4">
        <div className="text-[11px] font-mono text-white/50 mb-1">{id}</div>
        <div className="text-xs font-bold text-white/80 truncate">{user}</div>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-1">
        <div className="w-5 h-5 rounded-full bg-red-500/80" />
        <div className="w-5 h-5 rounded-full bg-yellow-400/80 -ml-2" />
      </div>
    </div>
  );
}

export default function CryptoCardsPage() {
  return (
    <div>
      <AdminHeader title="Crypto Cards" subtitle="SwiftBit Visa card management" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Cards',    val: cards.filter(c=>c.status==='active').length,    color: 'text-green-400', sub: 'Across all tiers'   },
          { label: 'Total Spent',     val: '$105.3K',                                      color: 'text-white',     sub: 'This month'         },
          { label: 'Cashback Paid',   val: '$1,183',                                       color: 'text-yellow-400',sub: 'Returned to users'  },
          { label: 'Pending Approval',val: cards.filter(c=>c.status==='pending').length,   color: 'text-blue-400',  sub: 'Awaiting KYC check' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Card previews */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 border border-white/5 mb-6">
        <h3 className="font-bold text-white mb-4">Card Tier Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Standard','Gold','Platinum','Black'].map(tier => {
            const count = cards.filter(c => c.tier === tier).length;
            return (
              <div key={tier}>
                <CardVisual tier={tier} user="SwiftBit Holder" id="•••• •••• 4821" />
                <div className="mt-2 text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tierColor[tier]}`}>{tier}</span>
                  <p className="text-xs text-gray-600 mt-1">{count} card{count !== 1 ? 's' : ''} issued</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Cards table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Card ID', 'Holder', 'Tier', 'Limit', 'Spent', 'Cashback', 'Status', 'Issued'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {cards.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-mono text-gray-400">{c.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-white">{c.user}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${tierColor[c.tier]}`}>{c.tier}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{c.limit}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{c.spent}</td>
                  <td className="px-5 py-4 text-sm text-yellow-400 font-medium">{c.cashback}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(c.status)}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">{c.issued}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
