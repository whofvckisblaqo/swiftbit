const COINGECKO_IDS = 'bitcoin,ethereum,solana,ripple,cardano,dogecoin,tether,binancecoin';

const ID_MAP = {
  bitcoin:     ['BTC'],
  ethereum:    ['ETH'],
  solana:      ['SOL'],
  ripple:      ['XRP'],
  cardano:     ['ADA'],
  dogecoin:    ['DOGE'],
  tether:      ['USDT_TRC20', 'USDT_ERC20'],
  binancecoin: ['BNB'],
};

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 30_000;

export async function getLivePrices() {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_IDS}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const raw = await res.json();
    const prices = {};

    for (const [geckoId, symbols] of Object.entries(ID_MAP)) {
      const d = raw[geckoId];
      if (!d) continue;
      for (const sym of symbols) {
        prices[sym] = {
          price: d.usd,
          change24h: parseFloat((d.usd_24h_change || 0).toFixed(2)),
          change7d: parseFloat((d.usd_7d_change || 0).toFixed(2)),
        };
      }
    }

    cache = { prices, updatedAt: now };
    cacheTime = now;
    return cache;
  } catch (err) {
    console.error('[prices]', err.message);
    return cache || { prices: {} };
  }
}
