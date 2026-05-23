'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, TrendingUp, CreditCard, BarChart2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'AES-256 encryption, biometric auth, and cold storage protecting 98% of all platform assets.',
    color: '#22c55e',
    tag: 'Security',
  },
  {
    icon: Zap,
    title: 'Lightning Swaps',
    desc: 'Swap 200+ cryptocurrencies at best-in-class rates with sub-second execution and no hidden slippage.',
    color: '#f59e0b',
    tag: 'Speed',
  },
  {
    icon: Globe,
    title: 'Global Transfers',
    desc: 'Send and receive crypto to 150+ countries with near-zero fees and instant settlement.',
    color: '#6366f1',
    tag: 'Reach',
  },
  {
    icon: TrendingUp,
    title: 'Earn & Stake',
    desc: 'Put your crypto to work. Earn up to 18.5% APY with flexible or fixed staking terms.',
    color: '#ec4899',
    tag: 'Yield',
  },
  {
    icon: CreditCard,
    title: 'Crypto Card',
    desc: 'Spend your crypto anywhere Visa is accepted — instant conversion at real exchange rates.',
    color: '#14b8a6',
    tag: 'Spend',
  },
  {
    icon: BarChart2,
    title: 'Pro Analytics',
    desc: 'Real-time portfolio tracking, advanced charting, and AI-powered market insights at your fingertips.',
    color: '#8b5cf6',
    tag: 'Insights',
  },
];

function FeatureCard({ icon: Icon, title, desc, color, tag, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group glass rounded-[var(--radius-card)] p-6 flex flex-col gap-4 hover:border-white/10 transition-colors duration-300"
    >
      {/* Tag + Icon row */}
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}12`, border: `1px solid ${color}25` }}
        >
          <Icon className="w-[22px] h-[22px]" style={{ color }} />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color, background: `${color}12`, border: `1px solid ${color}20` }}
        >
          {tag}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>

      {/* Bottom accent line */}
      <div
        className="mt-auto h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="section bg-[#07090d]">

      {/* Subtle background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="orb w-[600px] h-[400px] bottom-0 left-1/2 -translate-x-1/2 opacity-[0.05]"
          style={{ background: '#22c55e' }} />
      </div>

      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">
            Why SwiftBit
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-5">
            Everything you need to{' '}
            <span className="gradient-text">master crypto</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Built by crypto natives, for crypto natives. Every feature crafted for power, simplicity, and trust.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
