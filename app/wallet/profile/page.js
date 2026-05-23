'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Bell, CreditCard, BookUser, ChevronRight, LogOut,
  CheckCircle2, Star, Settings, HelpCircle, Fingerprint
} from 'lucide-react';
import { useAuth, useNotifs, useToast } from '@/store/useAppStore';

const menuSections = [
  { section: 'Account', items: [
    { icon: Shield,      label: 'KYC Verification', desc: 'Verified ✓',      color: '#22c55e' },
    { icon: CreditCard,  label: 'Payment Methods',  desc: '3 cards linked',  color: '#6366f1' },
    { icon: BookUser,    label: 'Address Book',      desc: '12 saved',        color: '#f59e0b' },
  ]},
  { section: 'Security', items: [
    { icon: Fingerprint, label: 'Biometric Auth',   desc: 'Enabled',         color: '#22c55e' },
    { icon: Shield,      label: '2-Factor Auth',    desc: 'Enabled',         color: '#22c55e' },
    { icon: Settings,    label: 'Security Settings', desc: '',               color: '#6b7280' },
  ]},
  { section: 'Preferences', items: [
    { icon: Bell,        label: 'Notifications',    desc: 'All on',          color: '#f59e0b' },
    { icon: Star,        label: 'Referral Program', desc: 'Earn $50/referral', color: '#ec4899' },
    { icon: HelpCircle,  label: 'Help & Support',   desc: '',                color: '#6b7280' },
  ]},
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notifications, markAllRead } = useNotifs();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({ message: 'Signed out successfully', type: 'info' });
    router.push('/login');
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-14 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">Profile</h1>
        <p className="text-sm text-gray-500">Account & settings</p>
      </div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 mb-5 relative overflow-hidden border-glow">
        <div className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(ellipse at top right, #22c55e 0%, transparent 70%)' }} />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400/40 to-purple-500/40 border border-white/15 flex items-center justify-center text-2xl font-black text-white">
              {user?.avatar || 'AJ'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-[#080b0f] flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" fill="white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{user?.name || 'Alex Johnson'}</h2>
            <p className="text-sm text-gray-500">{user?.email || 'alex@example.com'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">✓ Verified</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">★ VIP Level 2</span>
            </div>
          </div>
          <button className="glass border border-white/10 rounded-xl p-2 hover:border-white/20 transition-all">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5">
          {[
            { label: 'Portfolio', val: '$67,894' },
            { label: 'Trades',    val: '284'     },
            { label: 'Referrals', val: '12'      },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-base font-black text-white">{s.val}</div>
              <div className="text-xs text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass rounded-2xl overflow-hidden mb-5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Notifications</span>
          <button onClick={markAllRead} className="text-xs text-green-400 hover:text-green-300 transition-colors">Mark all read</button>
        </div>
        <div className="divide-y divide-white/[0.04] max-h-56 overflow-y-auto">
          {notifications.slice(0, 4).map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-green-500/3' : ''}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-green-400' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{n.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{n.body}</div>
              </div>
              <span className="text-[10px] text-gray-700 shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KYC status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="glass rounded-2xl p-4 mb-5 border border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">KYC Fully Verified</div>
            <div className="text-xs text-gray-500">Member since {user?.joinedDate || 'Jan 12, 2024'}</div>
          </div>
          <span className="text-xs text-green-400 font-medium">Level {user?.kycLevel || 3}</span>
        </div>
        <div className="mt-3 flex gap-2">
          {['Identity', 'Address', 'Face ID'].map(step => (
            <div key={step} className="flex-1 text-center">
              <div className="w-full h-1 rounded-full bg-green-400 mb-1" />
              <span className="text-[10px] text-green-400">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu sections */}
      {menuSections.map((section, si) => (
        <motion.div key={section.section} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.05 }} className="glass rounded-2xl overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{section.section}</span>
          </div>
          {section.items.map(item => (
            <button key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-all border-b border-white/[0.03] last:border-0 text-left">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{item.label}</div>
                {item.desc && <div className="text-xs text-gray-600">{item.desc}</div>}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          ))}
        </motion.div>
      ))}

      {/* Sign out */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>

      <div className="text-center text-xs text-gray-700 pb-4">SwiftBit v2.4.1 · © 2024</div>
    </div>
  );
}
