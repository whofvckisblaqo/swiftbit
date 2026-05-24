'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Search, UserCheck, RefreshCw } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast, useAuth } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

export default function KycPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pending');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data.users || []);
    } catch { toast({ message: 'Failed to load KYC data', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchUsers(); }, [token]);

  const handleUpdateKyc = async (id, name, status) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kycStatus: status }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, kycStatus: status } : u));
        toast({ message: `KYC ${status} for ${name}`, type: status === 'verified' ? 'success' : 'error' });
      }
    } catch { toast({ message: 'Action failed', type: 'error' }); }
  };

  const displayed = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' || u.kycStatus === tab ||
      (tab === 'pending' && u.kycStatus === 'pending') ||
      (tab === 'approved' && u.kycStatus === 'verified');
    return matchSearch && matchTab;
  });

  const pendingCount = users.filter(u => u.kycStatus === 'pending').length;
  const verifiedCount = users.filter(u => u.kycStatus === 'verified').length;
  const rejectedCount = users.filter(u => u.kycStatus === 'rejected').length;

  return (
    <div>
      <AdminHeader title="KYC Verification" subtitle="Identity verification queue" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Review', val: loading ? '—' : pendingCount, color: 'text-yellow-400' },
          { label: 'Verified',       val: loading ? '—' : verifiedCount, color: 'text-green-400' },
          { label: 'Rejected',       val: loading ? '—' : rejectedCount, color: 'text-red-400' },
          { label: 'Total Users',    val: loading ? '—' : users.length, color: 'text-white' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {[
            { key: 'pending', label: 'Pending' },
            { key: 'verified', label: 'Verified' },
            { key: 'rejected', label: 'Rejected' },
            { key: 'all', label: 'All' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.key ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={fetchUsers} className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600 text-sm">
              Loading KYC data...
            </motion.div>
          ) : displayed.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
              <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No {tab} applications</p>
            </motion.div>
          ) : displayed.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-base font-bold text-indigo-400 flex-shrink-0">
                  {u.avatar || u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="text-sm font-bold text-white">{u.name}</h4>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full glass border border-white/10 text-gray-400 capitalize">{u.role}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" /> Joined {u.joinedDate}
                        </span>
                        {u.kycLevel > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Level {u.kycLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 items-center">
                      {u.kycStatus !== 'pending' ? (
                        <span className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize ${getStatusColor(u.kycStatus === 'verified' ? 'completed' : u.kycStatus)}`}>
                          {u.kycStatus}
                        </span>
                      ) : (
                        <>
                          <button onClick={() => handleUpdateKyc(u.id, u.name, 'verified')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => handleUpdateKyc(u.id, u.name, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
