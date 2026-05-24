'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth, useToast } from '@/store/useAppStore';
import { getStatusColor } from '@/lib/utils';

export default function SupportPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/support', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTickets(data.tickets || []);
      if (data.stats) setStats(data.stats);
    } catch { toast({ message: 'Failed to load tickets', type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleStatus = async (id, status) => {
    try {
      await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast({ message: `Ticket marked as ${status}`, type: 'success' });
    } catch { toast({ message: 'Action failed', type: 'error' }); }
  };

  const displayed = tickets.filter(t => {
    const matchSearch = t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priority === 'all' || t.priority === priority;
    return matchSearch && matchPriority;
  });

  return (
    <div>
      <AdminHeader title="Support Tickets" subtitle="Customer support queue" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open',          val: loading ? '—' : stats.open,       color: 'text-yellow-400' },
          { label: 'In Progress',   val: loading ? '—' : stats.inProgress, color: 'text-blue-400' },
          { label: 'Resolved',      val: loading ? '—' : stats.resolved,   color: 'text-green-400' },
          { label: 'Total',         val: loading ? '—' : tickets.length,   color: 'text-white' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..."
            className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-all" />
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {['all', 'high', 'medium', 'low'].map(p => (
            <button key={p} onClick={() => setPriority(p)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${priority === p ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>{p}</button>
          ))}
        </div>
        <button onClick={fetchData} className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-600 text-sm">Loading tickets...</div>
        ) : displayed.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No support tickets yet</p>
          </motion.div>
        ) : displayed.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-600">{t.id.slice(-8).toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(t.priority)}`}>{t.priority}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{t.subject}</h4>
                    {t.message && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.message}</p>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ${getStatusColor(t.status)}`}>{t.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>{t.userName}</span>
                  <span>·</span>
                  <span>{t.userEmail}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.time}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {t.status === 'open' && (
                <button onClick={() => handleStatus(t.id, 'in-progress')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all">In Progress</button>
              )}
              {t.status !== 'resolved' && t.status !== 'closed' && (
                <button onClick={() => handleStatus(t.id, 'resolved')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all">Resolve</button>
              )}
              {t.status !== 'closed' && (
                <button onClick={() => handleStatus(t.id, 'closed')}
                  className="text-xs px-3 py-1.5 rounded-lg glass border border-white/10 text-gray-400 hover:text-white transition-all">Close</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
