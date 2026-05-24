import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const coins = [
  { name: 'Bitcoin',       symbol: 'BTC',  price: 67842,   change: 2.41,  cap: '1.34T',  color: '#f7931a' },
  { name: 'Ethereum',      symbol: 'ETH',  price: 3521,    change: 1.87,  cap: '423B',   color: '#627eea' },
  { name: 'USDT',          symbol: 'USDT', price: 1.00,    change: 0.01,  cap: '119B',   color: '#26a17b' },
  { name: 'BNB',           symbol: 'BNB',  price: 582,     change: -0.93, cap: '85B',    color: '#f3ba2f' },
  { name: 'Solana',        symbol: 'SOL',  price: 178,     change: 4.12,  cap: '82B',    color: '#9945ff' },
  { name: 'XRP',           symbol: 'XRP',  price: 0.62,    change: -1.24, cap: '67B',    color: '#346aa9' },
  { name: 'USD Coin',      symbol: 'USDC', price: 1.00,    change: 0.00,  cap: '44B',    color: '#2775ca' },
  { name: 'Cardano',       symbol: 'ADA',  price: 0.49,    change: 1.55,  cap: '17B',    color: '#0d1e2e' },
  { name: 'Avalanche',     symbol: 'AVAX', price: 38.2,    change: 3.02,  cap: '16B',    color: '#e84142' },
  { name: 'Chainlink',     symbol: 'LINK', price: 18.7,    change: 2.88,  cap: '11B',    color: '#375bd2' },
  { name: 'Polkadot',      symbol: 'DOT',  price: 8.42,    change: -0.55, cap: '11B',    color: '#e6007a' },
  { name: 'Litecoin',      symbol: 'LTC',  price: 91.3,    change: 0.77,  cap: '6.8B',   color: '#bfbbbb' },
];

function fmt(n) {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1)    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toFixed(4);
}

export default function MarketsPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Live Markets</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Real-time crypto <span className="text-green-400">prices</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Track prices, market caps, and 24-hour performance across 100+ assets — updated live.
          </p>
        </div>
      </section>

      {/* Market Table */}
      <section className="py-10">
        <div className="container">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] overflow-hidden">
            <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-gray-600">
              <span>#</span>
              <span>Asset</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h</span>
              <span className="text-right">Market Cap</span>
            </div>
            {coins.map((coin, i) => (
              <div key={coin.symbol}
                className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center">
                <span className="text-gray-600 text-sm">{i + 1}</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: coin.color + '22', color: coin.color }}>
                    {coin.symbol[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{coin.name}</p>
                    <p className="text-gray-600 text-xs">{coin.symbol}</p>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm text-right">${fmt(coin.price)}</p>
                <p className={`text-sm font-semibold text-right flex items-center justify-end gap-1 ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {coin.change >= 0 ? '+' : ''}{coin.change}%
                </p>
                <p className="text-gray-400 text-sm text-right">${coin.cap}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-700 text-xs mt-6">
            Prices are indicative. Sign in for live data and real trading.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Trade these assets on SwiftBit</h2>
          <p className="text-gray-500 mb-8">Zero fees for your first 30 days. No minimums.</p>
          <Link href="/register" className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base">
            Start Trading <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
