'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Eye, Clock, Search, UserCheck } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

const riskColor = { low: 'text-green-400 bg-green-500/10', medium: 'text-yellow-400 bg-yellow-500/10', high: 'text-red-400 bg-red-500/10' };

export default function KycPage() {
  const { kycQueue, approveKyc, rejectKyc } = useAdminStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pending');

  const displayed = kycQueue.filter(k => {
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' || k.status === tab;
    return matchSearch && matchTab;
  });

  const handleApprove = (id, name) => {
    approveKyc(id);
    toast({ message: `KYC approved for ${name}`, type: 'success' });
  };

  const handleReject = (id, name) => {
    rejectKyc(id);
    toast({ message: `KYC rejected for ${name}`, type: 'error' });
  };

  const pendingCount = kycQueue.filter(k => k.status === 'pending').length;
  const approvedCount = kycQueue.filter(k => k.status === 'approved').length;
  const rejectedCount = kycQueue.filter(k => k.status === 'rejected').length;

  return (
    <div>
      <AdminHeader title="KYC Verification" subtitle="Identity verification queue" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Review', val: pendingCount,  color: 'text-yellow-400' },
          { label: 'Approved',       val: approvedCount, color: 'text-green-400'  },
          { label: 'Rejected',       val: rejectedCount, color: 'text-red-400'    },
          { label: 'Avg Review Time', val: '4.2h',       color: 'text-blue-400'  },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicants..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {['pending', 'approved', 'rejected'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayed.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
              <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No {tab} applications</p>
            </motion.div>
          )}
          {displayed.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-base font-bold text-indigo-400 flex-shrink-0">
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="text-sm font-bold text-white">{r.name}</h4>
                      <p className="text-xs text-gray-500">{r.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full glass border border-white/10 text-gray-400">🌍 {r.country}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full glass border border-white/10 text-gray-400">{r.docType}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" /> {r.submitted}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColor[r.risk] || riskColor.low}`}>
                          {r.risk} risk
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 items-center">
                      {r.status !== 'pending' ? (
                        <span className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      ) : (
                        <>
                          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                            <Eye className="w-3.5 h-3.5" /> Review
                          </button>
                          <button onClick={() => handleApprove(r.id, r.name)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => handleReject(r.id, r.name)}
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
