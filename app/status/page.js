import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';

const services = [
  { name: 'Trading Engine',        status: 'operational', latency: '12ms' },
  { name: 'Wallet & Balances',     status: 'operational', latency: '8ms'  },
  { name: 'Deposits',              status: 'operational', latency: '—'    },
  { name: 'Withdrawals',           status: 'operational', latency: '—'    },
  { name: 'Swap Service',          status: 'operational', latency: '24ms' },
  { name: 'KYC Verification',      status: 'operational', latency: '—'    },
  { name: 'Crypto Card',           status: 'operational', latency: '—'    },
  { name: 'API (REST)',             status: 'operational', latency: '18ms' },
  { name: 'Mobile App',            status: 'operational', latency: '—'    },
  { name: 'Notification Service',  status: 'operational', latency: '—'    },
  { name: 'Price Data Feed',       status: 'operational', latency: '6ms'  },
  { name: 'Authentication',        status: 'operational', latency: '9ms'  },
];

const incidents = [
  {
    date:     'May 10, 2024',
    title:    'Delayed withdrawals — BTC & ETH',
    status:   'Resolved',
    duration: '43 minutes',
    detail:   'A surge in network congestion caused withdrawal broadcasts to queue. All pending withdrawals were processed within 43 minutes. No funds were lost.',
  },
  {
    date:     'March 28, 2024',
    title:    'Elevated API latency',
    status:   'Resolved',
    duration: '18 minutes',
    detail:   'A database index issue caused elevated response times on balance endpoints. The index was rebuilt and performance returned to normal.',
  },
];

const uptime = [
  { month: 'May 2024',  pct: 99.98 },
  { month: 'Apr 2024',  pct: 99.99 },
  { month: 'Mar 2024',  pct: 99.94 },
  { month: 'Feb 2024',  pct: 100.00 },
  { month: 'Jan 2024',  pct: 99.99 },
  { month: 'Dec 2023',  pct: 99.97 },
];

function StatusBadge({ status }) {
  if (status === 'operational')
    return <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" />Operational</span>;
  if (status === 'degraded')
    return <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" />Degraded</span>;
  return <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" />Outage</span>;
}

export default function StatusPage() {
  const allOperational = services.every(s => s.status === 'operational');

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">System Status</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">SwiftBit Status</h1>
          {allOperational ? (
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-bold text-sm">All systems operational</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-bold text-sm">Some systems degraded</span>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-10">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" /> Service Status
          </h2>
          <div className="glass border border-white/5 rounded-[var(--radius-card)] overflow-hidden">
            {services.map((svc, i) => (
              <div key={svc.name}
                className={`flex items-center justify-between px-6 py-4 ${i < services.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-gray-300 text-sm font-medium">{svc.name}</span>
                <div className="flex items-center gap-6">
                  {svc.latency !== '—' && (
                    <span className="text-gray-600 text-xs font-mono hidden sm:block">{svc.latency}</span>
                  )}
                  <StatusBadge status={svc.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime */}
      <section className="py-10">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-lg font-black text-white mb-5">Historical Uptime</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {uptime.map(u => (
              <div key={u.month} className="glass border border-white/5 rounded-2xl p-4 text-center">
                <p className={`text-lg font-black mb-1 ${u.pct === 100 ? 'text-green-400' : u.pct >= 99.9 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {u.pct}%
                </p>
                <p className="text-gray-600 text-xs">{u.month}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past incidents */}
      <section className="py-10 pb-24">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-lg font-black text-white mb-5">Past Incidents</h2>
          <div className="space-y-4">
            {incidents.map(inc => (
              <div key={inc.title} className="glass border border-white/5 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-white font-semibold text-sm">{inc.title}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-400/10 whitespace-nowrap">{inc.status}</span>
                </div>
                <p className="text-gray-600 text-xs mb-3 flex items-center gap-3">
                  <span>{inc.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Duration: {inc.duration}</span>
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{inc.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-xs mt-6">
            Subscribe to status updates at{' '}
            <a href="mailto:swiftbitsuport@outlook.com" className="text-gray-500 hover:text-gray-300 underline">swiftbitsuport@outlook.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
