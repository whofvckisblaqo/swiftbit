import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    slug:     'bitcoin-halving-2024',
    category: 'Market Analysis',
    title:    'Bitcoin Halving 2024: What It Means for Your Portfolio',
    excerpt:  'The fourth Bitcoin halving reduced miner rewards from 6.25 to 3.125 BTC. We break down the historical price action and what to expect next.',
    date:     'May 10, 2024',
    readTime: '6 min read',
    author:   'Sarah Chen',
    color:    'text-yellow-400 bg-yellow-400/10',
  },
  {
    slug:     'defi-yield-strategies',
    category: 'Education',
    title:    '5 DeFi Yield Strategies for Passive Income in 2024',
    excerpt:  'From liquidity provision to staking, we explore five battle-tested DeFi strategies to grow your crypto holdings without active trading.',
    date:     'April 22, 2024',
    readTime: '8 min read',
    author:   'Priya Nair',
    color:    'text-purple-400 bg-purple-400/10',
  },
  {
    slug:     'swiftbit-card-launch',
    category: 'Product Update',
    title:    'Introducing the SwiftBit Crypto Card: Spend Anywhere, Earn Bitcoin',
    excerpt:  'Today we launch the SwiftBit Visa card — three tiers, up to 5% cashback in BTC, and accepted at 70M+ merchants worldwide.',
    date:     'April 5, 2024',
    readTime: '4 min read',
    author:   'Alex Okafor',
    color:    'text-green-400 bg-green-400/10',
  },
  {
    slug:     'ethereum-etf-approved',
    category: 'Market Analysis',
    title:    'Ethereum Spot ETFs Approved: A New Era for Institutional Crypto',
    excerpt:  'The SEC approval of spot ETH ETFs marks a watershed moment. We analyze the capital inflow projections and price implications.',
    date:     'March 18, 2024',
    readTime: '5 min read',
    author:   'Marcus Webb',
    color:    'text-blue-400 bg-blue-400/10',
  },
  {
    slug:     'secure-your-crypto',
    category: 'Security',
    title:    '10 Steps to Secure Your Crypto in 2024',
    excerpt:  'Hardware wallets, 2FA, phishing awareness — a comprehensive checklist to protect your digital assets from common attack vectors.',
    date:     'March 2, 2024',
    readTime: '7 min read',
    author:   'Marcus Webb',
    color:    'text-red-400 bg-red-400/10',
  },
  {
    slug:     'mica-regulation-explainer',
    category: 'Regulation',
    title:    'MiCA Explained: How EU Crypto Regulation Affects You',
    excerpt:  "The EU's Markets in Crypto-Assets regulation is now live. Here's what it means for SwiftBit users in Europe — and why it's good news.",
    date:     'February 14, 2024',
    readTime: '9 min read',
    author:   'David Park',
    color:    'text-gray-400 bg-gray-400/10',
  },
];

const categories = ['All', 'Market Analysis', 'Education', 'Product Update', 'Security', 'Regulation'];

export default function BlogPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.08), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">SwiftBit Blog</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Insights & <span className="text-green-400">Updates</span>
          </h1>
          <p className="text-gray-400">Market analysis, product news, and crypto education from the SwiftBit team.</p>
        </div>
      </section>

      {/* Category filters */}
      <section className="py-4">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, i) => (
              <button key={cat}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${i === 0 ? 'bg-green-500 text-white' : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article key={post.slug}
                className="glass border border-white/5 rounded-[var(--radius-card)] p-7 flex flex-col hover:border-green-500/20 transition-all cursor-pointer">
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-5 ${post.color}`}>
                  {post.category}
                </span>
                <h2 className="text-white font-bold text-lg leading-snug mb-3 flex-1">{post.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-600 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs font-bold">{post.author[0]}</span>
                    </div>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container max-w-2xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Stay in the loop</h2>
            <p className="text-gray-500 text-sm mb-6">Get the latest market insights and SwiftBit updates delivered to your inbox weekly.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50" />
              <button className="btn-neon text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
