'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, User, CheckCircle2, Trash2, Plus } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

const sent = [
  { id: 'NTF-821', title: 'System Maintenance',       body: 'Scheduled maintenance on Feb 5 at 2 AM UTC. Services may be unavailable for 30 minutes.', target: 'All Users',    sent: '2 hr ago',   reach: '248,392', opens: '41.2%' },
  { id: 'NTF-820', title: 'New Feature: Crypto Cards', body: 'SwiftBit Visa cards are now available! Apply now and earn up to 2% cashback on every spend.', target: 'Verified KYC', sent: '1 day ago',  reach: '184,521', opens: '58.7%' },
  { id: 'NTF-819', title: 'BTC Price Alert',           body: 'Bitcoin has surged past $67,000. Your portfolio is up 8.2% today.', target: 'BTC Holders', sent: '2 days ago', reach: '92,840',  opens: '73.4%' },
  { id: 'NTF-818', title: 'Withdrawal Processed',      body: 'Your $8,200 ETH withdrawal has been successfully processed and sent.', target: 'Individual', sent: '3 days ago', reach: '1',       opens: '100%'  },
];

const templates = [
  { title: 'Price Alert',       icon: '📈', desc: 'Notify users when their assets hit a target price.' },
  { title: 'Transaction Update',icon: '✅', desc: 'Confirm completed deposits, withdrawals, or swaps.' },
  { title: 'Security Alert',    icon: '🔒', desc: 'Alert users about suspicious account activity.'    },
  { title: 'Promotion',         icon: '🎁', desc: 'Announce rewards, cashback offers, or bonuses.'    },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState('sent');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');

  return (
    <div>
      <AdminHeader title="Notifications" subtitle="Push and in-app notification management" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sent This Week', val: '12',    color: 'text-white',     sub: 'Notifications pushed'  },
          { label: 'Total Reach',    val: '1.8M',  color: 'text-green-400', sub: 'User notifications'    },
          { label: 'Avg Open Rate',  val: '56.2%', color: 'text-blue-400',  sub: 'Above industry avg'    },
          { label: 'Unsubscribed',   val: '0.8%',  color: 'text-yellow-400',sub: 'Opt-out rate'          },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Left: sent history */}
        <div>
          <div className="flex gap-1 glass rounded-xl p-1 mb-4 w-fit">
            {['sent', 'scheduled'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {sent.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{n.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                    </div>
                  </div>
                  <button className="text-gray-700 hover:text-red-400 transition-colors shrink-0 mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {n.target}</span>
                  <span>Reach: <span className="text-gray-400">{n.reach}</span></span>
                  <span>Opens: <span className="text-green-400 font-medium">{n.opens}</span></span>
                  <span className="ml-auto">{n.sent}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: compose + templates */}
        <div className="space-y-4">
          {/* Compose form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-green-400" /> Compose Notification
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title..."
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Message</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Notification body..." rows={3}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Target Audience</label>
                <select value={target} onChange={e => setTarget(e.target.value)}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500/40 bg-transparent appearance-none">
                  <option value="all" style={{background:'#0d1117'}}>All Users (248,392)</option>
                  <option value="kyc" style={{background:'#0d1117'}}>Verified KYC (184,521)</option>
                  <option value="active" style={{background:'#0d1117'}}>Active Traders (98,240)</option>
                  <option value="btc" style={{background:'#0d1117'}}>BTC Holders (92,840)</option>
                </select>
              </div>
              <button className="w-full btn-neon text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Notification
              </button>
            </div>
          </motion.div>

          {/* Templates */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <h3 className="font-bold text-white mb-4">Quick Templates</h3>
            <div className="space-y-2">
              {templates.map(t => (
                <button key={t.title} onClick={() => setTitle(t.title)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left border border-white/4 hover:border-white/10">
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-gray-600">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
