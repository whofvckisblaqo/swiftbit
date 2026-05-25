'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, ShieldOff, ShieldCheck, RefreshCw, Wallet, X, Save, PiggyBank, Trash2, ChevronDown } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast, useAuth } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';
import { cryptoAssets } from '@/lib/data';

const COIN_PRICES = Object.fromEntries(cryptoAssets.map(a => [a.symbol, a.price]));
const COIN_ICONS  = Object.fromEntries(cryptoAssets.map(a => [a.symbol, { icon: a.icon, color: a.color, name: a.name }]));

const COINS = ['BTC', 'ETH', 'USDT_TRC20', 'USDT_ERC20', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA'];

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
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">{COIN_LABELS[coin] || coin} Address</label>
              <input
                value={addresses[coin] || ''}
                onChange={e => setAddresses(prev => ({ ...prev, [coin]: e.target.value }))}
                placeholder={`Enter ${COIN_LABELS[coin] || coin} deposit address...`}
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

const COIN_LABELS = {
  BTC: 'Bitcoin', ETH: 'Ethereum',
  USDT_TRC20: 'Tether · TRC20', USDT_ERC20: 'Tether · ERC20',
  BNB: 'BNB', SOL: 'Solana', XRP: 'XRP', DOGE: 'Dogecoin', ADA: 'Cardano',
};

function FundModal({ user, token, onClose, onSave }) {
  const [balances, setBalances] = useState(
    Object.fromEntries(COINS.map(c => [c, '']))
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ walletBalances: balances }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: `Wallet funded for ${user.name}`, type: 'success' });
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
            <h3 className="text-base font-bold text-white">Fund Wallet</h3>
            <p className="text-xs text-gray-500 mt-0.5">{user.name} · {user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl glass border border-white/10 text-gray-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed">
          Enter the amount to <span className="text-yellow-400 font-semibold">add</span> to each coin balance. Existing balances are shown on the right and will not be touched if you leave a field empty.
        </p>

        <div className="space-y-3">
          {COINS.map(coin => (
            <div key={coin} className="flex items-center gap-3">
              <div className="w-24 flex-shrink-0">
                <div className="text-xs font-bold text-white">{coin}</div>
                <div className="text-[10px] text-gray-600">{COIN_LABELS[coin]}</div>
              </div>
              <input
                type="number"
                step="any"
                min="0"
                value={balances[coin]}
                onChange={e => setBalances(prev => ({ ...prev, [coin]: e.target.value }))}
                placeholder="amount to add"
                className="flex-1 glass border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-gray-700 focus:outline-none focus:border-green-500/40 transition-all"
              />
              <div className="w-20 text-right flex-shrink-0">
                <div className="text-[10px] text-gray-600">Current</div>
                <div className="text-xs font-mono text-gray-400">{(user.walletBalances?.[coin] ?? 0).toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl btn-neon text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : <><PiggyBank className="w-4 h-4" /> Fund Wallet</>}
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
  const [fundUser, setFundUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

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

  const handleDelete = async (u) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(prev => prev.filter(x => x.id !== u.id));
        toast({ message: `${u.name}'s account deleted`, type: 'success' });
      } else {
        const data = await res.json();
        toast({ message: data.error || 'Delete failed', type: 'error' });
      }
    } catch { toast({ message: 'Delete failed', type: 'error' }); }
    setDeleteConfirm(null);
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
                {['User', 'Role', 'KYC', 'Status', 'Total Balance', 'Wallets', 'Joined', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-600 text-sm">Loading users...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-600 text-sm">No users found</td></tr>
              ) : displayed.map((u, i) => {
                const balances = u.walletBalances || {};
                const totalUsd = COINS.reduce((sum, sym) => sum + (parseFloat(balances[sym]) || 0) * (COIN_PRICES[sym] || 0), 0);
                const isExpanded = expandedUser === u.id;
                return (
                  <>
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
                      <button onClick={e => { e.stopPropagation(); setExpandedUser(isExpanded ? null : u.id); }}
                        className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-green-400 transition-colors">
                        ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); setWalletUser(u); }}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium ${hasAddresses(u) ? 'text-green-400 bg-green-500/10 border-green-500/25 hover:bg-green-500/20' : 'text-gray-500 glass border-white/10 hover:text-white hover:border-white/20'}`}>
                          <Wallet className="w-3.5 h-3.5" />
                          {hasAddresses(u) ? 'Assigned' : 'Assign'}
                        </button>
                        <button onClick={e => { e.stopPropagation(); setFundUser(u); }}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium text-yellow-400 bg-yellow-500/10 border-yellow-500/25 hover:bg-yellow-500/20">
                          <PiggyBank className="w-3.5 h-3.5" />
                          Fund
                        </button>
                      </div>
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
                                <button onClick={() => { setDeleteConfirm(u); setMenuOpen(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-all border-t border-white/5">
                                  <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr key={`${u.id}-balances`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <td colSpan={8} className="px-5 pb-4 bg-white/[0.01]">
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                            {COINS.map(sym => {
                              const qty = parseFloat(balances[sym]) || 0;
                              const usd = qty * (COIN_PRICES[sym] || 0);
                              const meta = COIN_ICONS[sym] || {};
                              return (
                                <div key={sym} className="glass rounded-xl p-3 border border-white/5">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                      style={{ background: `${meta.color}20`, color: meta.color }}>{meta.icon}</div>
                                    <span className="text-xs font-semibold text-gray-400">{sym}</span>
                                  </div>
                                  <div className="text-sm font-bold text-white">
                                    {qty >= 1000 ? qty.toLocaleString('en-US', { maximumFractionDigits: 2 })
                                      : qty >= 1 ? qty.toFixed(4)
                                      : qty.toFixed(8)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-0.5">
                                    ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                  </>
                );
              })}
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
        {fundUser && (
          <FundModal
            user={fundUser}
            token={token}
            onClose={() => setFundUser(null)}
            onSave={(updated) => setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, walletBalances: updated.walletBalances } : u))}
          />
        )}
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative z-10 w-full max-w-sm glass-dark rounded-2xl border border-red-500/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Account</h3>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to permanently delete <span className="text-white font-semibold">{deleteConfirm.name}</span>'s account? All their transactions will also be removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
