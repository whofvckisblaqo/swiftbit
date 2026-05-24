import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Shield, Lock, Eye, Server, Key, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const pillars = [
  {
    icon: Lock,
    title: 'AES-256 Encryption',
    description: 'All data — at rest and in transit — is encrypted with AES-256, the same standard used by governments and financial institutions worldwide.',
  },
  {
    icon: Shield,
    title: 'Cold Storage',
    description: '95% of all user assets are held in air-gapped cold wallets, physically isolated from internet-connected systems to prevent remote attacks.',
  },
  {
    icon: Key,
    title: 'Multi-Signature Wallets',
    description: 'Every withdrawal requires multiple independent signatures from geographically distributed key-holders — no single point of failure.',
  },
  {
    icon: Eye,
    title: '24/7 Threat Monitoring',
    description: 'Our security operations center monitors all transactions and infrastructure in real time, with automated anomaly detection and instant alerts.',
  },
  {
    icon: Server,
    title: 'DDoS Protection',
    description: 'Multi-layer DDoS mitigation through enterprise-grade CDN and rate-limiting ensures 99.9% platform uptime even under attack.',
  },
  {
    icon: AlertTriangle,
    title: 'Proof of Reserves',
    description: 'Monthly third-party audits verify that SwiftBit holds 1:1 reserves for every user asset. Fully transparent, always.',
  },
];

const certifications = [
  'SOC 2 Type II Certified',
  'ISO 27001 Compliant',
  'PCI DSS Level 1',
  'FCA Authorized',
  'MiCA Compliant',
  'GDPR Compliant',
];

export default function SecurityPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Security First</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Your funds are <span className="text-green-400">fortress-level</span> safe
          </h1>
          <p className="text-gray-400 text-lg">
            SwiftBit is built from the ground up with security as the top priority — not an afterthought.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
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

      {/* Certifications */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-10">Certifications & Compliance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {certifications.map(cert => (
              <div key={cert} className="glass border border-white/5 rounded-2xl p-5 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bug Bounty CTA */}
      <section className="py-16">
        <div className="container max-w-2xl mx-auto">
          <div className="glass border border-green-500/10 rounded-[var(--radius-card)] p-10 text-center">
            <Shield className="w-10 h-10 text-green-400 mx-auto mb-5" />
            <h2 className="text-2xl font-black text-white mb-3">Found a vulnerability?</h2>
            <p className="text-gray-500 mb-6 text-sm">We run a responsible disclosure program. Report security issues and earn rewards up to $50,000.</p>
            <Link href="/bug-bounty" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-2xl text-sm">
              View Bug Bounty Program <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
