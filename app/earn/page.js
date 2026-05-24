import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { TrendingUp, Percent, Clock, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    title: 'Flexible Savings',
    apy: 'Up to 8.5%',
    desc: 'Earn daily interest with no lock-up period. Withdraw anytime.',
    features: ['Daily compounding', 'Instant withdrawal', 'No minimum deposit'],
    badge: 'Most Popular',
    badgeColor: 'text-green-400 bg-green-400/10',
  },
  {
    title: 'Fixed-Term Staking',
    apy: 'Up to 18.2%',
    desc: 'Lock your assets for 30, 90, or 180 days for higher yields.',
    features: ['Higher APY rates', 'Guaranteed returns', 'Auto-renew option'],
    badge: 'Best Rates',
    badgeColor: 'text-yellow-400 bg-yellow-400/10',
  },
  {
    title: 'DeFi Yield',
    apy: 'Up to 32%',
    desc: 'Access curated DeFi protocols with one click — no wallet setup needed.',
    features: ['Battle-tested protocols', 'Auto risk scoring', 'Instant deployment'],
    badge: 'Highest Yield',
    badgeColor: 'text-purple-400 bg-purple-400/10',
  },
];

const supportedAssets = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'ADA', 'DOT', 'AVAX', 'LINK'];

export default function EarnPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Earn with SwiftBit</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Put your crypto <span className="text-green-400">to work</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Earn up to 32% APY on your idle assets. Flexible or fixed — your choice.
          </p>
          <Link href="/register" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base">
            Start Earning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Value Locked', value: '$2.8B' },
              { label: 'Users Earning', value: '148,000+' },
              { label: 'Interest Paid Out', value: '$340M+' },
            ].map(s => (
              <div key={s.label} className="glass border border-white/5 rounded-2xl p-7 text-center">
                <p className="text-3xl font-black text-green-400 mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-black text-white text-center mb-10">Choose your strategy</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.title} className="glass border border-white/5 rounded-[var(--radius-card)] p-8 hover:border-green-500/20 transition-all flex flex-col">
                <div className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-5 ${p.badgeColor}`}>{p.badge}</div>
                <h3 className="text-white font-bold text-xl mb-1">{p.title}</h3>
                <p className="text-3xl font-black text-green-400 mb-3">{p.apy}</p>
                <p className="text-gray-500 text-sm mb-6 flex-1">{p.desc}</p>
                <ul className="space-y-2 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn-neon text-center text-white font-bold px-6 py-3 rounded-2xl text-sm">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Assets */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-8">Supported assets</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {supportedAssets.map(a => (
              <span key={a} className="glass border border-white/5 rounded-full px-5 py-2 text-sm font-bold text-gray-300">{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-16">
        <div className="container max-w-2xl mx-auto">
          <p className="text-xs text-gray-700 text-center leading-relaxed">
            APY rates are variable and subject to change. Past performance does not guarantee future results. Crypto assets are not covered by deposit protection schemes. Please read our{' '}
            <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-300 underline">Terms of Service</Link>{' '}
            before investing.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
