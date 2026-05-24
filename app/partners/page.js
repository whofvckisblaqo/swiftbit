import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArrowRight, Handshake, TrendingUp, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

const partnerTypes = [
  {
    icon: Zap,
    title: 'Technology Partners',
    desc: 'Integrate SwiftBit into your product stack. Access our REST API, webhooks, and white-label solutions.',
    cta: 'Explore API Docs',
    href: '/contact',
  },
  {
    icon: TrendingUp,
    title: 'Institutional Partners',
    desc: 'Custodians, funds, and market makers — access deep liquidity and OTC trading desks through SwiftBit Pro.',
    cta: 'Talk to Sales',
    href: '/contact',
  },
  {
    icon: Globe,
    title: 'Affiliate Partners',
    desc: 'Earn up to 40% revenue share by referring users to SwiftBit. Track everything in real time via our partner portal.',
    cta: 'Join Affiliate Program',
    href: '/contact',
  },
  {
    icon: Handshake,
    title: 'Strategic Partners',
    desc: 'Co-marketing, joint ventures, and ecosystem integrations. Let\'s build something together.',
    cta: 'Get in Touch',
    href: '/contact',
  },
];

const currentPartners = [
  { name: 'Ledger',        type: 'Hardware Wallet' },
  { name: 'Trezor',        type: 'Hardware Wallet' },
  { name: 'Chainalysis',   type: 'Compliance & AML' },
  { name: 'Fireblocks',    type: 'Custody Infrastructure' },
  { name: 'Transak',       type: 'Fiat On-Ramp' },
  { name: 'Alchemy',       type: 'Blockchain Infra' },
  { name: 'CoinGecko',     type: 'Market Data' },
  { name: 'Stripe',        type: 'Payment Processing' },
];

export default function PartnersPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Partner Ecosystem</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Grow with <span className="text-green-400">SwiftBit</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Whether you're a developer, institution, or content creator — there's a partnership model built for you.
          </p>
        </div>
      </section>

      {/* Partner types */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {partnerTypes.map(({ icon: Icon, title, desc, cta, href }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-8 flex flex-col hover:border-green-500/20 transition-all">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
                <Link href={href}
                  className="flex items-center gap-2 text-green-400 font-semibold text-sm hover:text-green-300 transition-colors">
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current partners */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-10">Trusted partners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentPartners.map(p => (
              <div key={p.name} className="glass border border-white/5 rounded-2xl p-5 text-center hover:border-green-500/15 transition-all">
                <p className="text-white font-bold text-sm mb-1">{p.name}</p>
                <p className="text-gray-600 text-xs">{p.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate highlights */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <div className="glass border border-green-500/10 rounded-[var(--radius-card)] p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { value: '40%', label: 'Revenue share' },
                { value: '$0', label: 'Cost to join' },
                { value: '3,800+', label: 'Active affiliates' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-green-400 mb-1">{s.value}</p>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/contact"
                className="btn-neon inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-2xl text-sm">
                Become an Affiliate <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
