'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, ShieldOff, ShieldCheck, RefreshCw, Wallet, X, Save } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast, useAuth } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

const COINS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA'];

function WalletModal({ user, token, onClose, onSave }) {
  const [addresses, setAddresses] = useState({ ...user.walletAddresses });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ walletAddresses: addresses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: `Wallet addresses updated for ${user.name}`, type: 'success' });
      onSave(data.user);
      onClose();
    } catch (e) {
      toast({ message: e.message || 'Save failed', type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-lg glass-dark rounded-2xl border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Wallet Addresses</h3>
            <p className="text-xs text-gray-500 mt-0.5">{user.name} · {user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed">
          Assign deposit addresses for each coin. Users will see these on their Receive page.
        </p>

        <div className="space-y-3">
          {COINS.map(coin => (
            <div key={coin}>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{coin} Address</label>
              <input
                value={addresses[coin] || ''}
                onChange={e => setAddresses(prev => ({ ...prev, [coin]: e.target.value }))}
                placeholder={`Enter ${coin} deposit address...`}
                className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-gray-700 focus:outline-none focus:border-green-500/40 transition-all"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl btn-neon text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Addresses</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UsersPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);
  const [walletUser, setWalletUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data.users || []);
    } catch { toast({ message: 'Failed to load users', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (u) => {
    const next = u.status === 'active' ? 'suspended' : 'active';
    try {
      await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: next }),
      });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: next } : x));
      toast({ message: `${u.name} has been ${next}`, type: next === 'active' ? 'success' : 'warning' });
    } catch { toast({ message: 'Action failed', type: 'error' }); }
    setMenuOpen(null);
  };

  const displayed = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const hasAddresses = (u) => u.walletAddresses && COINS.some(c => u.walletAddresses[c]);

  return (
    <div onClick={() => setMenuOpen(null)}>
      <AdminHeader title="Users" subtitle={`${users.length} registered users`} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', val: users.length, color: 'text-white' },
          { label: 'Active', val: users.filter(u => u.status === 'active').length, color: 'text-green-400' },
          { label: 'Suspended', val: users.filter(u => u.status === 'suspended').length, color: 'text-red-400' },
          { label: 'KYC Pending', val: users.filter(u => u.kycStatus === 'pending').length, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className={`text-xl font-black ${s.color}`}>{loading ? '—' : s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-green-500/40 bg-transparent appearance-none min-w-[140px]">
          <option value="all" style={{ background: '#0d1117' }}>All Status</option>
          <option value="active" style={{ background: '#0d1117' }}>Active</option>
          <option value="suspended" style={{ background: '#0d1117' }}>Suspended</option>
        </select>
        <button onClick={fetchUsers} className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['User', 'Role', 'KYC', 'Status', 'Wallets', 'Joined', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">Loading users...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">No users found</td></tr>
              ) : displayed.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }} className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.avatar || u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{u.name}</div>
                        <div className="text-xs text-gray-600">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${u.role === 'admin' ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 bg-gray-500/10'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(u.kycStatus === 'verified' ? 'completed' : u.kycStatus === 'pending' ? 'pending' : 'failed')}`}>{u.kycStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(u.status)}`}>{u.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={e => { e.stopPropagation(); setWalletUser(u); }}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium ${hasAddresses(u) ? 'text-green-400 bg-green-500/10 border-green-500/25 hover:bg-green-500/20' : 'text-gray-500 glass border-white/10 hover:text-white hover:border-white/20'}`}>
                      <Wallet className="w-3.5 h-3.5" />
                      {hasAddresses(u) ? 'Assigned' : 'Assign'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{u.joinedDate}</td>
                  <td className="px-5 py-4 relative">
                    {u.role !== 'admin' && (
                      <>
                        <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === u.id ? null : u.id); }}
                          className="p-1.5 rounded-lg glass border border-white/5 text-gray-600 hover:text-gray-300 hover:border-white/15 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {menuOpen === u.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}
                              className="absolute right-5 top-12 z-20 glass-dark border border-white/10 rounded-xl overflow-hidden min-w-[160px] shadow-xl">
                              <button onClick={() => handleToggle(u)}
                                className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-white/5 ${u.status === 'active' ? 'text-red-400' : 'text-green-400'}`}>
                                {u.status === 'active'
                                  ? <><ShieldOff className="w-4 h-4" /> Suspend User</>
                                  : <><ShieldCheck className="w-4 h-4" /> Reactivate User</>}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Showing {displayed.length} of {users.length} users</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {walletUser && (
          <WalletModal
            user={walletUser}
            token={token}
            onClose={() => setWalletUser(null)}
            onSave={(updated) => setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, walletAddresses: updated.walletAddresses } : u))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
