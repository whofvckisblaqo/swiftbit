import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Download, ExternalLink, Calendar } from 'lucide-react';

const pressReleases = [
  {
    date:    'May 2, 2024',
    title:   'SwiftBit Surpasses 248,000 Active Users, Announces EU Expansion',
    excerpt: 'SwiftBit today announced it has surpassed 248,000 active users globally and will launch localized services in Germany, France, and the Netherlands.',
  },
  {
    date:    'April 5, 2024',
    title:   'SwiftBit Launches Crypto Visa Card with Up to 5% BTC Cashback',
    excerpt: 'The SwiftBit Card is now available across 180 countries, offering three tiers with cashback in Bitcoin on every purchase.',
  },
  {
    date:    'March 1, 2024',
    title:   'SwiftBit Achieves MiCA Compliance Ahead of EU Crypto Regulation Deadline',
    excerpt: 'SwiftBit is now fully MiCA compliant, positioning it as one of the first crypto platforms to meet the EU regulatory framework ahead of the official deadline.',
  },
  {
    date:    'January 18, 2024',
    title:   'SwiftBit Raises $45M Series B Led by Andreessen Horowitz',
    excerpt: 'SwiftBit has closed a $45 million Series B funding round to accelerate product development and global expansion.',
  },
  {
    date:    'October 10, 2023',
    title:   'SwiftBit Introduces Proof of Reserves with Monthly Third-Party Audits',
    excerpt: 'In a commitment to radical transparency, SwiftBit now publishes monthly Proof of Reserves reports verified by Deloitte.',
  },
];

const coverage = [
  { outlet: 'Forbes',       title: 'The Crypto Platform Doing Banking Better', year: '2024' },
  { outlet: 'Bloomberg',    title: 'SwiftBit Is What Crypto Banking Should Look Like', year: '2024' },
  { outlet: 'TechCrunch',   title: 'SwiftBit Raises $45M to Take on Coinbase', year: '2024' },
  { outlet: 'The Block',    title: 'SwiftBit Leads MiCA Compliance Charge in Europe', year: '2024' },
  { outlet: 'CoinDesk',     title: 'Why SwiftBit Could Be the Next Crypto Unicorn', year: '2023' },
  { outlet: 'Wired',        title: 'Meet the App Bringing Crypto to the Masses', year: '2023' },
];

export default function PressPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.08), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Press Room</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">SwiftBit in the news</h1>
          <p className="text-gray-400">Press releases, media coverage, and brand assets for journalists and partners.</p>
        </div>
      </section>

      {/* Press kit */}
      <section className="py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="glass border border-green-500/10 rounded-[var(--radius-card)] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-xl mb-1">Press Kit</h3>
              <p className="text-gray-500 text-sm">Logos, screenshots, executive headshots, and brand guidelines.</p>
            </div>
            <button className="flex items-center gap-2 glass border border-white/10 text-gray-300 font-bold px-6 py-3 rounded-2xl text-sm hover:border-white/20 transition-all whitespace-nowrap">
              <Download className="w-4 h-4" /> Download Press Kit
            </button>
          </div>
        </div>
      </section>

      {/* Press releases */}
      <section className="py-12">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-white mb-6">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map(pr => (
              <div key={pr.title}
                className="glass border border-white/5 rounded-2xl p-6 hover:border-green-500/20 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Calendar className="w-3 h-3" /> {pr.date}
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-green-400 transition-colors">{pr.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{pr.excerpt}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1 group-hover:text-green-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media coverage */}
      <section className="py-12">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-white mb-6">Media Coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coverage.map(c => (
              <div key={c.title}
                className="glass border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-green-500/20 transition-all cursor-pointer group">
                <div>
                  <p className="text-green-400 font-bold text-sm mb-1">{c.outlet} · {c.year}</p>
                  <p className="text-gray-300 text-sm font-medium">{c.title}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0 group-hover:text-green-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media contact */}
      <section className="py-12">
        <div className="container max-w-2xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 text-center">
            <h2 className="text-xl font-black text-white mb-3">Media enquiries</h2>
            <p className="text-gray-500 text-sm mb-4">For interview requests, press credentials, and further information:</p>
            <a href="mailto:swiftbitsuport@outlook.com" className="text-green-400 font-bold hover:text-green-300 transition-colors">
              swiftbitsuport@outlook.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
