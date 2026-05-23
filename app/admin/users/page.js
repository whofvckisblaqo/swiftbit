'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MoreVertical, ShieldOff, ShieldCheck } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

export default function UsersPage() {
  const { users, toggleUserStatus } = useAdminStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);

  const displayed = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggle = (u) => {
    toggleUserStatus(u.id);
    const next = u.status === 'active' ? 'suspended' : 'active';
    toast({ message: `${u.name} has been ${next}`, type: next === 'active' ? 'success' : 'warning' });
    setMenuOpen(null);
  };

  return (
    <div onClick={() => setMenuOpen(null)}>
      <AdminHeader title="Users" subtitle={`${users.length} demo users`} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users',  val: '248,392', color: 'text-white'       },
          { label: 'Active',       val: users.filter(u => u.status === 'active').length,    color: 'text-green-400'  },
          { label: 'Suspended',    val: users.filter(u => u.status === 'suspended').length, color: 'text-red-400'    },
          { label: 'KYC Pending',  val: '284',     color: 'text-yellow-400'  },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-green-500/40 bg-transparent appearance-none min-w-[140px]">
          <option value="all" style={{ background: '#0d1117' }}>All Status</option>
          <option value="active" style={{ background: '#0d1117' }}>Active</option>
          <option value="suspended" style={{ background: '#0d1117' }}>Suspended</option>
        </select>
        <button className="btn-neon text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['User', 'Balance', 'KYC', 'Status', 'Country', 'Joined', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {displayed.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }} className="hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{u.name}</div>
                        <div className="text-xs text-gray-600">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{u.balance}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(u.kyc)}`}>{u.kyc}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getStatusColor(u.status)}`}>{u.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{u.country}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-5 py-4 relative">
                    <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === u.id ? null : u.id); }}
                      className="p-1.5 rounded-lg glass border border-white/5 text-gray-600 hover:text-gray-300 hover:border-white/15 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {menuOpen === u.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={e => e.stopPropagation()}
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
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-600">Showing {displayed.length} demo users</span>
          <div className="flex gap-1">
            {['Previous', '1', '2', '3', 'Next'].map(p => (
              <button key={p} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${p === '1' ? 'bg-green-500/20 text-green-400' : 'text-gray-600 hover:text-gray-300 glass border border-white/5'}`}>{p}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
