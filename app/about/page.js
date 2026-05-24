import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Zap, Users, Globe, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '248K+', label: 'Active Users' },
  { value: '$4.2B+', label: 'Volume Traded' },
  { value: '180+', label: 'Countries Served' },
  { value: '2019', label: 'Founded' },
];

const team = [
  { name: 'Alex Okafor', role: 'Chief Executive Officer', initials: 'AO' },
  { name: 'Sarah Chen',  role: 'Chief Technology Officer', initials: 'SC' },
  { name: 'Marcus Webb', role: 'Chief Security Officer',   initials: 'MW' },
  { name: 'Priya Nair',  role: 'Chief Product Officer',   initials: 'PN' },
  { name: 'David Park',  role: 'Head of Compliance',      initials: 'DP' },
  { name: 'Amara Diallo', role: 'Head of Operations',     initials: 'AD' },
];

const values = [
  { icon: Zap,        title: 'Speed',       desc: 'We obsess over performance at every layer — from latency to UX.' },
  { icon: Globe,      title: 'Access',      desc: 'Financial tools should be available to everyone, everywhere.' },
  { icon: Users,      title: 'Trust',       desc: 'We earn trust through transparency, security, and accountability.' },
  { icon: TrendingUp, title: 'Innovation',  desc: 'We ship fast, iterate relentlessly, and never settle for good enough.' },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">About SwiftBit</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Reimagining <span className="text-green-400">crypto banking</span> for everyone
          </h1>
          <p className="text-gray-400 text-lg">
            SwiftBit was founded with a simple mission: make professional crypto finance accessible to anyone, anywhere.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="glass border border-white/5 rounded-2xl p-7 text-center">
                <p className="text-3xl font-black text-green-400 mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-6">Our story</h2>
          <div className="space-y-5 text-gray-400 leading-relaxed">
            <p>
              SwiftBit was born in 2019 from a simple frustration: crypto trading tools were either too complex for newcomers or too limited for professionals. There was no middle ground.
            </p>
            <p>
              Our founding team — engineers and traders from Goldman Sachs, Binance, and Coinbase — spent two years building the platform they wished had existed. One that combined institutional-grade security with consumer-grade simplicity.
            </p>
            <p>
              Today, SwiftBit serves over 248,000 users across 180 countries, facilitating billions in monthly volume. We are regulated by the FCA in the UK and MiCA-compliant across the EU.
            </p>
            <p>
              But we are just getting started. Our roadmap includes decentralized identity, AI-powered portfolio management, and crypto-backed lending — all coming in 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-black text-white text-center mb-10">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-7 text-center hover:border-green-500/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-10">Leadership team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name} className="glass border border-white/5 rounded-[var(--radius-card)] p-6 text-center hover:border-green-500/15 transition-all">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 font-black text-lg">{member.initials}</span>
                </div>
                <p className="text-white font-bold text-sm">{member.name}</p>
                <p className="text-gray-500 text-xs mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Join us on this journey</h2>
          <p className="text-gray-500 mb-8">We are always looking for exceptional people. View open roles on our Careers page.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-2xl text-sm">
              View Careers <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="glass border border-white/10 inline-flex items-center gap-2 text-gray-300 font-bold px-8 py-3 rounded-2xl text-sm hover:border-white/20 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
