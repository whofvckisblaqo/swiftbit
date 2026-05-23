'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Fingerprint, Server, Award } from 'lucide-react';

const pillars = [
  { icon: Lock,        title: 'AES-256 Encryption',  desc: 'Military-grade encryption for all data at rest and in transit.' },
  { icon: Fingerprint, title: 'Biometric Auth',       desc: 'Face ID and fingerprint login for instant, passwordless access.' },
  { icon: Eye,         title: '24 / 7 Monitoring',   desc: 'Real-time anomaly detection with automated threat response.' },
  { icon: Server,      title: 'Cold Storage 98%',     desc: 'Majority of assets held in air-gapped, offline cold wallets.' },
  { icon: Award,       title: 'SOC2 Certified',       desc: 'Independently audited by Big-4 security firms every year.' },
  { icon: Shield,      title: '$500M Insurance',      desc: "Full asset coverage through Lloyd's of London policy." },
];

export default function Security() {
  return (
    <section id="security" className="section bg-[#07090d]">

      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="orb w-[600px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
          style={{ background: '#22c55e' }} />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* ── Left: text + pillars ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-10"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Security First</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-5">
                Your crypto,{' '}
                <span className="gradient-text">Fort Knox</span>{' '}
                protected
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                We obsess over security so you don't have to. Every layer of SwiftBit is engineered to protect your assets with the highest standards in the industry.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <p.icon className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{p.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: security status card ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="glass rounded-[var(--radius-card)] p-8 border border-white/5">

              {/* Shield visual */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-28 h-28 rounded-full flex items-center justify-center glow-green"
                    style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15), rgba(34,197,94,0.04))' }}
                  >
                    <Shield className="w-14 h-14 text-green-400" />
                  </motion.div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-4 border-[#07090d] flex items-center justify-center">
                    <span className="text-[10px] font-black text-black">✓</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Protected 24 / 7</h3>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>

              {/* Metric row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { val: '99.99%', lbl: 'Uptime' },
                  { val: '0',      lbl: 'Breaches' },
                  { val: '$500M',  lbl: 'Insured' },
                ].map(m => (
                  <div key={m.lbl} className="text-center py-3 rounded-xl bg-white/3 border border-white/5">
                    <p className="text-base font-black text-green-400">{m.val}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">{m.lbl}</p>
                  </div>
                ))}
              </div>

              {/* Event feed */}
              <div className="space-y-2.5">
                {[
                  { msg: 'Login verified — biometric auth',      time: 'just now', ok: true  },
                  { msg: 'Transaction signed — 2FA confirmed',   time: '2 min',    ok: true  },
                  { msg: 'Suspicious IP blocked automatically',  time: '9 min',    ok: false },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${e.ok ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-gray-500 flex-1">{e.msg}</span>
                    <span className="text-gray-700 shrink-0">{e.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
