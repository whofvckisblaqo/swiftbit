import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Zap, Shield, TrendingUp, RefreshCw, Bell, Smartphone, Globe, Lock, BarChart3, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Zap,
    title: 'Instant Transactions',
    description: 'Buy, sell, and swap crypto in seconds. Our optimized infrastructure ensures your trades execute at lightning speed with minimal slippage.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: '256-bit AES encryption, multi-sig wallets, and cold storage for 95% of all assets. Your funds are protected by enterprise-level security.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Markets',
    description: 'Live price feeds from 50+ exchanges aggregated into one powerful dashboard. Never miss a market move.',
  },
  {
    icon: RefreshCw,
    title: 'Smart Swap Engine',
    description: 'Swap between 100+ cryptocurrencies instantly with best-rate routing across multiple liquidity pools — no manual bridging.',
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Set custom alerts for any asset. Get notified via push, email, or SMS the moment your target price is hit.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'A seamless experience on every device. Full feature parity between desktop and mobile — trade anywhere, anytime.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Available in 180+ countries with support for 40+ fiat currencies. On-ramp and off-ramp wherever you are.',
  },
  {
    icon: Lock,
    title: 'Non-Custodial Option',
    description: 'Keep control of your private keys. SwiftBit supports hardware wallet integration with Ledger and Trezor.',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Analytics',
    description: 'Detailed P&L tracking, tax reports, and performance analytics across all your holdings — all in one place.',
  },
  {
    icon: Wallet,
    title: 'Multi-Wallet Support',
    description: 'Manage multiple wallets under a single account. Organize by strategy, purpose, or risk profile.',
  },
];

export default function FeaturesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.12), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Platform Features</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Everything you need to trade <span className="text-green-400">smarter</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            SwiftBit packs professional-grade tools into an interface anyone can use. From your first trade to your thousandth.
          </p>
          <Link href="/register" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-7 hover:border-green-500/20 transition-all">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to experience SwiftBit?</h2>
          <p className="text-gray-500 mb-8">Join 248,000+ traders who trust SwiftBit for their crypto journey.</p>
          <Link href="/register" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
