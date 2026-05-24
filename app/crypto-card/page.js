import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { CreditCard, Percent, Globe, Zap, Shield, Gift, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Standard',
    color: 'from-gray-700 to-gray-800',
    borderColor: 'border-white/10',
    cashback: '1%',
    monthly: 'Free',
    perks: ['1% crypto cashback', 'Worldwide acceptance', 'Free ATM withdrawals (2/mo)', 'Virtual card included'],
  },
  {
    name: 'Gold',
    color: 'from-yellow-900 to-yellow-800',
    borderColor: 'border-yellow-500/30',
    cashback: '2%',
    monthly: '$9.99',
    perks: ['2% crypto cashback', 'Airport lounge access (4/yr)', 'Free ATM withdrawals (5/mo)', 'Travel insurance'],
    highlight: true,
  },
  {
    name: 'Obsidian',
    color: 'from-green-900 to-green-800',
    borderColor: 'border-green-500/30',
    cashback: '5%',
    monthly: '$29.99',
    perks: ['5% crypto cashback', 'Unlimited lounge access', 'Unlimited ATM withdrawals', 'Concierge service', 'Metal card'],
  },
];

const features = [
  { icon: Percent, title: 'Crypto Cashback', desc: 'Earn BTC or USDT on every purchase automatically deposited to your SwiftBit wallet.' },
  { icon: Globe, title: 'Accepted Worldwide', desc: 'Works anywhere Visa is accepted — 70+ million merchants across 200+ countries.' },
  { icon: Zap, title: 'Instant Top-Up', desc: 'Fund your card instantly from any SwiftBit wallet balance. No delays, no fuss.' },
  { icon: Shield, title: 'Freeze & Control', desc: 'Lock your card instantly from the app. Set spending limits per category or merchant.' },
];

export default function CryptoCardPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">SwiftBit Card</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Spend crypto <span className="text-green-400">anywhere</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            A Visa card linked to your crypto wallet. Earn cashback in Bitcoin on every swipe.
          </p>
          <Link href="/register" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base">
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Card visual */}
      <section className="py-10">
        <div className="container flex justify-center">
          <div className="relative w-80 h-48 rounded-2xl bg-gradient-to-br from-green-900 to-green-700 p-6 shadow-2xl shadow-green-500/20 border border-green-500/30">
            <div className="flex justify-between items-start mb-6">
              <Zap className="w-8 h-8 text-white" fill="white" />
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">VISA</span>
            </div>
            <p className="text-white/60 text-sm tracking-widest mb-4">•••• •••• •••• 4281</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/50 text-xs">Card Holder</p>
                <p className="text-white font-bold text-sm">YOUR NAME</p>
              </div>
              <div>
                <p className="text-white/50 text-xs">Expires</p>
                <p className="text-white font-bold text-sm">12/27</p>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-green-400/5" />
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-black text-white text-center mb-10">Choose your card tier</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tiers.map(t => (
              <div key={t.name}
                className={`glass border rounded-[var(--radius-card)] p-8 flex flex-col ${t.borderColor} ${t.highlight ? 'ring-1 ring-yellow-500/30' : ''}`}>
                {t.highlight && (
                  <div className="self-start text-xs font-bold px-3 py-1 rounded-full mb-4 text-yellow-400 bg-yellow-400/10">
                    Most Popular
                  </div>
                )}
                <h3 className="text-white font-black text-2xl mb-1">{t.name}</h3>
                <p className="text-4xl font-black text-green-400 mb-1">{t.cashback}</p>
                <p className="text-gray-500 text-xs mb-6">crypto cashback · {t.monthly}/mo</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {t.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn-neon text-center text-white font-bold px-6 py-3 rounded-2xl text-sm">
                  Apply for {t.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-7">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
