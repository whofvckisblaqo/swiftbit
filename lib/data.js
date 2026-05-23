// Mock crypto data for SwiftBit platform

export const cryptoAssets = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 67842.50, change24h: 2.34, change7d: 8.12, marketCap: '1.33T', volume: '38.2B', balance: 0.4821, usdValue: 32712.89, icon: '₿', color: '#f7931a', sparkline: [62000, 63500, 65000, 64200, 66000, 67000, 67842] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3542.80, change24h: 1.87, change7d: 5.43, marketCap: '425.8B', volume: '19.4B', balance: 4.2314, usdValue: 14994.72, icon: 'Ξ', color: '#627eea', sparkline: [3200, 3350, 3400, 3300, 3450, 3520, 3542] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 182.40, change24h: 4.21, change7d: 12.8, marketCap: '84.3B', volume: '4.8B', balance: 28.5, usdValue: 5198.40, icon: '◎', color: '#9945ff', sparkline: [160, 165, 170, 168, 175, 180, 182] },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.6182, change24h: -0.87, change7d: 3.21, marketCap: '34.7B', volume: '1.9B', balance: 4200, usdValue: 2596.44, icon: '✕', color: '#00aae4', sparkline: [0.58, 0.60, 0.62, 0.61, 0.615, 0.620, 0.618] },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.4821, change24h: -1.23, change7d: -2.45, marketCap: '17.1B', volume: '654M', balance: 8500, usdValue: 4097.85, icon: '₳', color: '#0033ad', sparkline: [0.50, 0.49, 0.48, 0.485, 0.482, 0.481, 0.482] },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.1634, change24h: 3.45, change7d: 15.2, marketCap: '23.8B', volume: '2.1B', balance: 15000, usdValue: 2451.00, icon: 'Ð', color: '#c2a633', sparkline: [0.14, 0.15, 0.158, 0.155, 0.160, 0.162, 0.163] },
  { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.0001, change24h: 0.01, change7d: 0.02, marketCap: '118.4B', volume: '67.2B', balance: 5000, usdValue: 5000.50, icon: '₮', color: '#26a17b', sparkline: [1.000, 1.000, 1.001, 1.000, 1.000, 1.001, 1.000] },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 582.30, change24h: 0.92, change7d: 4.67, marketCap: '84.7B', volume: '2.3B', balance: 8.32, usdValue: 4844.73, icon: 'B', color: '#f3ba2f', sparkline: [560, 565, 570, 568, 575, 580, 582] },
];

export const topGainers = cryptoAssets.filter(a => a.change24h > 0).sort((a, b) => b.change24h - a.change24h);
export const topLosers = cryptoAssets.filter(a => a.change24h < 0).sort((a, b) => a.change24h - b.change24h);

export const portfolioData = [
  { time: '00:00', value: 58420 },
  { time: '02:00', value: 57800 },
  { time: '04:00', value: 59100 },
  { time: '06:00', value: 60200 },
  { time: '08:00', value: 59600 },
  { time: '10:00', value: 61500 },
  { time: '12:00', value: 62800 },
  { time: '14:00', value: 63200 },
  { time: '16:00', value: 61900 },
  { time: '18:00', value: 64500 },
  { time: '20:00', value: 65800 },
  { time: '22:00', value: 66420 },
  { time: '24:00', value: 67894 },
];

export const weeklyData = [
  { day: 'Mon', value: 58000 },
  { day: 'Tue', value: 61000 },
  { day: 'Wed', value: 59500 },
  { day: 'Thu', value: 63000 },
  { day: 'Fri', value: 65000 },
  { day: 'Sat', value: 64200 },
  { day: 'Sun', value: 67894 },
];

export const transactions = [
  { id: 'tx001', type: 'buy', coin: 'BTC', symbol: 'BTC', amount: 0.0521, usdValue: 3534.77, status: 'completed', time: '2 mins ago', date: '2024-01-15 14:32', fee: 3.50 },
  { id: 'tx002', type: 'receive', coin: 'Ethereum', symbol: 'ETH', amount: 1.5, usdValue: 5314.20, status: 'completed', time: '1 hour ago', date: '2024-01-15 13:18', fee: 0 },
  { id: 'tx003', type: 'swap', coin: 'SOL → ETH', symbol: 'SOL', amount: 10, usdValue: 1824.00, status: 'completed', time: '3 hours ago', date: '2024-01-15 11:05', fee: 2.20 },
  { id: 'tx004', type: 'send', coin: 'XRP', symbol: 'XRP', amount: 500, usdValue: 309.10, status: 'completed', time: '5 hours ago', date: '2024-01-15 09:42', fee: 0.25 },
  { id: 'tx005', type: 'sell', coin: 'DOGE', symbol: 'DOGE', amount: 5000, usdValue: 817.00, status: 'completed', time: '1 day ago', date: '2024-01-14 18:30', fee: 1.80 },
  { id: 'tx006', type: 'deposit', coin: 'USDT', symbol: 'USDT', amount: 2000, usdValue: 2000.00, status: 'pending', time: '1 day ago', date: '2024-01-14 15:22', fee: 0 },
  { id: 'tx007', type: 'buy', coin: 'BNB', symbol: 'BNB', amount: 2.5, usdValue: 1455.75, status: 'completed', time: '2 days ago', date: '2024-01-13 20:11', fee: 2.90 },
  { id: 'tx008', type: 'withdraw', coin: 'Bitcoin', symbol: 'BTC', amount: 0.1, usdValue: 6784.25, status: 'failed', time: '3 days ago', date: '2024-01-12 11:00', fee: 5.00 },
];

export const adminStats = {
  totalUsers: 248392,
  activeUsers: 184521,
  totalBalance: '2.84B',
  dailyDeposits: '12.4M',
  dailyWithdrawals: '8.9M',
  revenue: '184.2K',
  activeLoans: 3842,
  kycPending: 284,
  supportTickets: 127,
};

export const adminUsers = [
  { id: 'u001', name: 'Alex Johnson', email: 'alex@example.com', balance: '$124,580', kyc: 'verified', status: 'active', joined: 'Jan 12, 2024', country: 'US' },
  { id: 'u002', name: 'Sarah Chen', email: 'sarah@example.com', balance: '$89,320', kyc: 'verified', status: 'active', joined: 'Jan 10, 2024', country: 'SG' },
  { id: 'u003', name: 'Mohammed Al-Rashid', email: 'mo@example.com', balance: '$245,100', kyc: 'pending', status: 'active', joined: 'Jan 8, 2024', country: 'AE' },
  { id: 'u004', name: 'Emma Williams', email: 'emma@example.com', balance: '$32,450', kyc: 'verified', status: 'suspended', joined: 'Jan 5, 2024', country: 'UK' },
  { id: 'u005', name: 'Carlos Mendez', email: 'carlos@example.com', balance: '$78,900', kyc: 'verified', status: 'active', joined: 'Jan 3, 2024', country: 'MX' },
  { id: 'u006', name: 'Priya Patel', email: 'priya@example.com', balance: '$156,780', kyc: 'rejected', status: 'active', joined: 'Dec 28, 2023', country: 'IN' },
];

export const adminTransactions = [
  { id: 'TXN-84921', user: 'Alex Johnson', type: 'deposit', amount: '$12,500', coin: 'BTC', status: 'completed', time: '2 mins ago' },
  { id: 'TXN-84920', user: 'Sarah Chen', type: 'withdrawal', amount: '$8,200', coin: 'ETH', status: 'pending', time: '8 mins ago' },
  { id: 'TXN-84919', user: 'Emma Williams', type: 'swap', amount: '$3,400', coin: 'SOL', status: 'completed', time: '15 mins ago' },
  { id: 'TXN-84918', user: 'Mohammed Al-Rashid', type: 'buy', amount: '$25,000', coin: 'BTC', status: 'completed', time: '22 mins ago' },
  { id: 'TXN-84917', user: 'Carlos Mendez', type: 'sell', amount: '$5,600', coin: 'ADA', status: 'failed', time: '35 mins ago' },
  { id: 'TXN-84916', user: 'Priya Patel', type: 'deposit', amount: '$18,900', coin: 'USDT', status: 'completed', time: '1 hour ago' },
];

export const adminChartData = [
  { month: 'Jul', deposits: 4.2, withdrawals: 3.1, revenue: 0.18 },
  { month: 'Aug', deposits: 5.8, withdrawals: 4.2, revenue: 0.24 },
  { month: 'Sep', deposits: 4.9, withdrawals: 3.8, revenue: 0.20 },
  { month: 'Oct', deposits: 7.2, withdrawals: 5.1, revenue: 0.31 },
  { month: 'Nov', deposits: 9.1, withdrawals: 6.8, revenue: 0.42 },
  { month: 'Dec', deposits: 11.4, withdrawals: 8.2, revenue: 0.51 },
  { month: 'Jan', deposits: 12.4, withdrawals: 8.9, revenue: 0.58 },
];

export const kycRequests = [
  { id: 'kyc001', name: 'James Wilson', email: 'james@example.com', country: 'US', submitted: '2 hours ago', docType: 'Passport', risk: 'low' },
  { id: 'kyc002', name: 'Liu Wei', email: 'liu@example.com', country: 'CN', submitted: '4 hours ago', docType: 'National ID', risk: 'medium' },
  { id: 'kyc003', name: 'Amara Osei', email: 'amara@example.com', country: 'GH', submitted: '6 hours ago', docType: 'Driver License', risk: 'low' },
  { id: 'kyc004', name: 'Ivan Petrov', email: 'ivan@example.com', country: 'RU', submitted: '8 hours ago', docType: 'Passport', risk: 'high' },
];

export const supportTickets = [
  { id: 'TKT-1284', user: 'Alex Johnson', subject: 'Withdrawal not received', priority: 'high', status: 'open', time: '30 mins ago' },
  { id: 'TKT-1283', user: 'Sarah Chen', subject: 'KYC verification stuck', priority: 'medium', status: 'in-progress', time: '2 hours ago' },
  { id: 'TKT-1282', user: 'Carlos Mendez', subject: 'App crash on swap', priority: 'medium', status: 'open', time: '4 hours ago' },
  { id: 'TKT-1281', user: 'Emma Williams', subject: 'Account access issue', priority: 'low', status: 'resolved', time: '1 day ago' },
  { id: 'TKT-1280', user: 'Priya Patel', subject: 'Transaction fee query', priority: 'low', status: 'resolved', time: '2 days ago' },
];

export const walletAddress = '0x7F4e3a8B2c1D9f6E5A3b8C4d7E2f1A9b3C5d8E4f';

export const features = [
  { icon: 'Shield', title: 'Bank-Grade Security', desc: 'Multi-layer encryption, biometric auth, and cold storage for your assets.' },
  { icon: 'Zap', title: 'Instant Swaps', desc: 'Swap 200+ cryptocurrencies instantly with best-in-class exchange rates.' },
  { icon: 'Globe', title: 'Global Access', desc: 'Send and receive crypto to 150+ countries with near-zero fees.' },
  { icon: 'TrendingUp', title: 'Earn & Grow', desc: 'Stake assets and earn up to 18.5% APY with flexible terms.' },
  { icon: 'CreditCard', title: 'Crypto Card', desc: 'Spend crypto anywhere Visa is accepted with instant conversion.' },
  { icon: 'BarChart2', title: 'Advanced Analytics', desc: 'Real-time portfolio tracking with professional-grade charts.' },
];

export const testimonials = [
  { name: 'Marcus K.', role: 'Crypto Trader', avatar: 'MK', text: 'SwiftBit is hands down the best crypto platform I\'ve used. The interface is stunning and trades execute instantly.', stars: 5, country: '🇺🇸' },
  { name: 'Yuki T.', role: 'DeFi Investor', avatar: 'YT', text: 'The portfolio analytics alone are worth it. I can finally see all my holdings in one beautiful dashboard.', stars: 5, country: '🇯🇵' },
  { name: 'Amira S.', role: 'Business Owner', avatar: 'AS', text: 'I use the crypto card for everything. Converting to fiat is seamless and the rates are always competitive.', stars: 5, country: '🇦🇪' },
  { name: 'David L.', role: 'Software Engineer', avatar: 'DL', text: 'The security features give me complete confidence. Biometric auth + hardware wallet integration is unmatched.', stars: 5, country: '🇬🇧' },
];

export const faqs = [
  { q: 'How do I get started with SwiftBit?', a: 'Simply create an account, complete KYC verification in minutes, and you\'re ready to buy, sell, and swap crypto instantly.' },
  { q: 'Is SwiftBit secure?', a: 'Yes. We use bank-grade AES-256 encryption, cold storage for 98% of assets, biometric authentication, and are audited by top security firms.' },
  { q: 'What cryptocurrencies are supported?', a: 'SwiftBit supports 200+ cryptocurrencies including BTC, ETH, SOL, XRP, ADA, DOGE, USDT, BNB, and many more.' },
  { q: 'What are the fees?', a: 'Trading fees start at 0.1% for takers and 0.08% for makers. We offer zero-fee deposits and competitive withdrawal rates.' },
  { q: 'How do I earn yield on my crypto?', a: 'Stake your assets through our Earn section to get up to 18.5% APY on supported tokens with flexible or locked terms.' },
  { q: 'Is there a mobile app?', a: 'Yes! SwiftBit is available on iOS and Android with full feature parity including biometric login and instant notifications.' },
];
