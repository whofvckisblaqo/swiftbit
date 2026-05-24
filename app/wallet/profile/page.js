'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Bell, CreditCard, BookUser, ChevronRight, LogOut,
  CheckCircle2, Star, Settings, HelpCircle, Fingerprint,
  X, Eye, EyeOff, Copy, Check, Lock, User as UserIcon,
  Mail, Phone, MessageCircle, FileText, RefreshCw, Edit3,
} from 'lucide-react';
import { useAuth, useNotifs, useToast, useWallet } from '@/store/useAppStore';

/* ── Edit Profile Modal ── */
function EditProfileModal({ user, token, onClose, onSave }) {
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: 'Profile updated', type: 'success' });
      onSave(data.user);
      onClose();
    } catch (e) {
      toast({ message: e.message || 'Update failed', type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-sm glass-dark rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Edit Profile</h3>
          <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Email (read-only)</label>
            <input value={user?.email} readOnly
              className="w-full glass border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-sm bg-transparent cursor-not-allowed" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving || !name.trim()}
            className="flex-1 py-3 rounded-xl btn-neon text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Change Password Modal ── */
function ChangePasswordModal({ token, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (form.next !== form.confirm) { toast({ message: 'Passwords do not match', type: 'error' }); return; }
    if (form.next.length < 8)      { toast({ message: 'Min 8 characters', type: 'error' }); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: 'Password changed successfully', type: 'success' });
      onClose();
    } catch (e) {
      toast({ message: e.message || 'Change failed', type: 'error' });
    } finally { setSaving(false); }
  };

  const field = (key, label, showKey) => (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <div className="relative">
        <input type={show[showKey] ? 'text' : 'password'} value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full glass border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        {showKey && (
          <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-sm glass-dark rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Change Password</h3>
          <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          {field('current', 'Current Password', 'current')}
          {field('next', 'New Password', 'next')}
          {field('confirm', 'Confirm New Password', null)}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.current || !form.next || !form.confirm}
            className="flex-1 py-3 rounded-xl btn-neon text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            Update
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Referral Modal ── */
function ReferralModal({ user, onClose }) {
  const [copied, setCopied] = useState(false);
  const code = `SWB-${(user?.id || user?._id || 'XXXXX').slice(-6).toUpperCase()}`;
  const link = `https://swiftbit.app/join?ref=${code}`;

  const copy = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-sm glass-dark rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Referral Program</h3>
          <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
        </div>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center mx-auto mb-3">
            <Star className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-white font-bold mb-1">Earn $50 per referral</p>
          <p className="text-xs text-gray-500 mb-5">Share your link. When they sign up and trade, you both earn.</p>
          <div className="glass rounded-xl p-3 mb-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Your referral code</p>
            <p className="text-lg font-black text-green-400 tracking-widest">{code}</p>
          </div>
          <div className="glass rounded-xl p-3 mb-4 flex items-center gap-2">
            <p className="flex-1 text-xs font-mono text-gray-400 truncate text-left">{link}</p>
            <button onClick={copy} className={`flex-shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300 hover:text-white'}`}>
              {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[{ label: 'Referrals', val: '0' }, { label: 'Earnings', val: '$0' }, { label: 'Pending', val: '$0' }].map(s => (
              <div key={s.label} className="glass rounded-xl p-2.5">
                <div className="text-sm font-bold text-white">{s.val}</div>
                <div className="text-[10px] text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Help Modal ── */
function HelpModal({ onClose }) {
  const faqs = [
    { q: 'How do I verify my identity?', a: 'Go to Profile → KYC Verification and follow the steps to upload your ID.' },
    { q: 'Why is my transaction pending?', a: 'Transactions are reviewed by our team before processing. This usually takes 1–24 hours.' },
    { q: 'How long do deposits take?', a: 'Crypto deposits confirm after required blockchain confirmations, usually under 30 minutes.' },
    { q: 'Can I change my email?', a: 'Email changes require identity verification. Contact support to begin the process.' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-sm glass-dark rounded-2xl border border-white/10 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Help & Support</h3>
          <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-3 mb-5">
          {[
            { icon: Mail, label: 'Email', val: 'swiftbitsupport@outlook.com', color: '#6366f1' },
            { icon: MessageCircle, label: 'Live Chat', val: 'Available 24/7', color: '#22c55e' },
          ].map(c => (
            <div key={c.label} className="flex-1 glass rounded-xl p-3 text-center border border-white/5">
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${c.color}15` }}>
                <c.icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
              <p className="text-[10px] text-gray-500">{c.label}</p>
              <p className="text-xs text-white font-medium mt-0.5">{c.val}</p>
            </div>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">FAQ</p>
        <div className="space-y-3">
          {faqs.map(f => (
            <div key={f.q} className="glass rounded-xl p-4 border border-white/5">
              <p className="text-xs font-semibold text-white mb-1">{f.q}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main page ── */
export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuth();
  const { notifications, markAllRead, unreadCount } = useNotifs();
  const { totalBalance, transactions } = useWallet();
  const { toast } = useToast();

  const [modal, setModal] = useState(null); // 'edit' | 'password' | 'referral' | 'help'
  const [biometric, setBiometric] = useState(true);
  const [twofa, setTwofa] = useState(true);
  const [txCount, setTxCount] = useState(transactions.length);

  useEffect(() => {
    if (!token) return;
    fetch('/api/transactions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.transactions) setTxCount(d.transactions.length); })
      .catch(() => {});
  }, [token]);

  const handleLogout = () => {
    logout();
    toast({ message: 'Signed out successfully', type: 'success' });
    router.push('/login');
  };

  const toggleBiometric = () => {
    const next = !biometric;
    setBiometric(next);
    toast({ message: `Biometric auth ${next ? 'enabled' : 'disabled'}`, type: next ? 'success' : 'info' });
  };

  const toggle2FA = () => {
    const next = !twofa;
    setTwofa(next);
    toast({ message: `2-Factor auth ${next ? 'enabled' : 'disabled'}`, type: next ? 'success' : 'info' });
  };

  const kycStatus = user?.kycStatus || 'unverified';
  const kycColor = kycStatus === 'verified' ? '#22c55e' : kycStatus === 'pending' ? '#f59e0b' : '#ef4444';
  const kycLabel = kycStatus === 'verified' ? 'KYC Fully Verified' : kycStatus === 'pending' ? 'Verification Pending' : kycStatus === 'rejected' ? 'Verification Rejected' : 'Identity Not Verified';
  const kycDesc = kycStatus === 'verified' ? `Member since ${user?.joinedDate || ''}` : kycStatus === 'pending' ? 'Under review · 1–2 business days' : kycStatus === 'rejected' ? 'Resubmit required' : 'Complete KYC to unlock all features';

  const menuSections = [
    { section: 'Account', items: [
      { icon: Shield,     label: 'KYC Verification',  desc: kycStatus === 'verified' ? 'Verified ✓' : kycStatus === 'pending' ? 'Pending review' : kycStatus === 'rejected' ? 'Rejected — resubmit' : 'Not verified', color: '#22c55e', href: '/wallet/kyc' },
      { icon: Edit3,      label: 'Edit Profile',       desc: 'Change your name',                          color: '#6366f1', action: () => setModal('edit') },
      { icon: Lock,       label: 'Change Password',    desc: 'Update your password',                      color: '#f59e0b', action: () => setModal('password') },
    ]},
    { section: 'Security', items: [
      { icon: Fingerprint, label: 'Biometric Auth',   desc: biometric ? 'Enabled' : 'Disabled',     color: biometric ? '#22c55e' : '#6b7280', toggle: toggleBiometric, toggled: biometric },
      { icon: Shield,      label: '2-Factor Auth',    desc: twofa ? 'Enabled' : 'Disabled',          color: twofa ? '#22c55e' : '#6b7280',    toggle: toggle2FA,       toggled: twofa },
    ]},
    { section: 'Preferences', items: [
      { icon: Bell,        label: 'Notifications',    desc: unreadCount > 0 ? `${unreadCount} unread` : 'All read', color: '#f59e0b', action: markAllRead },
      { icon: Star,        label: 'Referral Program', desc: 'Earn $50/referral',                     color: '#ec4899', action: () => setModal('referral') },
      { icon: HelpCircle,  label: 'Help & Support',   desc: 'FAQ & contact',                         color: '#6b7280', action: () => setModal('help') },
    ]},
  ];

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
              {user?.avatar || 'SB'}
            </div>
            {kycStatus === 'verified' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-[#080b0f] flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" fill="white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {kycStatus === 'verified'
                ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">✓ Verified</span>
                : kycStatus === 'pending'
                  ? <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">⏳ KYC Pending</span>
                  : <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium">⚠ Unverified</span>}
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">★ VIP {user?.vipLevel || 0}</span>
            </div>
          </div>
          <button onClick={() => setModal('edit')}
            className="glass border border-white/10 rounded-xl p-2 hover:border-green-500/30 hover:text-green-400 text-gray-400 transition-all flex-shrink-0">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5">
          {[
            { label: 'Portfolio',  val: `$${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
            { label: 'Trades',     val: txCount },
            { label: 'Joined',     val: user?.joinedDate?.split(',')[0] || '—' },
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">{unreadCount}</span>
            )}
          </div>
          <button onClick={markAllRead} className="text-xs text-green-400 hover:text-green-300 transition-colors">Mark all read</button>
        </div>
        <div className="divide-y divide-white/[0.04] max-h-48 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-gray-600">No notifications</div>
          ) : notifications.slice(0, 5).map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-green-500/[0.03]' : ''}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-green-400' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{n.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</div>
              </div>
              <span className="text-[10px] text-gray-700 shrink-0 mt-0.5">{n.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KYC status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="glass rounded-2xl p-4 mb-5" style={{ border: `1px solid ${kycColor}30` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${kycColor}15`, border: `1px solid ${kycColor}25` }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: kycColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{kycLabel}</div>
            <div className="text-xs text-gray-500">{kycDesc}</div>
          </div>
          {kycStatus !== 'verified' ? (
            <Link href="/wallet/kyc"
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
              style={{ background: `${kycColor}15`, color: kycColor, border: `1px solid ${kycColor}30` }}>
              {kycStatus === 'rejected' ? 'Resubmit' : kycStatus === 'pending' ? 'View' : 'Verify'}
            </Link>
          ) : (
            <span className="text-xs font-semibold flex-shrink-0" style={{ color: kycColor }}>Level {user?.kycLevel || 1}</span>
          )}
        </div>
      </motion.div>

      {/* Menu sections */}
      {menuSections.map((section, si) => (
        <motion.div key={section.section} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.05 }} className="glass rounded-2xl overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{section.section}</span>
          </div>
          {section.items.map(item => {
            const Row = ({ children }) => item.href ? (
              <Link href={item.href}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-all border-b border-white/[0.03] last:border-0">
                {children}
              </Link>
            ) : (
              <button onClick={item.toggle || item.action}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-all border-b border-white/[0.03] last:border-0 text-left">
                {children}
              </button>
            );
            return (
              <Row key={item.label}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  {item.desc && <div className="text-xs text-gray-600 mt-0.5">{item.desc}</div>}
                </div>
                {item.toggle ? (
                  <div className={`w-10 h-5 rounded-full transition-all flex-shrink-0 relative ${item.toggled ? 'bg-green-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.toggled ? 'left-5' : 'left-0.5'}`} />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-700 flex-shrink-0" />
                )}
              </Row>
            );
          })}
        </motion.div>
      ))}

      {/* Sign out */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-8">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </motion.div>

      <div className="text-center text-xs text-gray-700 pb-4">SwiftBit v2.4.1 · © 2025</div>

      {/* Modals */}
      <AnimatePresence>
        {modal === 'edit' && (
          <EditProfileModal user={user} token={token} onClose={() => setModal(null)}
            onSave={(updated) => { updateUser(updated); }} />
        )}
        {modal === 'password' && <ChangePasswordModal token={token} onClose={() => setModal(null)} />}
        {modal === 'referral' && <ReferralModal user={user} onClose={() => setModal(null)} />}
        {modal === 'help' && <HelpModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
