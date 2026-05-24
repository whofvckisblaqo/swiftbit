import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Search, ChevronDown, ArrowRight, MessageCircle, Mail, BookOpen } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    icon: '🔑',
    title: 'Account & Security',
    articles: ['How to reset your password', 'Setting up two-factor authentication', 'How to update your email address', 'What to do if your account is locked'],
  },
  {
    icon: '💱',
    title: 'Buying & Selling',
    articles: ['How to buy cryptocurrency', 'How to sell crypto for fiat', 'Why is my transaction pending?', 'Understanding trading fees'],
  },
  {
    icon: '📤',
    title: 'Sending & Receiving',
    articles: ['How to send crypto to an external wallet', 'How to generate a receive address', 'Why did my transfer fail?', 'Network confirmation times'],
  },
  {
    icon: '🔄',
    title: 'Swaps',
    articles: ['How crypto swaps work', 'Why are swap rates different?', 'Supported swap pairs', 'Swap limits and minimums'],
  },
  {
    icon: '✅',
    title: 'Identity Verification (KYC)',
    articles: ['How to complete KYC', 'Accepted ID document types', 'How long does verification take?', 'KYC rejected — what to do'],
  },
  {
    icon: '💳',
    title: 'SwiftBit Card',
    articles: ['How to apply for a crypto card', 'Activating your card', 'Card spending limits', 'Disputing a card transaction'],
  },
];

const faqs = [
  {
    q: 'How long do deposits take?',
    a: 'Crypto deposits are credited after the required network confirmations (typically 1–6 for BTC, 12 for ETH). Bank transfers may take 1–3 business days depending on your bank.',
  },
  {
    q: 'Are my funds insured?',
    a: 'SwiftBit holds 95% of user assets in cold storage. We carry a commercial crime insurance policy covering up to $100M. Fiat balances in your SwiftBit account are held in segregated client money accounts at FCA-authorised banks.',
  },
  {
    q: 'What are the withdrawal limits?',
    a: 'Daily crypto withdrawal limits start at $10,000 for unverified accounts and up to $250,000 for fully verified (KYC Level 2) accounts. Contact support to request higher limits for institutional needs.',
  },
  {
    q: 'How do I close my account?',
    a: 'Go to Profile → Settings → Close Account. You must first withdraw all funds and have no pending transactions. Your data will be retained for 7 years per regulatory requirements.',
  },
  {
    q: 'Does SwiftBit support stablecoins?',
    a: 'Yes. We support USDT (ERC-20 and TRC-20), USDC, BUSD, and DAI. You can buy, sell, hold, swap, and earn interest on stablecoins.',
  },
];

export default function HelpCenterPage() {
  return (
    <main>
      <Navbar />

      {/* Hero with search */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Help Center</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            How can we <span className="text-green-400">help you?</span>
          </h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles, guides, and FAQs..."
              className="w-full glass border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/40"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(cat => (
              <div key={cat.title} className="glass border border-white/5 rounded-[var(--radius-card)] p-6 hover:border-green-500/20 transition-all">
                <div className="text-2xl mb-3">{cat.icon}</div>
                <h3 className="text-white font-bold mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.articles.map(article => (
                    <li key={article}>
                      <a href="#" className="text-sm text-gray-500 hover:text-green-400 transition-colors flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 flex-shrink-0" /> {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map(faq => (
              <details key={faq.q} className="glass border border-white/5 rounded-2xl group">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none">
                  <span className="text-white font-medium text-sm">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-white text-center mb-8">Still need help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: MessageCircle, title: 'Live Chat',    desc: 'Chat with support. Average response time: under 2 minutes.', cta: 'Start Chat', href: '#' },
              { icon: Mail,          title: 'Email Us',     desc: 'Send us an email and we will reply within 24 hours.',       cta: 'Send Email', href: '/contact' },
              { icon: BookOpen,      title: 'Browse Docs',  desc: 'Detailed developer and integration documentation.',          cta: 'Read Docs',  href: '#' },
            ].map(({ icon: Icon, title, desc, cta, href }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-6 text-center hover:border-green-500/20 transition-all">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{desc}</p>
                <Link href={href} className="text-green-400 font-semibold text-sm hover:text-green-300 transition-colors">
                  {cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
